<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; // <-- Pastikan ini ter-import!
use App\Actions\AI\GenerateChatReplyAction;
use App\Actions\Message\FetchRecentContextAction;
use App\Actions\Message\SaveMessageContextAction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteController extends Controller
{
    public function webhook(
        Request $request,
        User $user, // <-- TERIMA UUID USER AKTIF DARI URL
        GenerateChatReplyAction $aiAction,
        FetchRecentContextAction $fetchAction,
        SaveMessageContextAction $saveAction
    ) {
        $sender = $request->sender;
        $message = $request->message ?? '';

        $imageUrl = $request->url ?? null;
        if ($imageUrl === 'null' || empty($imageUrl)) $imageUrl = null;
        if (trim($message) === 'non-text message') $message = '';

        // Log ditambah info ID User biar gampang tracking kalau ada error
        Log::info("📨 CHAT DARI: {$sender} | MSG: {$message} | USER: {$user->id}");

        // Command AI Off/On khusus untuk user ini
        if (strtolower(trim($message)) === '!ai off') {
            $user->settings()->updateOrCreate(['key' => 'ai_status'], ['value' => 'off']);
            $this->sendFonnte($user, $sender, "🤖 AI DIMATIKAN!");
            return response()->json(['status' => 'success']);
        }
        if (strtolower(trim($message)) === '!ai on') {
            $user->settings()->updateOrCreate(['key' => 'ai_status'], ['value' => 'on']);
            $this->sendFonnte($user, $sender, "🤖 AI DIHIDUPKAN!");
            return response()->json(['status' => 'success']);
        }

        // Cek status AI user
        $aiStatus = $user->settings()->where('key', 'ai_status')->value('value');
        if ($aiStatus !== 'on') return response()->json(['status' => 'ignored']);

        // Cari kontak khusus dari database user ini
        $cleanPhone = preg_replace('/[^0-9\-@.usg]/', '', $sender);
        $contact = $user->contacts()->where('phone_number', $cleanPhone)->where('is_active', true)->first();

        if (!$contact) return response()->json(['status' => 'ignored']);

        // ==========================================
        // 🛡️ LOGIKA ANTI-SPAM GRUP WA (STRICT MENTION)
        // ==========================================
        if ($contact->is_group) {
            $botPhoneRaw = $user->settings()->where('key', 'bot_phone')->value('value');
            if (!$botPhoneRaw) {
                $botPhoneRaw = $user->settings()->where('key', 'owner_phone')->value('value');
            }

            $botPhone = preg_replace('/[^0-9]/', '', $botPhoneRaw);

            if (!$botPhone) {
                Log::warning("⚠️ Nomor Bot belum di-setting untuk User {$user->id}!");
                return response()->json(['status' => 'ignored']);
            }

            $isMentioned = false;

            if (stripos($message, '@' . $botPhone) !== false) {
                $isMentioned = true;
                $message = trim(str_ireplace('@' . $botPhone, '', $message));
            }

            if (!$isMentioned) {
                Log::info("💤 Pesan Grup diabaikan (Tidak ada mention).");
                return response()->json(['status' => 'ignored']);
            }
        }
        // ==========================================

        // Target Persona khusus milik user ini
        $targetPersona = $contact->persona_id != null ? $contact->persona : $user->personas()->where('is_active', true)->first();
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

            // Panggil fungsi sendFonnte dengan membawa $user
            $this->sendFonnte($user, $sender, $replyMessage);

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            Log::error("🔥 ERROR: " . $e->getMessage());
            return response()->json(['status' => 'error']);
        }
    }

    // Fungsi ngirim ke Fonnte sekarang wajib pakai token milik User masing-masing
    private function sendFonnte(User $user, $target, $message)
    {
        $fonnteToken = $user->settings()->where('key', 'fonnte_token')->value('value');
        $response = Http::withHeaders(['Authorization' => $fonnteToken])->post('https://api.fonnte.com/send', [
            'target' => $target,
            'message' => $message,
            'delay' => '5-15'
        ]);
        return $response->body();
    }
}
