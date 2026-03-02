<?php


namespace App\Actions\Message;

use App\Models\Message;

class FetchRecentContextAction
{
    public function execute(string $contactId, int $limit = 8)
    {
        // Ambil 8 pesan terakhir, lalu balik urutannya (chronological) agar AI bacanya dari yang paling lama ke baru
        return Message::where('contact_id', $contactId)
            ->orderBy('id', 'desc')
            ->take($limit)
            ->get()
            ->reverse()
            ->values();
    }
}
