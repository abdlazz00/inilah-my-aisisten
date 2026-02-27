<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FonnteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PersonaController; // Import Controller Persona kita
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Halaman depan bawaan Breeze
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


// Semua Route yang wajib Login dulu baru bisa diakses
Route::middleware('auth')->group(function () {
    // Route Profile Bawaan Breeze
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/settings/toggle-ai', [DashboardController::class, 'toggleAi'])->name('settings.toggle');

    // --- ROUTE INILAH MY AISISTEN ---

    // Route Persona Builder
    Route::prefix('personas')->name('personas.')->group(function () {
        Route::get('/', [PersonaController::class, 'index'])->name('index');
        Route::post('/extract', [PersonaController::class, 'extract'])->name('extract');
        Route::post('/save', [PersonaController::class, 'save'])->name('save');
    });

    // Route Whitelist / Contact Manager
    Route::prefix('contacts')->name('contacts.')->group(function () {
        Route::get('/', [ContactController::class, 'index'])->name('index');
        Route::post('/', [ContactController::class, 'store'])->name('store');
        Route::post('/{contact}/toggle', [ContactController::class, 'toggleActive'])->name('toggle');
        Route::delete('/{contact}', [ContactController::class, 'destroy'])->name('destroy');
    });

    // (Nanti Route untuk Contacts / Whitelist kita taruh di bawah sini juga)
});

require __DIR__.'/auth.php';
Route::post('/api/fonnte', [FonnteController::class, 'webhook']);
