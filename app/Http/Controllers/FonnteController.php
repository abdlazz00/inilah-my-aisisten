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
        $sender = $request->sender;
        $message = $request->message;

        Log::info("📨 CHAT MASUK DARI: {$sender} | PESAN: {$message}");

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

        $aiStatus = Setting::where('key', 'ai_status')->value('value');
        if ($aiStatus !== 'on') {
            Log::warning("❌ DITOLAK: AI Sedang Off di Dashboard");
            return response()->json(['status' => 'ignored', 'reason' => 'AI is turned off']);
        }

        $cleanPhone = preg_replace('/[^0-9]/', '', $sender);
        $contact = Contact::where('phone_number', $cleanPhone)->where('is_active', true)->first();

        if (!$contact) {
            Log::warning("❌ DITOLAK: Nomor {$cleanPhone} tidak ada di Whitelist");
            return response()->json(['status' => 'ignored', 'reason' => 'Sender not in whitelist']);
        }

        // 3. Ambil Persona yang sedang aktif
        $targetPersona = null;

        // Cek apakah kontak ini punya persona khusus
        if ($contact->persona_id != null) {
            $targetPersona = $contact->persona;
            Log::info("🎭 Menggunakan Persona KHUSUS untuk {$contact->name}: {$targetPersona->name}");
        } else {
            // Jika tidak ada, pakai persona global yang sedang aktif
            $targetPersona = Persona::where('is_active', true)->first();
            Log::info("🌍 Menggunakan Persona GLOBAL untuk {$contact->name}");
        }

        if (!$targetPersona) {
            Log::warning("❌ DITOLAK: Tidak ada persona (Khusus/Global) yang bisa digunakan");
            return response()->json(['status' => 'error', 'reason' => 'No active persona']);
        }

        try {
            Log::info("✅ DIPROSES: Meminta balasan dari Groq AI untuk {$contact->name}...");

            // 4. Minta AI membuat balasan (Gunakan $targetPersona->system_prompt)
            $chatHistory = [];
            $replyMessage = $aiAction->execute(
                $targetPersona->system_prompt, // <--- PENTING: Ganti jadi $targetPersona
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
