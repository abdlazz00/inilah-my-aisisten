<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Actions\Webhook\ProcessFonnteMessageAction;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;

class WebhookController extends Controller
{
    public function handle(Request $request, ProcessFonnteMessageAction $processFonnteMessage)
    {
        // Ambil semua data dari Fonnte
        $payload = $request->all();
        $senderPhone = $payload['sender'] ?? '';
        $incomingText = strtolower(trim($payload['message'] ?? ''));

        // Nomor kamu sendiri sebagai pemegang kendali (setting di .env)
        $ownerPhone = env('OWNER_PHONE');

        // --- 1. INTERCEPT COMMAND OWNER ---
        if ($senderPhone === $ownerPhone) {
            if ($incomingText === '!ai on') {
                Setting::updateOrCreate(['key' => 'ai_status'], ['value' => 'on']);
                $this->sendSystemNotification($ownerPhone, "🤖 [Sistem] Inilah My AIsisten: AKTIF!");
                return response()->json(['status' => 'success', 'message' => 'AI turned on']);
            }

            if ($incomingText === '!ai off') {
                Setting::updateOrCreate(['key' => 'ai_status'], ['value' => 'off']);
                $this->sendSystemNotification($ownerPhone, "🤖 [Sistem] Inilah My AIsisten: DIMATIKAN!");
                return response()->json(['status' => 'success', 'message' => 'AI turned off']);
            }
        }

        // --- 2. LEMPAR KE OTAK AI ---
        // Jika bukan command dari owner, biarkan Action Class yang memproses (Cek whitelist, prompt, dll)
        $processFonnteMessage->execute($payload);

        // Harus selalu return HTTP 200 dengan cepat agar Fonnte tidak menganggap server kita down
        return response()->json(['status' => 'success']);
    }

    // Fungsi kecil untuk membalas command sistem ke nomor kamu tanpa delay
    private function sendSystemNotification($target, $text)
    {
        Http::withHeaders([
            'Authorization' => env('FONNTE_TOKEN')
        ])->post('https://api.fonnte.com/send', [
            'target' => $target,
            'message' => $text,
        ]);
    }
}
