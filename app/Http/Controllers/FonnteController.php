<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\Contact;
use App\Models\Persona;
use App\Actions\AI\GenerateChatReplyAction;
use App\Actions\Message\FetchRecentContextAction;
use App\Actions\Message\SaveMessageContextAction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteController extends Controller
{
    public function webhook(
        Request $request,
        GenerateChatReplyAction $aiAction,
        FetchRecentContextAction $fetchAction,
        SaveMessageContextAction $saveAction
    ) {
        $sender = $request->sender;
        $message = $request->message ?? '';

        $imageUrl = $request->url ?? null;
        if ($imageUrl === 'null' || empty($imageUrl)) $imageUrl = null;
        if (trim($message) === 'non-text message') $message = '';

        Log::info("📨 CHAT DARI: {$sender} | MSG: {$message}");

        if (strtolower(trim($message)) === '!ai off') {
            Setting::updateOrCreate(['key' => 'ai_status'], ['value' => 'off']);
            $this->sendFonnte($sender, "🤖 AI DIMATIKAN!");
            return response()->json(['status' => 'success']);
        }
        if (strtolower(trim($message)) === '!ai on') {
            Setting::updateOrCreate(['key' => 'ai_status'], ['value' => 'on']);
            $this->sendFonnte($sender, "🤖 AI DIHIDUPKAN!");
            return response()->json(['status' => 'success']);
        }

        $aiStatus = Setting::where('key', 'ai_status')->value('value');
        if ($aiStatus !== 'on') return response()->json(['status' => 'ignored']);

        $cleanPhone = preg_replace('/[^0-9\-@.usg]/', '', $sender);
        $contact = Contact::where('phone_number', $cleanPhone)->where('is_active', true)->first();

        if (!$contact) return response()->json(['status' => 'ignored']);

        // ==========================================
        // 🛡️ LOGIKA ANTI-SPAM GRUP WA (STRICT MENTION)
        // ==========================================
        if ($contact->is_group) {
            // Ambil nomor khusus bot (atau fallback ke nomor owner)
            $botPhoneRaw = Setting::where('key', 'bot_phone')->value('value');
            if (!$botPhoneRaw) {
                $botPhoneRaw = Setting::where('key', 'owner_phone')->value('value');
            }

            // Ekstrak angkanya saja untuk mengatasi format aneh
            $botPhone = preg_replace('/[^0-9]/', '', $botPhoneRaw);

            if (!$botPhone) {
                Log::warning("⚠️ Nomor Bot belum di-setting! Cek menu Pengaturan.");
                return response()->json(['status' => 'ignored']);
            }

            $isMentioned = false;

            // Fonnte mengirim mention dalam format @NomorHP (misal: @19851959652463)
            if (stripos($message, '@' . $botPhone) !== false) {
                $isMentioned = true;

                // Hapus tulisan tag-nya agar otak AI fokus ke pertanyaannya
                $message = trim(str_ireplace('@' . $botPhone, '', $message));
            }

            if (!$isMentioned) {
                Log::info("💤 Pesan Grup diabaikan (Tidak ada mention ke nomor bot: @{$botPhone}).");
                return response()->json(['status' => 'ignored']);
            }
        }
        // ==========================================

        $targetPersona = $contact->persona_id != null ? $contact->persona : Persona::where('is_active', true)->first();
        if (!$targetPersona) return response()->json(['status' => 'error']);

        try {
            $chatHistory = $fetchAction->execute($contact->id);

            $textToSave = empty(trim($message)) && $imageUrl ? "[Mengirim Gambar]" : $message;
            $saveAction->execute($contact->id, 'user', $textToSave);

            $replyMessage = $aiAction->execute(
                $targetPersona->system_prompt,
                $contact->name,
                $chatHistory,
                $message,
                $imageUrl
            );

            Log::info("🤖 BALASAN: " . $replyMessage);
            if (empty(trim($replyMessage))) return response()->json(['status' => 'error']);

            $saveAction->execute($contact->id, 'assistant', $replyMessage);
            $this->sendFonnte($sender, $replyMessage);

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            Log::error("🔥 ERROR: " . $e->getMessage());
            return response()->json(['status' => 'error']);
        }
    }

    private function sendFonnte($target, $message)
    {
        $fonnteToken = Setting::where('key', 'fonnte_token')->value('value');
        $response = Http::withHeaders(['Authorization' => $fonnteToken])->post('https://api.fonnte.com/send', [
            'target' => $target,
            'message' => $message,
            'delay' => '5-15'
        ]);
        return $response->body();
    }
}
