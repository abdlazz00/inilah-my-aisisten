<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = auth()->user()->settings()
            ->whereIn('key', ['groq_api_key', 'fonnte_token', 'owner_phone', 'bot_phone', 'memory_vault'])
            ->pluck('value', 'key');

        return Inertia::render('Settings/Index', [
            'settings' => [
                'groq_api_key' => $settings['groq_api_key'] ?? '',
                'fonnte_token' => $settings['fonnte_token'] ?? '',
                'owner_phone' => $settings['owner_phone'] ?? '',
                'bot_phone' => $settings['bot_phone'] ?? '', // <--- Setingan Baru
                'memory_vault' => $settings['memory_vault'] ?? '',
            ],
            'webhook_url' => url('/api/fonnte/' . auth()->id())
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'groq_api_key' => 'nullable|string',
            'fonnte_token' => 'nullable|string',
            'owner_phone' => 'nullable|string',
            'bot_phone' => 'nullable|string', // <--- Validasi Baru
            'memory_vault' => 'nullable|string',
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
