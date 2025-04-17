<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('blog.home');
});

// Redirect old login routes to admin.login for backward compatibility
Route::get('/login', function () {
    return redirect()->route('admin.login');
})->name('login');

Route::post('/login', function () {
    return redirect()->route('admin.login');
});

Route::get('/admin', function () {
    return auth()->check()
        ? redirect()->route('admin.dashboard')
        : redirect()->route('admin.login');
})->name('admin');

Route::middleware(['auth', 'verified'])->group(function () {
    // Redirect to admin dashboard
    Route::get('dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/cms.php';
require __DIR__.'/blog.php';
