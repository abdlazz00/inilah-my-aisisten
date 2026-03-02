<?php


namespace App\Actions\Message;

use App\Models\Message;

class SaveMessageContextAction
{
    public function execute(string $contactId, string $role, string $content): Message
    {
        return Message::create([
            'contact_id' => $contactId,
            'role' => $role,
            'content' => $content
        ]);
    }
}
