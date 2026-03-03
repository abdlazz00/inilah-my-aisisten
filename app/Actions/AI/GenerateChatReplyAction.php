<?php

namespace App\Actions\AI;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateChatReplyAction
{
    // Tambahkan $imageUrl di parameter terakhir
    public function execute(string $systemPrompt, string $contactName, $chatHistory, string $newMessage, ?string $imageUrl = null): string
    {
        $memoryVault = Setting::where('key', 'memory_vault')->value('value');

        $vaultText = !empty(trim($memoryVault))
            ? "\n\nINFORMASI TAMBAHAN (Wajib Kamu Ingat sebagai fakta):\n" . $memoryVault
            : "";

        $dynamicSystemPrompt = "{$systemPrompt}{$vaultText}\n\nPENTING: Saat ini kamu sedang ngobrol dengan {$contactName}. Balaslah secara natural sesuai personamu.";

        $payload = [
            ['role' => 'system', 'content' => $dynamicSystemPrompt]
        ];

        foreach ($chatHistory as $history) {
            $payload[] = [
                'role' => $history->role,
                'content' => $history->content
            ];
        }

        $model = 'llama-3.3-70b-versatile'; // Default: Otak Cerdas Teks
        $userContent = $newMessage;

        // JIKA ADA GAMBAR MASUK -> UBAH KE VISION MODE
        if ($imageUrl) {
            Log::info("📸 Vision Mode AKTIF: Mendownload gambar dari {$imageUrl}");

            // Download gambar dari link Fonnte
            $imageResponse = Http::get($imageUrl);

            if ($imageResponse->successful()) {
                $model = 'llama-3.2-11b-vision-preview'; // MATA AI AKTIF
                $base64 = base64_encode($imageResponse->body());
                $mimeType = $imageResponse->header('Content-Type') ?? 'image/jpeg';

                // Rakit Payload Multimodal (Teks + Gambar) untuk Groq
                $userContent = [
                    [
                        "type" => "text",
                        "text" => empty(trim($newMessage)) ? "Coba perhatikan gambar yang aku kirim ini, lalu berikan komentarmu secara natural." : $newMessage
                    ],
                    [
                        "type" => "image_url",
                        "image_url" => [
                            "url" => "data:{$mimeType};base64,{$base64}"
                        ]
                    ]
                ];
            } else {
                Log::warning("❌ Gagal download gambar. Kembali ke teks murni.");
            }
        }

        $payload[] = [
            'role' => 'user',
            'content' => $userContent
        ];

        $groqKey = Setting::where('key', 'groq_api_key')->value('value');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $groqKey,
            'Content-Type' => 'application/json'
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => $model,
            'messages' => $payload,
            'temperature' => 0.8,
            'max_tokens' => 200
        ]);

        if ($response->failed()) {
            Log::error("🔥 GROQ API ERROR: " . $response->body());
            throw new \Exception("Groq API Error: " . $response->body());
        }

        return $response->json('choices.0.message.content') ?? '';
    }
}
