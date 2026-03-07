<?php


namespace App\Actions\AI;

class CalculateHumanDelayAction
{
    public function execute(string $incomingText, string $aiReplyText): int
    {
        //Waktu baca berdasarkan panjang teks
        $readTime = strlen($incomingText) * 0.05;

        //Waktu jeda sebelum AI menjawab
        $thinkTime = rand(2, 8);

        //Waktu mengetik berdasarkan panjang teks
        $typeTime = strlen($aiReplyText) * 0.1;

        //Total waktu jeda
        $totalDelay = ceil($readTime + $thinkTime + $typeTime);

        //Min jeda 2 detik dan maks 20 detik
        return (int) max(2, min($totalDelay, 20));
    }
}
