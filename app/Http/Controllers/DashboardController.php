<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Message;
use App\Models\Persona;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Ambil status AI saat ini
        $aiStatus = Setting::where('key', 'ai_status')->value('value') ?? 'off';

        // Hitung statistik
        $stats = [
            'total_personas' => Persona::count(),
            'total_contacts' => Contact::count(),
            'total_messages' => Message::count(),
            'ai_status' => $aiStatus === 'on'
        ];

        // Ambil 5 kontak terbaru yang dimasukkan ke whitelist
        $recentContacts = Contact::with('persona')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentContacts' => $recentContacts,
        ]);
    }

    // Fungsi saklar Master Switch AI
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
}
