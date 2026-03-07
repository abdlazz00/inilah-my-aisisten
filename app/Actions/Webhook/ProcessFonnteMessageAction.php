<?php


namespace App\Actions\Webhook;

use App\Models\Setting;
use App\Models\Persona;
use App\Actions\Contact\VerifyWhitelistAction;
use App\Actions\Message\FetchRecentContextAction;
use App\Actions\Message\SaveMessageContextAction;
use App\Actions\AI\GenerateChatReplyAction;
use App\Actions\AI\CalculateHumanDelayAction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProcessFonnteMessageAction
{
    public function __construct(
        protected VerifyWhitelistAction     $verifyWhitelist,
        protected FetchRecentContextAction  $fetchContext,
        protected SaveMessageContextAction  $saveMessage,
        protected GenerateChatReplyAction   $generateReply,
        protected CalculateHumanDelayAction $calculateDelay
    )
    {
    }

    public function execute(array $payload)
    {
        $senderPhone = $payload['sender'] ?? '';
        $incomingText = $payload['message'] ?? '';

        if (empty($senderPhone) || empty($incomingText)) return;

        $aiStatus = Setting::where('key', 'ai_status')->value('value');
        if ($aiStatus !== 'on') return;

        $contact = $this->verifyWhitelist->execute($senderPhone);
        if (!$contact) return;

        $activePersona = Persona::where('is_active', true)->first();
        if (!$activePersona) {
            Log::warning('AI Active tapi tidak ada Persona yang set active = true');
            return;
        }

        $this->saveMessage->execute($contact->id, 'user', $incomingText);

        $context = $this->fetchContext->execute($contact->id);

        $aiReplyText = $this->generateReply->execute(
            $activePersona->system_prompt,
            $contact->name ?? 'Bro/Sis',
            $context,
            $incomingText
        );

        if (empty($aiReplyText)) return;

        $this->saveMessage->execute($contact->id, 'assistant', $aiReplyText);

        $delay = $this->calculateDelay->execute($incomingText, $aiReplyText);

        Http::withHeaders([
            'Authorization' => env('FONNTE_TOKEN')
        ])->post('https://api.fonnte.com/send', [
            'target' => $senderPhone,
            'message' => $aiReplyText,
            'delay' => (string)$delay
        ]);
    }
}
