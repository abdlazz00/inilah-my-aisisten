<?php

namespace App\Actions\Contact;

use App\Models\Contact;

class VerifyWhitelistAction
{
    public function execute(string $phoneNumber): ?Contact
    {
        // Cari kontak yang aktif berdasarkan nomor telepon
        $contact = Contact::where('phone_number', $phoneNumber)
            ->where('is_active', true)
            ->first();

        // Jika ketemu, update waktu terakhir interaksi
        if ($contact) {
            $contact->update(['last_interacted_at' => now()]);
        }

        return $contact;
    }
}
