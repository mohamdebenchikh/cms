<?php

use App\Http\Controllers\Blog\BlogController;
use App\Http\Controllers\Blog\ContactController;
use App\Http\Middleware\HandleBlogSettings;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public blog routes
Route::group(['as' => 'blog.', 'middleware' => HandleBlogSettings::class], function () {
    // Home page
    Route::get('/', [BlogController::class, 'home'])->name('home');

    // Single post
    Route::get('/post/{slug}', [BlogController::class, 'post'])->name('post');

    // Category archive
    Route::get('/category/{slug}', [BlogController::class, 'category'])->name('category');

    // Tag archive
    Route::get('/tag/{slug}', [BlogController::class, 'tag'])->name('tag');

    // Categories index
    Route::get('/categories', [BlogController::class, 'categories'])->name('categories');

    // Archive (all posts)
    Route::get('/archive', [BlogController::class, 'archive'])->name('archive');

    // Blog posts page
    Route::get('/posts', [BlogController::class, 'posts'])->name('posts');

    // Search
    Route::get('/search', [BlogController::class, 'search'])->name('search');

    // About page
    Route::get('/about', [BlogController::class, 'about'])->name('about');

    // Contact page
    Route::get('/contact', [ContactController::class, 'index'])->name('contact');
    Route::post('/contact', [ContactController::class, 'submit'])->name('contact.submit');

    // Privacy policy
    Route::get('/privacy', [BlogController::class, 'privacy'])->name('privacy');

    // Terms of service
    Route::get('/terms', [BlogController::class, 'terms'])->name('terms');

    // Categories test page
    Route::get('/categories-test', [BlogController::class, 'categoriesTest'])->name('categories-test');

    // Settings test page
    Route::get('/settings-test', function() {
        return Inertia::render('blog/settings-test');
    })->name('settings-test');

    // Social media test page
    Route::get('/social-test', function() {
        return Inertia::render('blog/social-test');
    })->name('social-test');
});
