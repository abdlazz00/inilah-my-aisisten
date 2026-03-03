<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Persona;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::with('persona')->orderBy('created_at', 'desc')->get();
        $personas = Persona::all();
        return Inertia::render('Contacts/ContactManager', [
            'contacts' => $contacts,
            'personas' => $personas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:50|unique:contacts',
            'persona_id' => 'nullable|exists:personas,id',
            'is_group' => 'boolean'
        ]);

        Contact::create([
            'name' => $validated['name'],
            'phone_number' => preg_replace('/[^0-9\-@.usg]/', '', $validated['phone_number']), // Support ID Grup Fonnte
            'persona_id' => $validated['persona_id'] ?? null,
            'is_active' => true,
            'is_group' => $request->is_group ?? false,
        ]);

        return back()->with('success', 'Kontak berhasil ditambahkan.');
    }

    public function update(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:50|unique:contacts,phone_number,' . $contact->id,
            'persona_id' => 'nullable|exists:personas,id',
            'is_group' => 'boolean'
        ]);

        $contact->update([
            'name' => $validated['name'],
            'phone_number' => preg_replace('/[^0-9\-@.usg]/', '', $validated['phone_number']),
            'persona_id' => $validated['persona_id'] ?? null,
            'is_group' => $request->is_group ?? false,
        ]);

        return back()->with('success', 'Kontak berhasil diupdate.');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return back()->with('success', 'Kontak berhasil dihapus.');
    }

    public function toggleActive(Contact $contact)
    {
        $contact->update(['is_active' => !$contact->is_active]);
        return back()->with('success', 'Status kontak diperbarui.');
    }

    public function messages(Contact $contact)
    {
        $messages = $contact->messages()->orderBy('created_at', 'asc')->get();
        return response()->json($messages);
    }
}
