<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\Contact;
use App\Models\Persona;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // Menampilkan halaman dashboard dan statistik
    public function index()
    {
        // Ambil status AI (apakah 'on' atau 'off')
        $aiStatus = Setting::where('key', 'ai_status')->value('value') === 'on';

        // Hitung total kontak di whitelist
        $totalContacts = Contact::count();

        // Cek nama persona yang sedang dipakai
        $activePersona = Persona::where('is_active', true)->first();

        return Inertia::render('Dashboard/DashboardOverview', [
            'isAiActive' => $aiStatus,
            'totalContacts' => $totalContacts,
            'activePersonaName' => $activePersona ? $activePersona->name : 'Belum Diatur',
        ]);
    }

    // Fungsi untuk Saklar Induk (Toggle Global AI)
    public function toggleAi(Request $request)
    {
        $currentStatus = Setting::where('key', 'ai_status')->value('value');
        $newStatus = $currentStatus === 'on' ? 'off' : 'on';

        Setting::updateOrCreate(
            ['key' => 'ai_status'],
            ['value' => $newStatus]
        );

        return back()->with('success', 'Status AI global diperbarui!');
    }
}
