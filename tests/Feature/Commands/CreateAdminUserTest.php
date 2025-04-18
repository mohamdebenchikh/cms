<?php

namespace Tests\Feature\Commands;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CreateAdminUserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create admin role for testing
        Role::create(['name' => 'admin']);
    }

    /** @test */
    public function it_can_create_a_new_admin_user_with_options()
    {
        $this->artisan('admin:create', [
            '--name' => 'Test Admin',
            '--email' => 'testadmin@example.com',
            '--password' => 'password123',
        ])
        ->assertExitCode(0);

        $this->assertDatabaseHas('users', [
            'name' => 'Test Admin',
            'email' => 'testadmin@example.com',
        ]);

        $user = User::where('email', 'testadmin@example.com')->first();
        $this->assertTrue($user->hasRole('admin'));
    }

    /** @test */
    public function it_can_update_existing_user_to_admin()
    {
        // Create a user without admin role
        $user = User::factory()->create([
            'name' => 'Existing User',
            'email' => 'existing@example.com',
        ]);

        $this->assertFalse($user->hasRole('admin'));

        // Run command and confirm yes to update
        $this->artisan('admin:create', [
            '--email' => 'existing@example.com',
        ])
        ->expectsQuestion('Enter admin name', 'Updated Name')
        ->expectsConfirmation('Do you want to update this user to have admin role?', 'yes')
        ->assertExitCode(0);

        $user->refresh();
        $this->assertTrue($user->hasRole('admin'));
    }

    /** @test */
    public function it_validates_password_length()
    {
        $this->artisan('admin:create')
            ->expectsQuestion('Enter admin name', 'Test Admin')
            ->expectsQuestion('Enter admin email', 'test@example.com')
            ->expectsQuestion('Enter admin password (min 8 characters)', 'short')
            ->assertExitCode(1);

        $this->assertDatabaseMissing('users', [
            'email' => 'test@example.com',
        ]);
    }

    /** @test */
    public function it_confirms_password_match()
    {
        $this->artisan('admin:create')
            ->expectsQuestion('Enter admin name', 'Test Admin')
            ->expectsQuestion('Enter admin email', 'test@example.com')
            ->expectsQuestion('Enter admin password (min 8 characters)', 'password123')
            ->expectsQuestion('Confirm admin password', 'different123')
            ->assertExitCode(1);

        $this->assertDatabaseMissing('users', [
            'email' => 'test@example.com',
        ]);
    }
}
