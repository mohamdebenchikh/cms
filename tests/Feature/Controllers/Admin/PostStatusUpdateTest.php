<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PostStatusUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected Post $post;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles and permissions
        $adminRole = Role::create(['name' => 'admin']);
        $editorRole = Role::create(['name' => 'editor']);
        
        Permission::create(['name' => 'view posts']);
        Permission::create(['name' => 'create posts']);
        Permission::create(['name' => 'edit posts']);
        Permission::create(['name' => 'delete posts']);
        Permission::create(['name' => 'publish posts']);
        
        // Assign permissions to roles
        $adminRole->givePermissionTo(Permission::all());
        $editorRole->givePermissionTo(['view posts', 'create posts', 'edit posts', 'publish posts']);
        
        // Create admin user
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
        
        // Create a post
        $this->post = Post::factory()->create([
            'status' => 'draft',
            'user_id' => $this->admin->id,
        ]);
    }

    /** @test */
    public function admin_can_update_post_status()
    {
        $response = $this->actingAs($this->admin)
            ->patch(route('admin.posts.update-status', $this->post), [
                'status' => 'published',
            ]);
        
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);
        
        // Check that the post status was updated
        $this->post->refresh();
        $this->assertEquals('published', $this->post->status);
        $this->assertNotNull($this->post->published_at);
    }

    /** @test */
    public function admin_can_archive_post()
    {
        $response = $this->actingAs($this->admin)
            ->patch(route('admin.posts.update-status', $this->post), [
                'status' => 'archived',
            ]);
        
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);
        
        // Check that the post status was updated
        $this->post->refresh();
        $this->assertEquals('archived', $this->post->status);
    }

    /** @test */
    public function published_at_is_not_changed_when_updating_to_draft()
    {
        // First publish the post to set published_at
        $this->post->update([
            'status' => 'published',
            'published_at' => now(),
        ]);
        
        $publishedAt = $this->post->published_at;
        
        // Then update to draft
        $response = $this->actingAs($this->admin)
            ->patch(route('admin.posts.update-status', $this->post), [
                'status' => 'draft',
            ]);
        
        $response->assertStatus(200);
        
        // Check that published_at was not changed
        $this->post->refresh();
        $this->assertEquals('draft', $this->post->status);
        $this->assertEquals($publishedAt, $this->post->published_at);
    }

    /** @test */
    public function validation_fails_with_invalid_status()
    {
        $response = $this->actingAs($this->admin)
            ->patch(route('admin.posts.update-status', $this->post), [
                'status' => 'invalid-status',
            ]);
        
        $response->assertStatus(422);
    }
}
