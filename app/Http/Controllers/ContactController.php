<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Persona;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = auth()->user()->contacts()->with('persona')->orderBy('created_at', 'desc')->get();
        $personas = auth()->user()->personas()->get();
        return Inertia::render('Contacts/ContactManager', ['contacts' => $contacts, 'personas' => $personas]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => [
                'required', 'string', 'max:50',
                Rule::unique('contacts')->where(fn ($query) => $query->where('user_id', auth()->id()))
            ],
            'persona_id' => 'nullable|exists:personas,id',
            'is_group' => 'boolean'
        ]);

        auth()->user()->contacts()->create([
            'name' => $validated['name'],
            'phone_number' => preg_replace('/[^0-9\-@.usg]/', '', $validated['phone_number']),
            'persona_id' => $validated['persona_id'] ?? null,
            'is_active' => true,
            'is_group' => $request->is_group ?? false,
        ]);
        return back()->with('success', 'Kontak ditambahkan.');
    }

    public function update(Request $request, Contact $contact)
    {
        if ($contact->user_id !== auth()->id()) abort(403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => [
                'required', 'string', 'max:50',
                Rule::unique('contacts')->ignore($contact->id)->where(fn ($query) => $query->where('user_id', auth()->id()))
            ],
            'persona_id' => 'nullable|exists:personas,id',
            'is_group' => 'boolean'
        ]);

        $contact->update([
            'name' => $validated['name'],
            'phone_number' => preg_replace('/[^0-9\-@.usg]/', '', $validated['phone_number']),
            'persona_id' => $validated['persona_id'] ?? null,
            'is_group' => $request->is_group ?? false,
        ]);
        return back()->with('success', 'Kontak diupdate.');
    }

    public function destroy(Contact $contact)
    {
        if ($contact->user_id !== auth()->id()) abort(403);
        $contact->delete();
        return back()->with('success', 'Kontak dihapus.');
    }

    public function toggleActive(Contact $contact)
    {
        if ($contact->user_id !== auth()->id()) abort(403);
        $contact->update(['is_active' => !$contact->is_active]);
        return back();
    }

    public function messages(Contact $contact)
    {
        if ($contact->user_id !== auth()->id()) abort(403);
        return response()->json($contact->messages()->orderBy('created_at', 'asc')->get());
    }
}
