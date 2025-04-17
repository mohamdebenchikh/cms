<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $admin;
    protected User $author;
    protected User $editor;
    protected Post $post;
    protected Category $category;
    protected Tag $tag;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles and permissions
        $adminRole = Role::create(['name' => 'admin']);
        $editorRole = Role::create(['name' => 'editor']);
        $authorRole = Role::create(['name' => 'author']);

        Permission::create(['name' => 'view posts']);
        Permission::create(['name' => 'create posts']);
        Permission::create(['name' => 'edit posts']);
        Permission::create(['name' => 'delete posts']);
        Permission::create(['name' => 'publish posts']);
        Permission::create(['name' => 'edit all posts']);
        Permission::create(['name' => 'delete all posts']);

        $adminRole->givePermissionTo(Permission::all());
        $editorRole->givePermissionTo([
            'view posts', 'create posts', 'edit posts', 'delete posts',
            'publish posts', 'edit all posts', 'delete all posts'
        ]);
        $authorRole->givePermissionTo([
            'view posts', 'create posts', 'edit posts', 'delete posts', 'publish posts'
        ]);

        // Create users
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->editor = User::factory()->create();
        $this->editor->assignRole('editor');

        $this->author = User::factory()->create();
        $this->author->assignRole('author');

        // Create category and tag
        $this->category = Category::factory()->create();
        $this->tag = Tag::factory()->create();

        // Create a post
        $this->post = Post::factory()->create([
            'user_id' => $this->author->id,
            'category_id' => $this->category->id,
        ]);

        // Attach tag to post
        $this->post->tags()->attach($this->tag->id);
    }

    /** @test */
    public function admin_can_view_posts_index()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.posts.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/posts/index')
            ->has('posts')
        );
    }

    /** @test */
    public function editor_can_view_posts_index()
    {
        $response = $this->actingAs($this->editor)
            ->get(route('admin.posts.index'));

        $response->assertStatus(200);
    }

    /** @test */
    public function author_can_view_posts_index()
    {
        $response = $this->actingAs($this->author)
            ->get(route('admin.posts.index'));

        $response->assertStatus(200);
    }

    /** @test */
    public function guest_cannot_view_posts_index()
    {
        $response = $this->get(route('admin.posts.index'));

        $response->assertRedirect(route('admin.login'));
    }

    /** @test */
    public function admin_can_create_post()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.posts.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/posts/create')
            ->has('categories')
            ->has('tags')
        );
    }

    /** @test */
    public function admin_can_store_post()
    {
        $postData = [
            'title' => $this->faker->sentence,
            'slug' => $this->faker->slug,
            'content' => $this->faker->paragraphs(3, true),
            'excerpt' => $this->faker->paragraph,
            'category_id' => $this->category->id,
            'status' => 'published',
            'tags' => [$this->tag->id],
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.posts.store'), $postData);

        $response->assertRedirect(route('admin.posts.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('posts', [
            'title' => $postData['title'],
            'slug' => $postData['slug'],
            'user_id' => $this->admin->id,
        ]);
    }

    /** @test */
    public function admin_can_show_post()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.posts.show', $this->post));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/posts/show')
            ->has('post')
        );
    }

    /** @test */
    public function admin_can_edit_post()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.posts.edit', $this->post));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/posts/edit')
            ->has('post')
            ->has('categories')
            ->has('tags')
        );
    }

    /** @test */
    public function admin_can_update_post()
    {
        $updatedData = [
            'title' => 'Updated Post Title',
            'slug' => 'updated-post-title',
            'content' => 'Updated content',
            'excerpt' => 'Updated excerpt',
            'category_id' => $this->category->id,
            'status' => 'published',
            'tags' => [$this->tag->id],
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.posts.update', $this->post), $updatedData);

        $response->assertRedirect(route('admin.posts.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('posts', [
            'id' => $this->post->id,
            'title' => $updatedData['title'],
            'slug' => $updatedData['slug'],
        ]);
    }

    /** @test */
    public function admin_can_delete_post()
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.posts.destroy', $this->post));

        $response->assertRedirect(route('admin.posts.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('posts', [
            'id' => $this->post->id,
        ]);
    }

    /** @test */
    public function editor_can_edit_any_post()
    {
        $response = $this->actingAs($this->editor)
            ->get(route('admin.posts.edit', $this->post));

        $response->assertStatus(200);
    }

    /** @test */
    public function editor_can_update_any_post()
    {
        $updatedData = [
            'title' => 'Updated by Editor',
            'slug' => 'updated-by-editor',
            'content' => 'Updated content by editor',
            'excerpt' => 'Updated excerpt by editor',
            'category_id' => $this->category->id,
            'status' => 'published',
            'tags' => [$this->tag->id],
        ];

        $response = $this->actingAs($this->editor)
            ->put(route('admin.posts.update', $this->post), $updatedData);

        $response->assertRedirect(route('admin.posts.index'));
        $response->assertSessionHas('success');
    }

    /** @test */
    public function author_can_edit_own_post()
    {
        $response = $this->actingAs($this->author)
            ->get(route('admin.posts.edit', $this->post));

        $response->assertStatus(200);
    }

    /** @test */
    public function author_cannot_edit_others_post()
    {
        $otherPost = Post::factory()->create([
            'user_id' => $this->admin->id,
            'category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->author)
            ->get(route('admin.posts.edit', $otherPost));

        $response->assertStatus(403);
    }

    /** @test */
    public function author_can_delete_own_post()
    {
        $response = $this->actingAs($this->author)
            ->delete(route('admin.posts.destroy', $this->post));

        $response->assertRedirect(route('admin.posts.index'));
        $response->assertSessionHas('success');
    }

    /** @test */
    public function author_cannot_delete_others_post()
    {
        $otherPost = Post::factory()->create([
            'user_id' => $this->admin->id,
            'category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->author)
            ->delete(route('admin.posts.destroy', $otherPost));

        $response->assertStatus(403);
    }
}
