<?php

namespace App\Actions\AI;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateChatReplyAction
{
    public function execute(string $systemPrompt, string $contactName, $chatHistory, string $newMessage): string
    {
        $dynamicSystemPrompt = "{$systemPrompt}\n\nPENTING: Saat ini kamu sedang ngobrol dengan {$contactName}. Balas pesan terbarunya secara natural sesuai dengan konteks obrolan sebelumnya. Jangan menggunakan bahasa kaku/robot.";

        $payload = [
            ['role' => 'system', 'content' => $dynamicSystemPrompt]
        ];

        foreach ($chatHistory as $history) {
            $payload[] = [
                'role' => $history->role,
                'content' => $history->content
            ];
        }

        $payload[] = [
            'role' => 'user',
            'content' => $newMessage
        ];

        $groqKey = Setting::where('key', 'groq_api_key')->value('value');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $groqKey, // <--- Ganti di sini
            'Content-Type' => 'application/json'
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => $payload,
            'temperature' => 0.8,
            'max_tokens' => 150
        ]);

        // JURUS TANGKAP ERROR GROQ API
        if ($response->failed()) {
            Log::error("🔥 API GROQ ERROR: " . $response->body());
            throw new \Exception("Groq API Error. Cek laravel.log untuk detailnya.");
        }

        return $response->json('choices.0.message.content') ?? '';
    }
}
