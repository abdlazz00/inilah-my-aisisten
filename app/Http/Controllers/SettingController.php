<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        // Tambahkan memory_vault ke query
        $settings = Setting::whereIn('key', ['groq_api_key', 'fonnte_token', 'owner_phone', 'memory_vault'])
            ->pluck('value', 'key');

        return Inertia::render('Settings/Index', [
            'settings' => [
                'groq_api_key' => $settings['groq_api_key'] ?? '',
                'fonnte_token' => $settings['fonnte_token'] ?? '',
                'owner_phone' => $settings['owner_phone'] ?? '',
                'memory_vault' => $settings['memory_vault'] ?? '',
            ]
        ]);
    }

    // Menyimpan perubahan ke database
    public function update(Request $request)
    {
        $data = $request->validate([
            'groq_api_key' => 'nullable|string',
            'fonnte_token' => 'nullable|string',
            'owner_phone' => 'nullable|string',
            'memory_vault' => 'nullable|string', // <--- Baris Baru Validasi
        ]);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        return back()->with('success', 'Pengaturan sistem berhasil disimpan!');
    }
}
