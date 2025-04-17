<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ImageController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\RolePermissionsController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Categories
    Route::resource('categories', CategoryController::class);
    Route::post('categories/bulk-destroy', [CategoryController::class, 'bulkDestroy'])->name('categories.bulk-destroy');
    Route::get('categories/get-all', [CategoryController::class, 'getAllCategories'])->name('categories.getAllCategories');
    Route::get('categories/get-main', [CategoryController::class, 'getMainCategories'])->name('categories.getMainCategories');

    // Tags
    Route::resource('tags', TagController::class);
    Route::post('tags/bulk-destroy', [TagController::class, 'bulkDestroy'])->name('tags.bulk-destroy');

    // Posts
    Route::resource('posts', PostController::class);
    Route::post('posts/bulk-destroy', [PostController::class, 'bulkDestroy'])->name('posts.bulk-destroy');
    Route::patch('posts/{post}/status', [PostController::class, 'updateStatus'])->name('posts.update-status');

    // Pages
    Route::resource('pages', PageController::class);
    Route::post('pages/bulk-destroy', [PageController::class, 'bulkDestroy'])->name('pages.bulk-destroy');

    // Users
    Route::resource('users', UserController::class);
    Route::post('users/{user}/roles', [UserController::class, 'updateRoles'])->name('users.roles.update');
    Route::post('users/bulk-destroy', [UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');

    // Roles and Permissions
    Route::resource('roles', RolePermissionsController::class);
    Route::post('roles/bulk-destroy', [RolePermissionsController::class, 'bulkDestroy'])->name('roles.bulk-destroy');
    Route::get('permissions', [RolePermissionsController::class, 'permissions'])->name('permissions.index');

    // Images
    Route::resource('images', ImageController::class);
    Route::post('images/upload', [ImageController::class, 'upload'])->name('images.upload')->middleware('web');
    Route::post('images/bulk-destroy', [ImageController::class, 'bulkDestroy'])->name('images.bulk-destroy');
    Route::get('images/upload-page', [ImageController::class, 'uploadPage'])->name('images.upload-page');

    // Settings
    Route::resource('settings', SettingController::class)->except(['show']);
    Route::post('settings/{group}', [SettingController::class, 'updateGroup'])->name('settings.update-group');
    Route::patch('settings/group/{group}/name', [SettingController::class, 'updateGroupName'])->name('settings.update-group-name');
    Route::delete('settings/group/{group}', [SettingController::class, 'destroyGroup'])->name('settings.destroy-group');
});
