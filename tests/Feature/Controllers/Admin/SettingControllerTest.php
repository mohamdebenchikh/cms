<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Setting;
use App\Models\User;
use App\Services\SettingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class SettingControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $admin;
    protected User $editor;
    protected Setting $setting;
    protected SettingService $settingService;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles and permissions
        $adminRole = Role::create(['name' => 'admin']);
        $editorRole = Role::create(['name' => 'editor']);

        Permission::create(['name' => 'view settings']);
        Permission::create(['name' => 'create settings']);
        Permission::create(['name' => 'edit settings']);
        Permission::create(['name' => 'delete settings']);

        $adminRole->givePermissionTo(Permission::all());
        $editorRole->givePermissionTo(['view settings']);

        // Create users
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->editor = User::factory()->create();
        $this->editor->assignRole('editor');

        // Create a setting
        $this->setting = Setting::create([
            'key' => 'site_name',
            'value' => 'Test Site',
            'display_name' => 'Site Name',
            'type' => 'text',
            'group' => 'general',
            'description' => 'The name of the site',
            'is_public' => true,
            'order' => 1,
        ]);

        // Create the setting service
        $this->settingService = app(SettingService::class);
    }

    /** @test */
    public function admin_can_view_settings_index()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.settings.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/settings/index')
            ->has('settings')
            ->has('groups')
        );
    }

    /** @test */
    public function editor_can_view_settings_index()
    {
        $response = $this->actingAs($this->editor)
            ->get(route('admin.settings.index'));

        $response->assertStatus(200);
    }

    /** @test */
    public function guest_cannot_view_settings_index()
    {
        $response = $this->get(route('admin.settings.index'));

        $response->assertRedirect(route('admin.login'));
    }

    /** @test */
    public function admin_can_create_setting()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.settings.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/settings/create')
            ->has('groups')
        );
    }

    /** @test */
    public function admin_can_store_setting()
    {
        $settingData = [
            'key' => 'new_setting',
            'value' => 'New Value',
            'display_name' => 'New Setting',
            'type' => 'text',
            'group' => 'general',
            'description' => 'A new setting',
            'is_public' => true,
            'order' => 2,
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.settings.store'), $settingData);

        $response->assertRedirect(route('admin.settings.index', ['group' => 'general']));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('settings', [
            'key' => $settingData['key'],
            'value' => $settingData['value'],
            'display_name' => $settingData['display_name'],
        ]);
    }

    /** @test */
    public function admin_can_edit_setting()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.settings.edit', $this->setting));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/settings/edit')
            ->has('setting')
            ->has('groups')
        );
    }

    /** @test */
    public function admin_can_update_setting()
    {
        $updatedData = [
            'value' => 'Updated Site Name',
            'display_name' => 'Updated Site Name',
            'type' => 'text',
            'group' => 'general',
            'description' => 'Updated description',
            'is_public' => true,
            'order' => 1,
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.settings.update', $this->setting), $updatedData);

        $response->assertRedirect(route('admin.settings.index', ['group' => 'general']));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('settings', [
            'id' => $this->setting->id,
            'value' => $updatedData['value'],
            'display_name' => $updatedData['display_name'],
        ]);
    }

    /** @test */
    public function admin_can_delete_setting()
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.settings.destroy', $this->setting));

        $response->assertRedirect(route('admin.settings.index', ['group' => 'general']));
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('settings', [
            'id' => $this->setting->id,
        ]);
    }

    /** @test */
    public function admin_can_update_group_settings()
    {
        $groupData = [
            'settings' => [
                'site_name' => 'Updated via Group',
            ],
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.settings.update-group', ['group' => 'general']), $groupData);

        $response->assertRedirect(route('admin.settings.index', ['group' => 'general']));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('settings', [
            'key' => 'site_name',
            'value' => 'Updated via Group',
        ]);
    }

    /** @test */
    public function editor_cannot_create_setting()
    {
        $response = $this->actingAs($this->editor)
            ->get(route('admin.settings.create'));

        $response->assertStatus(403);
    }

    /** @test */
    public function editor_cannot_store_setting()
    {
        $settingData = [
            'key' => 'new_setting',
            'value' => 'New Value',
            'display_name' => 'New Setting',
            'type' => 'text',
            'group' => 'general',
            'description' => 'A new setting',
            'is_public' => true,
            'order' => 2,
        ];

        $response = $this->actingAs($this->editor)
            ->post(route('admin.settings.store'), $settingData);

        $response->assertStatus(403);
    }

    /** @test */
    public function editor_cannot_update_setting()
    {
        $updatedData = [
            'value' => 'Updated Site Name',
            'display_name' => 'Updated Site Name',
            'type' => 'text',
            'group' => 'general',
            'description' => 'Updated description',
            'is_public' => true,
            'order' => 1,
        ];

        $response = $this->actingAs($this->editor)
            ->put(route('admin.settings.update', $this->setting), $updatedData);

        $response->assertStatus(403);
    }

    /** @test */
    public function editor_cannot_delete_setting()
    {
        $response = $this->actingAs($this->editor)
            ->delete(route('admin.settings.destroy', $this->setting));

        $response->assertStatus(403);
    }

    /** @test */
    public function editor_cannot_update_group_settings()
    {
        $groupData = [
            'settings' => [
                'site_name' => 'Updated via Group',
            ],
        ];

        $response = $this->actingAs($this->editor)
            ->post(route('admin.settings.update-group', ['group' => 'general']), $groupData);

        $response->assertStatus(403);
    }

    /** @test */
    public function setting_service_can_get_setting()
    {
        $value = $this->settingService->get('site_name');

        $this->assertEquals('Test Site', $value);
    }

    /** @test */
    public function setting_service_can_set_setting()
    {
        $this->settingService->set('site_name', 'Updated via Service');

        $this->assertDatabaseHas('settings', [
            'key' => 'site_name',
            'value' => 'Updated via Service',
        ]);

        $value = $this->settingService->get('site_name');
        $this->assertEquals('Updated via Service', $value);
    }
}
