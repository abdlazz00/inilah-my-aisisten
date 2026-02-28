<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Persona;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    // Menampilkan halaman dan daftar kontak
    public function index()
    {
        return Inertia::render('Contacts/ContactManager', [
            'contacts' => Contact::with('persona')->latest()->get(),
            'personas' => Persona::select('id', 'name')->get()
        ]);
    }

    // Menyimpan kontak baru ke database
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|unique:contacts,phone_number',
            'persona_id' => 'nullable|exists:personas,id',
        ]);

        // Bersihkan nomor (hilangkan spasi, +, dll) agar seragam
        $cleanPhone = preg_replace('/[^0-9]/', '', $request->phone_number);

        // Ubah 08 jadi 628 untuk standar Fonnte
        if (str_starts_with($cleanPhone, '08')) {
            $cleanPhone = '62' . substr($cleanPhone, 1);
        }

        Contact::create([
            'name' => $request->name,
            'phone_number' => $cleanPhone,
            'persona_id' => $request->persona_id,
            'is_active' => true,
        ]);

        return back()->with('success', 'Kontak berhasil ditambahkan!');
    }

    // Menghidupkan / Mematikan AI untuk kontak spesifik
    public function toggleActive(Contact $contact)
    {
        $contact->update(['is_active' => !$contact->is_active]);
        return back()->with('success', 'Status kontak diperbarui!');
    }

    // Menghapus kontak dari whitelist
    public function destroy(Contact $contact)
    {
        $contact->delete();
        return back()->with('success', 'Kontak berhasil dihapus!');
    }

    public function update(Request $request, Contact $contact)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'persona_id' => 'nullable|exists:personas,id'
        ]);

        $contact->update([
            'name' => $request->name,
            'phone_number' => $request->phone_number,
            'persona_id' => $request->persona_id,
        ]);

        return back()->with('success', 'Kontak berhasil diupdate!');
    }
}
