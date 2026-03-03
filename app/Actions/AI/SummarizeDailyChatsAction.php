<?php

namespace App\Actions\AI;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SummarizeDailyChatsAction
{
    public function execute(string $chatData): string
    {
        $systemPrompt = "Kamu adalah My AIsisten, asisten pribadi super cerdas. Tugasmu adalah membaca log percakapan WhatsApp majikanmu hari ini dan membuat ringkasan (laporan ajudan) yang singkat, padat, dan jelas. Kelompokkan laporanmu berdasarkan nama kontak. Beritahu intinya saja (misal: 'Dosen menanyakan progress tugas', 'Gebetan membalas dengan antusias'). Gunakan bahasa yang santai namun sopan layaknya ajudan pribadi kepada bosnya. JANGAN membuat paragraf panjang.";

        $payload = [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => "Berikut adalah log chat hari ini:\n\n" . $chatData]
        ];

        $groqKey = Setting::where('key', 'groq_api_key')->value('value');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $groqKey,
            'Content-Type' => 'application/json'
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => $payload,
            'temperature' => 0.5, // Temperature rendah agar jawabannya fokus & tidak ngawur
            'max_tokens' => 500
        ]);

        if ($response->failed()) {
            Log::error("🔥 GROQ API ERROR (Summary): " . $response->body());
            throw new \Exception("Gagal membuat ringkasan.");
        }

        return $response->json('choices.0.message.content') ?? 'Gagal memproses ringkasan.';
    }
}
