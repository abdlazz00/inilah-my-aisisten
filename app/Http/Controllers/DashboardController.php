<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Message;
use App\Models\Persona;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Actions\AI\SummarizeDailyChatsAction;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $aiStatus = $user->settings()->where('key', 'ai_status')->value('value') ?? 'off';

        $stats = [
            'total_personas' => $user->personas()->count(),
            'total_contacts' => $user->contacts()->count(),
            'total_messages' => Message::whereHas('contact', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->count(),
            'ai_status' => $aiStatus === 'on'
        ];

        $recentContacts = $user->contacts()->with('persona')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentContacts' => $recentContacts,
        ]);
    }

    public function toggleAi(Request $request)
    {
        $user = auth()->user();

        $currentStatus = $user->settings()->where('key', 'ai_status')->value('value') ?? 'off';
        $newStatus = $currentStatus === 'on' ? 'off' : 'on';

        $user->settings()->updateOrCreate(
            ['key' => 'ai_status'],
            ['value' => $newStatus]
        );

        return back()->with('success', "AI Status berhasil diubah menjadi " . strtoupper($newStatus));
    }

    public function summarize(SummarizeDailyChatsAction $summarizer)
    {
        $today = Carbon::today();
        $user = auth()->user();

        $messages = Message::with('contact')
            ->whereHas('contact', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->whereDate('created_at', $today)
            ->orderBy('contact_id')
            ->orderBy('created_at', 'asc')
            ->get();

        if ($messages->isEmpty()) {
            return response()->json(['summary' => 'Belum ada obrolan masuk maupun keluar hari ini, Bos!']);
        }

        $chatLog = "";
        $currentContact = "";
        foreach ($messages as $msg) {
            $contactName = $msg->contact->name ?? 'Unknown';
            if ($currentContact !== $contactName) {
                $chatLog .= "\n--- Obrolan dengan {$contactName} ---\n";
                $currentContact = $contactName;
            }
            $role = $msg->role === 'assistant' ? 'AI' : $contactName;
            $chatLog .= "[{$msg->created_at->format('H:i')}] {$role}: {$msg->content}\n";
        }

        try {
            $summary = $summarizer->execute($chatLog);
            return response()->json(['summary' => $summary]);
        } catch (\Exception $e) {
            return response()->json(['summary' => 'Waduh, gagal bikin rangkuman nih: ' . $e->getMessage()], 500);
        }
    }
}
