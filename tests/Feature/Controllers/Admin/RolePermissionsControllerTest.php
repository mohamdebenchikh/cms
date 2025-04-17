<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RolePermissionsControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $admin;
    protected User $editor;
    protected Role $testRole;
    protected Permission $testPermission;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles and permissions
        $adminRole = Role::create(['name' => 'admin']);
        $editorRole = Role::create(['name' => 'editor']);
        $this->testRole = Role::create(['name' => 'test-role']);

        Permission::create(['name' => 'view roles']);
        Permission::create(['name' => 'create roles']);
        Permission::create(['name' => 'edit roles']);
        Permission::create(['name' => 'delete roles']);

        $this->testPermission = Permission::create(['name' => 'test permission']);

        $adminRole->givePermissionTo(Permission::all());
        $editorRole->givePermissionTo(['view roles']);

        // Create users
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->editor = User::factory()->create();
        $this->editor->assignRole('editor');
    }

    /** @test */
    public function admin_can_view_roles_index()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.roles.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/roles/index')
            ->has('roles')
        );
    }

    /** @test */
    public function editor_can_view_roles_index()
    {
        $response = $this->actingAs($this->editor)
            ->get(route('admin.roles.index'));

        $response->assertStatus(200);
    }

    /** @test */
    public function guest_cannot_view_roles_index()
    {
        $response = $this->get(route('admin.roles.index'));

        $response->assertRedirect(route('admin.login'));
    }

    /** @test */
    public function admin_can_view_permissions_index()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.permissions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/roles/permissions')
            ->has('permissions')
        );
    }

    /** @test */
    public function admin_can_create_role()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.roles.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/roles/create')
            ->has('permissions')
        );
    }

    /** @test */
    public function admin_can_store_role()
    {
        $roleData = [
            'name' => 'new-role',
            'permissions' => [$this->testPermission->name],
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.roles.store'), $roleData);

        $response->assertRedirect(route('admin.roles.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('roles', [
            'name' => $roleData['name'],
        ]);

        $role = Role::where('name', $roleData['name'])->first();
        $this->assertTrue($role->hasPermissionTo($this->testPermission->name));
    }

    /** @test */
    public function admin_can_show_role()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.roles.show', $this->testRole));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/roles/show')
            ->has('role')
        );
    }

    /** @test */
    public function admin_can_edit_role()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.roles.edit', $this->testRole));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/roles/edit')
            ->has('role')
            ->has('permissions')
        );
    }

    /** @test */
    public function admin_can_update_role()
    {
        $updatedData = [
            'name' => 'updated-role',
            'permissions' => [$this->testPermission->name],
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.roles.update', $this->testRole), $updatedData);

        $response->assertRedirect(route('admin.roles.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('roles', [
            'id' => $this->testRole->id,
            'name' => $updatedData['name'],
        ]);

        $this->testRole->refresh();
        $this->assertTrue($this->testRole->hasPermissionTo($this->testPermission->name));
    }

    /** @test */
    public function admin_cannot_update_admin_role_name()
    {
        $adminRole = Role::where('name', 'admin')->first();

        $updatedData = [
            'name' => 'changed-admin',
            'permissions' => ['view roles'],
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.roles.update', $adminRole), $updatedData);

        $response->assertRedirect();
        $response->assertSessionHas('error');

        $this->assertDatabaseHas('roles', [
            'id' => $adminRole->id,
            'name' => 'admin',
        ]);
    }

    /** @test */
    public function admin_can_delete_role()
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.roles.destroy', $this->testRole));

        $response->assertRedirect(route('admin.roles.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('roles', [
            'id' => $this->testRole->id,
        ]);
    }

    /** @test */
    public function admin_cannot_delete_admin_role()
    {
        $adminRole = Role::where('name', 'admin')->first();

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.roles.destroy', $adminRole));

        $response->assertRedirect();
        $response->assertSessionHas('error');

        $this->assertDatabaseHas('roles', [
            'id' => $adminRole->id,
        ]);
    }

    /** @test */
    public function editor_cannot_create_role()
    {
        $response = $this->actingAs($this->editor)
            ->get(route('admin.roles.create'));

        $response->assertStatus(403);
    }

    /** @test */
    public function editor_cannot_store_role()
    {
        $roleData = [
            'name' => 'new-role',
            'permissions' => [$this->testPermission->name],
        ];

        $response = $this->actingAs($this->editor)
            ->post(route('admin.roles.store'), $roleData);

        $response->assertStatus(403);
    }

    /** @test */
    public function editor_cannot_update_role()
    {
        $updatedData = [
            'name' => 'updated-role',
            'permissions' => [$this->testPermission->name],
        ];

        $response = $this->actingAs($this->editor)
            ->put(route('admin.roles.update', $this->testRole), $updatedData);

        $response->assertStatus(403);
    }

    /** @test */
    public function editor_cannot_delete_role()
    {
        $response = $this->actingAs($this->editor)
            ->delete(route('admin.roles.destroy', $this->testRole));

        $response->assertStatus(403);
    }
}
