<?php


namespace App\Actions\AI;

class CalculateHumanDelayAction
{
    public function execute(string $aiReplyText): int
    {
        $textLength = strlen($aiReplyText);

        // Asumsi kecepatan ngetik santai: 30 karakter per detik
        $typingDelay = ceil($textLength / 30);

        // Tambahkan elemen acak biar sistem WA nggak curiga
        $randomBuffer = rand(1, 3);

        $totalDelay = $typingDelay + $randomBuffer;

        // Minimal delay 2 detik, maksimal ditahan di 8 detik
        return (int)max(5, min($totalDelay, 20));
    }
}
