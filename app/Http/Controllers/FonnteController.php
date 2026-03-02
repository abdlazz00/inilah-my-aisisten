<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\Contact;
use App\Models\Persona;
use App\Actions\AI\GenerateChatReplyAction;
// TAMBAHAN: Import Action untuk Memori
use App\Actions\Message\FetchRecentContextAction;
use App\Actions\Message\SaveMessageContextAction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteController extends Controller
{
    // TAMBAHAN: Masukkan Fetch & Save Action ke dalam parameter webhook
    public function webhook(
        Request $request,
        GenerateChatReplyAction $aiAction,
        FetchRecentContextAction $fetchAction,
        SaveMessageContextAction $saveAction
    ) {
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

        // Ambil Persona yang sedang aktif
        $targetPersona = null;
        if ($contact->persona_id != null) {
            $targetPersona = $contact->persona;
            Log::info("🎭 Menggunakan Persona KHUSUS untuk {$contact->name}: {$targetPersona->name}");
        } else {
            $targetPersona = Persona::where('is_active', true)->first();
            Log::info("🌍 Menggunakan Persona GLOBAL untuk {$contact->name}");
        }

        if (!$targetPersona) {
            Log::warning("❌ DITOLAK: Tidak ada persona (Khusus/Global) yang bisa digunakan");
            return response()->json(['status' => 'error', 'reason' => 'No active persona']);
        }

        try {
            Log::info("✅ DIPROSES: Meminta balasan dari Groq AI untuk {$contact->name}...");

            // 1. Ambil riwayat chat LAMA (Maksimal 8 chat terakhir) sebelum pesan baru ini masuk
            $chatHistory = $fetchAction->execute($contact->id);

            // 2. Simpan pesan masuk dari User ke database
            $saveAction->execute($contact->id, 'user', $message);

            // 3. Minta AI membuat balasan dengan menyertakan memori chat
            $replyMessage = $aiAction->execute(
                $targetPersona->system_prompt,
                $contact->name,
                $chatHistory, // <--- Memori disuntikkan di sini
                $message
            );

            Log::info("🤖 ISI BALASAN GROQ: " . $replyMessage);

            if (empty(trim($replyMessage))) {
                Log::error("🔥 ERROR: Balasan dari AI kosong!");
                return response()->json(['status' => 'error', 'reason' => 'Empty reply from AI']);
            }

            // 4. Simpan balasan AI ke database agar diingat untuk chat berikutnya
            $saveAction->execute($contact->id, 'assistant', $replyMessage);

            // 5. Kirim balasan ke WA via Fonnte
            $fonnteResponse = $this->sendFonnte($sender, $replyMessage);

            Log::info("📡 RESPONSE FONNTE: " . $fonnteResponse);

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            Log::error("🔥 ERROR SISTEM: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
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
