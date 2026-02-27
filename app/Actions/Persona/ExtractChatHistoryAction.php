<?php

namespace App\Actions\Persona;

use Illuminate\Http\UploadedFile;

class ExtractChatHistoryAction
{
    public function execute(UploadedFile $file, string $targetName): string
    {
        $content = file_get_contents($file->getRealPath());
        $lines = explode("\n", $content);

        $extractedMessages = [];
        $currentMessage = '';
        $isTargetUser = false;

        // Regex canggih untuk membaca format WA Android & iOS (mendukung jam pakai titik 22.40 atau titik dua 22:40)
        $regex = '/^\[?(\d{2}\/\d{2}\/\d{2,4}[, ]+\d{2}[.:]\d{2}(?:[.:]\d{2})?)\]?[\s-]*([^:]+):\s*(.*)$/i';

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            if (preg_match($regex, $line, $matches)) {
                $senderName = trim($matches[2]);
                $messageText = trim($matches[3]);

                // Buang pesan otomatis dari WhatsApp
                if (str_contains($messageText, '<Media tidak disertakan>') ||
                    str_contains($messageText, '<Media omitted>') ||
                    str_contains($messageText, 'end-to-end')) {
                    continue;
                }

                // Cek apakah ini pesanmu
                if (strtolower($senderName) === strtolower($targetName)) {
                    $isTargetUser = true;
                    $currentMessage = $messageText;
                    $extractedMessages[] = $currentMessage;
                } else {
                    $isTargetUser = false;
                }
            } else {
                if ($isTargetUser) {
                    $lastIndex = count($extractedMessages) - 1;
                    if ($lastIndex >= 0) {
                        $extractedMessages[$lastIndex] .= "\n" . $line;
                    }
                }
            }
        }

        // Ambil 150 pesan terakhir agar AI fokus ke gaya bahasamu yang paling baru
        $recentMessages = array_slice($extractedMessages, -150);

        return implode("\n", $recentMessages);
    }
}
