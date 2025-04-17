<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $admin;
    protected User $editor;
    protected User $testUser;
    protected Role $adminRole;
    protected Role $editorRole;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles and permissions
        $this->adminRole = Role::create(['name' => 'admin']);
        $this->editorRole = Role::create(['name' => 'editor']);
        
        Permission::create(['name' => 'view users']);
        Permission::create(['name' => 'create users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);
        
        $this->adminRole->givePermissionTo(Permission::all());
        
        // Create users
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
        
        $this->editor = User::factory()->create();
        $this->editor->assignRole('editor');
        
        $this->testUser = User::factory()->create();
    }

    /** @test */
    public function admin_can_view_users_index()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/users/index')
            ->has('users')
        );
    }
    
    /** @test */
    public function non_admin_cannot_view_users_index()
    {
        $response = $this->actingAs($this->editor)
            ->get(route('admin.users.index'));
        
        $response->assertStatus(403);
    }
    
    /** @test */
    public function guest_cannot_view_users_index()
    {
        $response = $this->get(route('admin.users.index'));
        
        $response->assertRedirect(route('login'));
    }
    
    /** @test */
    public function admin_can_create_user()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.create'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/users/create')
            ->has('roles')
        );
    }
    
    /** @test */
    public function admin_can_store_user()
    {
        $userData = [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password',
            'password_confirmation' => 'password',
            'roles' => ['editor'],
        ];
        
        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.store'), $userData);
        
        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('users', [
            'name' => $userData['name'],
            'email' => $userData['email'],
        ]);
        
        $user = User::where('email', $userData['email'])->first();
        $this->assertTrue($user->hasRole('editor'));
    }
    
    /** @test */
    public function admin_can_show_user()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.show', $this->testUser));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/users/show')
            ->has('user')
        );
    }
    
    /** @test */
    public function admin_can_edit_user()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.edit', $this->testUser));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/users/edit')
            ->has('user')
            ->has('roles')
        );
    }
    
    /** @test */
    public function admin_can_update_user()
    {
        $updatedData = [
            'name' => 'Updated User Name',
            'email' => $this->testUser->email,
            'roles' => ['editor'],
        ];
        
        $response = $this->actingAs($this->admin)
            ->put(route('admin.users.update', $this->testUser), $updatedData);
        
        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('users', [
            'id' => $this->testUser->id,
            'name' => $updatedData['name'],
        ]);
        
        $this->testUser->refresh();
        $this->assertTrue($this->testUser->hasRole('editor'));
    }
    
    /** @test */
    public function admin_can_update_user_with_password()
    {
        $updatedData = [
            'name' => 'Updated User Name',
            'email' => $this->testUser->email,
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
            'roles' => ['editor'],
        ];
        
        $response = $this->actingAs($this->admin)
            ->put(route('admin.users.update', $this->testUser), $updatedData);
        
        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success');
        
        $this->testUser->refresh();
        $this->assertTrue(Hash::check('newpassword', $this->testUser->password));
    }
    
    /** @test */
    public function admin_can_delete_user()
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.destroy', $this->testUser));
        
        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success');
        
        $this->assertDatabaseMissing('users', [
            'id' => $this->testUser->id,
        ]);
    }
    
    /** @test */
    public function admin_cannot_delete_self()
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.destroy', $this->admin));
        
        $response->assertRedirect();
        $response->assertSessionHas('error');
        
        $this->assertDatabaseHas('users', [
            'id' => $this->admin->id,
        ]);
    }
    
    /** @test */
    public function non_admin_cannot_create_user()
    {
        $response = $this->actingAs($this->editor)
            ->get(route('admin.users.create'));
        
        $response->assertStatus(403);
    }
    
    /** @test */
    public function non_admin_cannot_store_user()
    {
        $userData = [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password',
            'password_confirmation' => 'password',
        ];
        
        $response = $this->actingAs($this->editor)
            ->post(route('admin.users.store'), $userData);
        
        $response->assertStatus(403);
    }
    
    /** @test */
    public function non_admin_cannot_update_user()
    {
        $updatedData = [
            'name' => 'Updated User Name',
            'email' => $this->testUser->email,
        ];
        
        $response = $this->actingAs($this->editor)
            ->put(route('admin.users.update', $this->testUser), $updatedData);
        
        $response->assertStatus(403);
    }
    
    /** @test */
    public function non_admin_cannot_delete_user()
    {
        $response = $this->actingAs($this->editor)
            ->delete(route('admin.users.destroy', $this->testUser));
        
        $response->assertStatus(403);
    }
}
