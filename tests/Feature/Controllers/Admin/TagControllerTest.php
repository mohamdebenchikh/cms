<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TagControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $admin;
    protected User $user;
    protected Tag $tag;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles and permissions
        $adminRole = Role::create(['name' => 'admin']);
        $editorRole = Role::create(['name' => 'editor']);
        
        Permission::create(['name' => 'view tags']);
        Permission::create(['name' => 'create tags']);
        Permission::create(['name' => 'edit tags']);
        Permission::create(['name' => 'delete tags']);
        
        $adminRole->givePermissionTo(Permission::all());
        $editorRole->givePermissionTo(['view tags']);
        
        // Create users
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
        
        $this->user = User::factory()->create();
        $this->user->assignRole('editor');
        
        // Create a tag
        $this->tag = Tag::factory()->create();
    }

    /** @test */
    public function admin_can_view_tags_index()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.tags.index'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/tags/index')
            ->has('tags')
        );
    }
    
    /** @test */
    public function editor_can_view_tags_index()
    {
        $response = $this->actingAs($this->user)
            ->get(route('admin.tags.index'));
        
        $response->assertStatus(200);
    }
    
    /** @test */
    public function guest_cannot_view_tags_index()
    {
        $response = $this->get(route('admin.tags.index'));
        
        $response->assertRedirect(route('login'));
    }
    
    /** @test */
    public function admin_can_create_tag()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.tags.create'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/tags/create')
        );
    }
    
    /** @test */
    public function admin_can_store_tag()
    {
        $tagData = [
            'name' => $this->faker->word,
            'slug' => $this->faker->slug,
        ];
        
        $response = $this->actingAs($this->admin)
            ->post(route('admin.tags.store'), $tagData);
        
        $response->assertRedirect(route('admin.tags.index'));
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('tags', [
            'name' => $tagData['name'],
            'slug' => $tagData['slug'],
        ]);
    }
    
    /** @test */
    public function admin_can_show_tag()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.tags.show', $this->tag));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/tags/show')
            ->has('tag')
        );
    }
    
    /** @test */
    public function admin_can_edit_tag()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.tags.edit', $this->tag));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/tags/edit')
            ->has('tag')
        );
    }
    
    /** @test */
    public function admin_can_update_tag()
    {
        $updatedData = [
            'name' => 'Updated Tag',
            'slug' => 'updated-tag',
        ];
        
        $response = $this->actingAs($this->admin)
            ->put(route('admin.tags.update', $this->tag), $updatedData);
        
        $response->assertRedirect(route('admin.tags.index'));
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('tags', [
            'id' => $this->tag->id,
            'name' => $updatedData['name'],
            'slug' => $updatedData['slug'],
        ]);
    }
    
    /** @test */
    public function admin_can_delete_tag()
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.tags.destroy', $this->tag));
        
        $response->assertRedirect(route('admin.tags.index'));
        $response->assertSessionHas('success');
        
        $this->assertDatabaseMissing('tags', [
            'id' => $this->tag->id,
        ]);
    }
    
    /** @test */
    public function editor_cannot_create_tag()
    {
        $response = $this->actingAs($this->user)
            ->get(route('admin.tags.create'));
        
        $response->assertStatus(403);
    }
    
    /** @test */
    public function editor_cannot_store_tag()
    {
        $tagData = [
            'name' => $this->faker->word,
            'slug' => $this->faker->slug,
        ];
        
        $response = $this->actingAs($this->user)
            ->post(route('admin.tags.store'), $tagData);
        
        $response->assertStatus(403);
    }
    
    /** @test */
    public function editor_cannot_update_tag()
    {
        $updatedData = [
            'name' => 'Updated Tag',
            'slug' => 'updated-tag',
        ];
        
        $response = $this->actingAs($this->user)
            ->put(route('admin.tags.update', $this->tag), $updatedData);
        
        $response->assertStatus(403);
    }
    
    /** @test */
    public function editor_cannot_delete_tag()
    {
        $response = $this->actingAs($this->user)
            ->delete(route('admin.tags.destroy', $this->tag));
        
        $response->assertStatus(403);
    }
}
