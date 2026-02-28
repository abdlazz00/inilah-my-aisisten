<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Persona;
use App\Actions\Persona\ExtractChatHistoryAction;
use App\Actions\Persona\GenerateSystemPromptAction;
use Inertia\Inertia;

class PersonaController extends Controller
{
    // 1. Menampilkan halaman UI React
    public function index()
    {
        return Inertia::render('Personas/PersonaBuilder', [
            'activePersona' => Persona::where('is_active', true)->first(),
            'personas' => Persona::latest()->get()
        ]);
    }

    // 2. Menangkap file upload dan mengirim ke Action Classes (OpenAI)
    public function extract(Request $request, ExtractChatHistoryAction $extractAction, GenerateSystemPromptAction $generateAction)
    {
        $request->validate([
            'chat_file' => 'required|file|mimetypes:text/plain',
            'target_name' => 'required|string|max:255',
        ]);

        try {
            // Step A: Parse file .txt pakai Regex
            $chatHistory = $extractAction->execute($request->file('chat_file'), $request->target_name);

            if (empty(trim($chatHistory))) {
                return response()->json(['message' => 'Tidak ada pesan yang cocok dengan nama tersebut di dalam file.'], 422);
            }

            // Step B: Kirim teks hasil ekstrak ke Groq AI
            $generatedPrompt = $generateAction->execute($chatHistory, $request->target_name);

            // Step C: Lempar balik langsung sebagai JSON (Bypass Inertia)
            return response()->json([
                'generated_prompt' => $generatedPrompt
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memproses AI: ' . $e->getMessage()], 500);
        }
    }

    // 3. Menyimpan prompt yang sudah di-review ke Database
    public function save(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'system_prompt' => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        // Jika diset sebagai aktif, matikan persona lain yang sedang aktif
        if ($request->is_active) {
            Persona::where('is_active', true)->update(['is_active' => false]);
        }

        // Simpan ke tabel personas
        Persona::create($request->only(['name', 'system_prompt', 'is_active']));

        return back()->with('success', 'Persona berhasil disimpan!');
    }

    public function destroy(Persona $persona)
    {
        $persona->delete();
        return back()->with('success', 'Persona berhasil dihapus!');
    }
}
