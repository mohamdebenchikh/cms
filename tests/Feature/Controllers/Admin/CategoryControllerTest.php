<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $admin;
    protected User $user;
    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles and permissions
        $adminRole = Role::create(['name' => 'admin']);
        $editorRole = Role::create(['name' => 'editor']);

        Permission::create(['name' => 'view categories']);
        Permission::create(['name' => 'create categories']);
        Permission::create(['name' => 'edit categories']);
        Permission::create(['name' => 'delete categories']);

        $adminRole->givePermissionTo(Permission::all());
        $editorRole->givePermissionTo(['view categories']);

        // Create users
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->user = User::factory()->create();
        $this->user->assignRole('editor');

        // Create a category
        $this->category = Category::factory()->create();
    }

    /** @test */
    public function admin_can_view_categories_index()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.categories.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/categories/index')
            ->has('categories')
        );
    }

    /** @test */
    public function editor_can_view_categories_index()
    {
        $response = $this->actingAs($this->user)
            ->get(route('admin.categories.index'));

        $response->assertStatus(200);
    }

    /** @test */
    public function guest_cannot_view_categories_index()
    {
        $response = $this->get(route('admin.categories.index'));

        $response->assertRedirect(route('admin.login'));
    }

    /** @test */
    public function admin_can_create_category()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.categories.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/categories/create')
        );
    }

    /** @test */
    public function admin_can_store_category()
    {
        $categoryData = [
            'name' => $this->faker->word,
            'slug' => $this->faker->slug,
            'description' => $this->faker->sentence,
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.categories.store'), $categoryData);

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('categories', [
            'name' => $categoryData['name'],
            'slug' => $categoryData['slug'],
        ]);
    }

    /** @test */
    public function admin_can_show_category()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.categories.show', $this->category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/categories/show')
            ->has('category')
        );
    }

    /** @test */
    public function admin_can_edit_category()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.categories.edit', $this->category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/categories/edit')
            ->has('category')
        );
    }

    /** @test */
    public function admin_can_update_category()
    {
        $updatedData = [
            'name' => 'Updated Category',
            'slug' => 'updated-category',
            'description' => 'Updated description',
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.categories.update', $this->category), $updatedData);

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('categories', [
            'id' => $this->category->id,
            'name' => $updatedData['name'],
            'slug' => $updatedData['slug'],
        ]);
    }

    /** @test */
    public function admin_can_delete_category()
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.categories.destroy', $this->category));

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('categories', [
            'id' => $this->category->id,
        ]);
    }

    /** @test */
    public function editor_cannot_create_category()
    {
        $response = $this->actingAs($this->user)
            ->get(route('admin.categories.create'));

        $response->assertStatus(403);
    }

    /** @test */
    public function editor_cannot_store_category()
    {
        $categoryData = [
            'name' => $this->faker->word,
            'slug' => $this->faker->slug,
            'description' => $this->faker->sentence,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('admin.categories.store'), $categoryData);

        $response->assertStatus(403);
    }

    /** @test */
    public function editor_cannot_update_category()
    {
        $updatedData = [
            'name' => 'Updated Category',
            'slug' => 'updated-category',
            'description' => 'Updated description',
        ];

        $response = $this->actingAs($this->user)
            ->put(route('admin.categories.update', $this->category), $updatedData);

        $response->assertStatus(403);
    }

    /** @test */
    public function editor_cannot_delete_category()
    {
        $response = $this->actingAs($this->user)
            ->delete(route('admin.categories.destroy', $this->category));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_bulk_delete_categories()
    {
        // Create additional categories
        $categories = Category::factory()->count(3)->create();
        $categoryIds = $categories->pluck('id')->toArray();

        $response = $this->actingAs($this->admin)
            ->post(route('admin.categories.bulk-destroy'), [
                'ids' => $categoryIds,
            ]);

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success');

        foreach ($categoryIds as $id) {
            $this->assertDatabaseMissing('categories', ['id' => $id]);
        }
    }

    /** @test */
    public function admin_cannot_bulk_delete_categories_with_posts()
    {
        // Create a category with posts
        $category = Category::factory()->create();
        $category->posts()->create([
            'user_id' => $this->admin->id,
            'title' => 'Test Post',
            'slug' => 'test-post',
            'content' => 'Test content',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.categories.bulk-destroy'), [
                'ids' => [$category->id],
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('error');

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    /** @test */
    public function editor_cannot_bulk_delete_categories()
    {
        // Create additional categories
        $categories = Category::factory()->count(3)->create();
        $categoryIds = $categories->pluck('id')->toArray();

        $response = $this->actingAs($this->user)
            ->post(route('admin.categories.bulk-destroy'), [
                'ids' => $categoryIds,
            ]);

        $response->assertStatus(403);

        foreach ($categoryIds as $id) {
            $this->assertDatabaseHas('categories', ['id' => $id]);
        }
    }
}
