<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FonnteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PersonaController; // Import Controller Persona kita
use App\Http\Controllers\SettingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});


// Semua Route yang wajib Login dulu baru bisa diakses
Route::middleware('auth')->group(function () {
    // Route Profile Bawaan Breeze
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/summarize', [DashboardController::class, 'summarize'])->name('dashboard.summarize');
    Route::post('/settings/toggle-ai', [DashboardController::class, 'toggleAi'])->name('settings.toggle');

    // --- ROUTE INILAH MY AISISTEN ---

    // Route Persona Builder
    Route::prefix('personas')->name('personas.')->group(function () {
        Route::get('/', [PersonaController::class, 'index'])->name('index');
        Route::post('/extract', [PersonaController::class, 'extract'])->name('extract');
        Route::post('/save', [PersonaController::class, 'save'])->name('save');
        Route::put('/{persona}', [PersonaController::class, 'update'])->name('update');
        Route::delete('/{persona}', [PersonaController::class, 'destroy'])->name('destroy'); // <--- TAMBAHAN INI
    });

    // Route Whitelist / Contact Manager
    Route::prefix('contacts')->name('contacts.')->group(function () {
        Route::get('/', [ContactController::class, 'index'])->name('index');
        Route::post('/', [ContactController::class, 'store'])->name('store');
        Route::put('/{contact}', [ContactController::class, 'update'])->name('update');
        Route::get('/{contact}/messages', [ContactController::class, 'messages'])->name('messages');
        Route::post('/{contact}/toggle', [ContactController::class, 'toggleActive'])->name('toggle');
        Route::delete('/{contact}', [ContactController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [SettingController::class, 'index'])->name('index');
        Route::post('/', [SettingController::class, 'update'])->name('update');
        // Catatan: Route toggleAi yang lama (kalau ada) biarkan saja atau pindahkan ke sini
    });

    // (Nanti Route untuk Contacts / Whitelist kita taruh di bawah sini juga)
});

require __DIR__.'/auth.php';
Route::post('/api/fonnte', [FonnteController::class, 'webhook']);
