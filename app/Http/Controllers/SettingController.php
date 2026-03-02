<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    //
    public function index()
    {
        $settings = Setting::whereIn('key', ['groq_api_key', 'fonnte_token', 'owner_phone'])
            ->pluck('value', 'key');

        return Inertia::render('Settings/Index', [
            'settings' => [
                'groq_api_key' => $settings['groq_api_key'] ?? '',
                'fonnte_token' => $settings['fonnte_token'] ?? '',
                'owner_phone' => $settings['owner_phone'] ?? '',
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
        ]);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        return back()->with('success', 'Konfigurasi API berhasil disimpan!');
    }
}
