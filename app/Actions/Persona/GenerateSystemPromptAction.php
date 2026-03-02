<?php

namespace App\Actions\Persona;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateSystemPromptAction
{
    public function execute(string $chatHistory, string $targetName): string
    {
        $shortChatHistory = substr($chatHistory, -4000);

        $metaPrompt = "Kamu adalah ahli analisis gaya bahasa. Berikut adalah cuplikan pesan WhatsApp dari seseorang bernama {$targetName}.
        Analisis gaya bahasanya secara mendalam (kosakata, slang, cara tertawa, penggunaan emoji, dan tingkat formalitas).
        Buatkan sebuah 'System Prompt' ringkas berisi aturan instruksional untuk AI agar bisa meniru persis gaya bahasa orang ini.
        Format output HANYA berisi teks system prompt-nya saja tanpa pengantar.";

        $groqKey = Setting::where('key', 'groq_api_key')->value('value');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $groqKey, // <--- Ganti di sini
            'Content-Type' => 'application/json'
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => [
                ['role' => 'system', 'content' => $metaPrompt],
                ['role' => 'user', 'content' => $shortChatHistory]
            ],
            'temperature' => 0.7,
        ]);

        if ($response->failed()) {
            Log::error("API Groq Gagal: " . $response->body());
            throw new \Exception('Gagal menghubungi Groq API: ' . $response->body());
        }

        return $response->json('choices.0.message.content');
    }
}
