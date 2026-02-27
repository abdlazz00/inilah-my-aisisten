<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\Contact;
use App\Models\Persona;
use App\Actions\AI\GenerateChatReplyAction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteController extends Controller
{
    public function webhook(Request $request, GenerateChatReplyAction $aiAction)
    {
        // Tangkap data dari Fonnte
        $sender = $request->sender;
        $message = $request->message;

        // CCTV 1: Catat pesan yang masuk
        Log::info("📨 CHAT MASUK DARI: {$sender} | PESAN: {$message}");

        // --- FITUR ADMIN COMMAND ---
        // Jika ada yang ketik !ai off atau !ai on (biasanya kamu sendiri)
        if (strtolower(trim($message)) === '!ai off') {
            Setting::updateOrCreate(['key' => 'ai_status'], ['value' => 'off']);
            $this->sendFonnte($sender, "🤖 [Sistem] Inilah My AIsisten: DIMATIKAN!");
            return response()->json(['status' => 'success', 'reason' => 'AI turned off']);
        }
        if (strtolower(trim($message)) === '!ai on') {
            Setting::updateOrCreate(['key' => 'ai_status'], ['value' => 'on']);
            $this->sendFonnte($sender, "🤖 [Sistem] Inilah My AIsisten: DIHIDUPKAN!");
            return response()->json(['status' => 'success', 'reason' => 'AI turned on']);
        }

        // 1. Cek Saklar Global AI (Apakah sedang ON?)
        $aiStatus = Setting::where('key', 'ai_status')->value('value');
        if ($aiStatus !== 'on') {
            Log::warning("❌ DITOLAK: AI Sedang Off di Dashboard");
            return response()->json(['status' => 'ignored', 'reason' => 'AI is turned off']);
        }

        // 2. Cek Whitelist Kontak
        $cleanPhone = preg_replace('/[^0-9]/', '', $sender);
        $contact = Contact::where('phone_number', $cleanPhone)->where('is_active', true)->first();

        if (!$contact) {
            Log::warning("❌ DITOLAK: Nomor {$cleanPhone} tidak ada di Whitelist");
            return response()->json(['status' => 'ignored', 'reason' => 'Sender not in whitelist']);
        }

        // 3. Ambil Persona yang sedang aktif
        $activePersona = Persona::where('is_active', true)->first();
        if (!$activePersona) {
            Log::warning("❌ DITOLAK: Tidak ada persona AI yang aktif");
            return response()->json(['status' => 'error', 'reason' => 'No active persona']);
        }

        try {
            Log::info("✅ DIPROSES: Meminta balasan dari Groq AI untuk {$contact->name}...");

            // 4. Minta AI membuat balasan
            $chatHistory = []; // MVP: Kosongkan history obrolan sebelumnya
            $replyMessage = $aiAction->execute(
                $activePersona->system_prompt,
                $contact->name,
                $chatHistory,
                $message
            );

            // CCTV 2: Catat apa yang mau diketik AI
            Log::info("🤖 ISI BALASAN GROQ: " . $replyMessage);

            if (empty(trim($replyMessage))) {
                Log::error("🔥 ERROR: Balasan dari AI kosong!");
                return response()->json(['status' => 'error', 'reason' => 'Empty reply from AI']);
            }

            // 5. Kirim balasan ke WA via Fonnte
            $fonnteResponse = $this->sendFonnte($sender, $replyMessage);

            // CCTV 3: Catat jawaban dari server Fonnte
            Log::info("📡 RESPONSE FONNTE: " . $fonnteResponse);

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            Log::error("🔥 ERROR SISTEM: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // Fungsi pembantu untuk mengirim pesan via Fonnte API
    private function sendFonnte($target, $message)
    {
        $response = Http::withHeaders([
            'Authorization' => env('FONNTE_TOKEN')
        ])->post('https://api.fonnte.com/send', [
            'target' => $target,
            'message' => $message,
            'delay' => '5-15'
        ]);

        return $response->body();
    }
}
