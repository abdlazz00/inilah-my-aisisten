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
        $aiStatus = Setting::where('key', 'ai_status')->value('value') ?? 'off';

        $stats = [
            'total_personas' => Persona::count(),
            'total_contacts' => Contact::count(),
            'total_messages' => Message::count(),
            'ai_status' => $aiStatus === 'on'
        ];

        $recentContacts = Contact::with('persona')
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
        $currentStatus = Setting::where('key', 'ai_status')->value('value') ?? 'off';
        $newStatus = $currentStatus === 'on' ? 'off' : 'on';

        Setting::updateOrCreate(
            ['key' => 'ai_status'],
            ['value' => $newStatus]
        );

        return back()->with('success', "AI Status berhasil diubah menjadi " . strtoupper($newStatus));
    }

    // FUNGSI BARU: BIKIN LAPORAN AJUDAN
    public function summarize(SummarizeDailyChatsAction $summarizer)
    {
        $today = Carbon::today();
        // Ambil semua pesan hari ini
        $messages = Message::with('contact')
            ->whereDate('created_at', $today)
            ->orderBy('contact_id')
            ->orderBy('created_at', 'asc')
            ->get();

        if ($messages->isEmpty()) {
            return response()->json(['summary' => 'Belum ada obrolan masuk maupun keluar hari ini, Bos!']);
        }

        // Rakit pesan agar rapi dibaca AI
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
