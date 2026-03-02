<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Persona;
use App\Actions\Persona\ExtractChatHistoryAction;
use App\Actions\Persona\GenerateSystemPromptAction;
use Inertia\Inertia;

class PersonaController extends Controller
{
    public function index()
    {
        return Inertia::render('Personas/PersonaBuilder', [
            'activePersona' => Persona::where('is_active', true)->first(),
            'personas' => Persona::latest()->get()
        ]);
    }

    public function extract(Request $request, ExtractChatHistoryAction $extractAction, GenerateSystemPromptAction $generateAction)
    {
        $request->validate([
            'chat_file' => 'required|file|mimetypes:text/plain',
            'target_name' => 'required|string|max:255',
        ]);

        try {
            $chatHistory = $extractAction->execute($request->file('chat_file'), $request->target_name);

            if (empty(trim($chatHistory))) {
                return response()->json(['message' => 'Tidak ada pesan yang cocok dengan nama tersebut di dalam file.'], 422);
            }

            $generatedPrompt = $generateAction->execute($chatHistory, $request->target_name);

            return response()->json([
                'generated_prompt' => $generatedPrompt
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memproses AI: ' . $e->getMessage()], 500);
        }
    }

    public function save(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'system_prompt' => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        if ($request->is_active) {
            Persona::where('is_active', true)->update(['is_active' => false]);
        }

        Persona::create($request->only(['name', 'system_prompt', 'is_active']));

        return back()->with('success', 'Persona berhasil disimpan!');
    }

    public function destroy(Persona $persona)
    {
        $persona->delete();
        return back()->with('success', 'Persona berhasil dihapus!');
    }
}
