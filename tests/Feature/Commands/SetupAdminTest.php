<?php

namespace Tests\Feature\Commands;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class SetupAdminTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_roles_permissions_and_admin_user()
    {
        // Run the command
        $this->artisan('setup:admin')
            ->assertExitCode(0);

        // Check that roles were created
        $this->assertDatabaseHas('roles', ['name' => 'admin']);
        $this->assertDatabaseHas('roles', ['name' => 'editor']);
        $this->assertDatabaseHas('roles', ['name' => 'author']);

        // Check that permissions were created
        $this->assertDatabaseHas('permissions', ['name' => 'view categories']);
        $this->assertDatabaseHas('permissions', ['name' => 'create posts']);
        $this->assertDatabaseHas('permissions', ['name' => 'edit settings']);

        // Check that admin user was created
        $this->assertDatabaseHas('users', [
            'email' => 'admin@example.com',
        ]);

        // Check that admin user has admin role
        $user = User::where('email', 'admin@example.com')->first();
        $this->assertTrue($user->hasRole('admin'));
    }

    /** @test */
    public function it_creates_admin_user_with_custom_email_and_password()
    {
        // Run the command with custom options
        $this->artisan('setup:admin', [
            '--email' => 'custom@example.com',
            '--password' => 'custom-password',
        ])->assertExitCode(0);

        // Check that admin user was created with custom email
        $this->assertDatabaseHas('users', [
            'email' => 'custom@example.com',
        ]);

        // Check that admin user has admin role
        $user = User::where('email', 'custom@example.com')->first();
        $this->assertTrue($user->hasRole('admin'));
    }

    /** @test */
    public function it_updates_existing_user_to_have_admin_role()
    {
        // Create a user without admin role
        $user = User::factory()->create([
            'email' => 'admin@example.com',
        ]);

        // Create admin role
        $adminRole = Role::create(['name' => 'admin']);
        
        // Create a permission
        Permission::create(['name' => 'view users']);
        
        // Give permission to admin role
        $adminRole->givePermissionTo('view users');

        // Verify user doesn't have admin role yet
        $this->assertFalse($user->hasRole('admin'));

        // Run the command
        $this->artisan('setup:admin')
            ->assertExitCode(0);

        // Refresh user model
        $user->refresh();

        // Check that user now has admin role
        $this->assertTrue($user->hasRole('admin'));
    }
}
