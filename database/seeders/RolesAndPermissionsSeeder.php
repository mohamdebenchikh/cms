<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        // Category permissions
        Permission::create(['name' => 'view categories']);
        Permission::create(['name' => 'create categories']);
        Permission::create(['name' => 'edit categories']);
        Permission::create(['name' => 'delete categories']);

        // Tag permissions
        Permission::create(['name' => 'view tags']);
        Permission::create(['name' => 'create tags']);
        Permission::create(['name' => 'edit tags']);
        Permission::create(['name' => 'delete tags']);

        // Post permissions
        Permission::create(['name' => 'view posts']);
        Permission::create(['name' => 'create posts']);
        Permission::create(['name' => 'edit posts']);
        Permission::create(['name' => 'delete posts']);
        Permission::create(['name' => 'publish posts']);
        Permission::create(['name' => 'edit all posts']);
        Permission::create(['name' => 'delete all posts']);

        // Page permissions
        Permission::create(['name' => 'view pages']);
        Permission::create(['name' => 'create pages']);
        Permission::create(['name' => 'edit pages']);
        Permission::create(['name' => 'delete pages']);
        Permission::create(['name' => 'publish pages']);
        Permission::create(['name' => 'edit all pages']);
        Permission::create(['name' => 'delete all pages']);

        // User permissions
        Permission::create(['name' => 'view users']);
        Permission::create(['name' => 'create users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);

        // Role permissions
        Permission::create(['name' => 'view roles']);
        Permission::create(['name' => 'create roles']);
        Permission::create(['name' => 'edit roles']);
        Permission::create(['name' => 'delete roles']);

        // Image permissions
        Permission::create(['name' => 'view images']);
        Permission::create(['name' => 'create images']);
        Permission::create(['name' => 'edit images']);
        Permission::create(['name' => 'delete images']);
        Permission::create(['name' => 'edit all images']);
        Permission::create(['name' => 'delete all images']);

        // Setting permissions
        Permission::create(['name' => 'view settings']);
        Permission::create(['name' => 'create settings']);
        Permission::create(['name' => 'edit settings']);
        Permission::create(['name' => 'delete settings']);

        // Create roles and assign permissions
        // Admin role
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Editor role
        $editorRole = Role::create(['name' => 'editor']);
        $editorRole->givePermissionTo([
            'view categories', 'view tags',
            'view posts', 'create posts', 'edit posts', 'delete posts', 'publish posts', 'edit all posts', 'delete all posts',
            'view pages', 'create pages', 'edit pages', 'delete pages', 'publish pages', 'edit all pages', 'delete all pages',
            'view images', 'create images', 'edit images', 'delete images', 'edit all images', 'delete all images',
            'view settings',
        ]);

        // Author role
        $authorRole = Role::create(['name' => 'author']);
        $authorRole->givePermissionTo([
            'view categories', 'view tags',
            'view posts', 'create posts', 'edit posts', 'delete posts', 'publish posts',
            'view pages',
            'view images', 'create images', 'edit images', 'delete images',
        ]);

        // Note: Admin user will be assigned the admin role in the AdminSeeder
        // Assign author role to all existing users (except the admin which will be created later)
        User::all()->each(function ($user) {
            if (!$user->hasRole('admin')) {
                $user->assignRole('author');
            }
        });
    }
}
