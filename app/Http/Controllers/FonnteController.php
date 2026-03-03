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

        // --- DETEKSI FILE DARI FONNTE ---
        $imageUrl = $request->url ?? null;
        if ($imageUrl === 'null' || empty($imageUrl)) {
            $imageUrl = null;
        }

        // Hapus teks bawaan Fonnte yang bikin AI halusinasi
        if (trim($message) === 'non-text message') {
            $message = '';
        }

        Log::info("📨 CHAT DARI: {$sender} | MSG: {$message} | IMG_URL: " . ($imageUrl ?? "NO"));

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

        $cleanPhone = preg_replace('/[^0-9]/', '', $sender);
        $contact = Contact::where('phone_number', $cleanPhone)->where('is_active', true)->first();

        if (!$contact) return response()->json(['status' => 'ignored']);

        $targetPersona = $contact->persona_id != null ? $contact->persona : Persona::where('is_active', true)->first();
        if (!$targetPersona) return response()->json(['status' => 'error']);

        try {
            $chatHistory = $fetchAction->execute($contact->id);

            // Simpan log apa adanya (kalau cuma gambar, save "[Mengirim Gambar]")
            $textToSave = empty(trim($message)) && $imageUrl ? "[Mengirim Gambar]" : $message;
            $saveAction->execute($contact->id, 'user', $textToSave);

            // TEMBAK AI (KIRIM URL GAMBAR JUGA)
            $replyMessage = $aiAction->execute(
                $targetPersona->system_prompt,
                $contact->name,
                $chatHistory,
                $message,
                $imageUrl // <--- MATA AI DIKASIH INPUT DI SINI
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

        $response = Http::withHeaders([
            'Authorization' => $fonnteToken
        ])->post('https://api.fonnte.com/send', [
            'target' => $target,
            'message' => $message,
            'delay' => '5-15'
        ]);

        return $response->body();
    }
}
