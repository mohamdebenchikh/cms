<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PageControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $admin;
    protected User $editor;
    protected User $author;
    protected Page $page;
    protected Page $adminPage;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles and permissions
        $adminRole = Role::create(['name' => 'admin']);
        $editorRole = Role::create(['name' => 'editor']);
        $authorRole = Role::create(['name' => 'author']);

        Permission::create(['name' => 'view pages']);
        Permission::create(['name' => 'create pages']);
        Permission::create(['name' => 'edit pages']);
        Permission::create(['name' => 'delete pages']);
        Permission::create(['name' => 'publish pages']);
        Permission::create(['name' => 'edit all pages']);
        Permission::create(['name' => 'delete all pages']);

        $adminRole->givePermissionTo(Permission::all());
        $editorRole->givePermissionTo([
            'view pages', 'create pages', 'edit pages', 'delete pages',
            'publish pages', 'edit all pages', 'delete all pages'
        ]);
        $authorRole->givePermissionTo(['view pages']);

        // Create users
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->editor = User::factory()->create();
        $this->editor->assignRole('editor');

        $this->author = User::factory()->create();
        $this->author->assignRole('author');

        // Create pages
        $this->page = Page::factory()->create([
            'user_id' => $this->editor->id,
        ]);

        $this->adminPage = Page::factory()->create([
            'user_id' => $this->admin->id,
        ]);
    }

    /** @test */
    public function admin_can_view_pages_index()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.pages.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/pages/index')
            ->has('pages')
        );
    }

    /** @test */
    public function editor_can_view_pages_index()
    {
        $response = $this->actingAs($this->editor)
            ->get(route('admin.pages.index'));

        $response->assertStatus(200);
    }

    /** @test */
    public function author_can_view_pages_index()
    {
        $response = $this->actingAs($this->author)
            ->get(route('admin.pages.index'));

        $response->assertStatus(200);
    }

    /** @test */
    public function guest_cannot_view_pages_index()
    {
        $response = $this->get(route('admin.pages.index'));

        $response->assertRedirect(route('admin.login'));
    }

    /** @test */
    public function admin_can_create_page()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.pages.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/pages/create')
        );
    }

    /** @test */
    public function admin_can_store_page()
    {
        $pageData = [
            'title' => $this->faker->sentence,
            'slug' => $this->faker->slug,
            'content' => $this->faker->paragraphs(3, true),
            'status' => 'published',
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.pages.store'), $pageData);

        $response->assertRedirect(route('admin.pages.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('pages', [
            'title' => $pageData['title'],
            'slug' => $pageData['slug'],
            'user_id' => $this->admin->id,
        ]);
    }

    /** @test */
    public function admin_can_show_page()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.pages.show', $this->page));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/pages/show')
            ->has('page')
        );
    }

    /** @test */
    public function admin_can_edit_page()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.pages.edit', $this->page));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/pages/edit')
            ->has('page')
        );
    }

    /** @test */
    public function admin_can_update_page()
    {
        $updatedData = [
            'title' => 'Updated Page Title',
            'slug' => 'updated-page-title',
            'content' => 'Updated content',
            'status' => 'published',
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.pages.update', $this->page), $updatedData);

        $response->assertRedirect(route('admin.pages.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('pages', [
            'id' => $this->page->id,
            'title' => $updatedData['title'],
            'slug' => $updatedData['slug'],
        ]);
    }

    /** @test */
    public function admin_can_delete_page()
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.pages.destroy', $this->page));

        $response->assertRedirect(route('admin.pages.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('pages', [
            'id' => $this->page->id,
        ]);
    }

    /** @test */
    public function editor_can_create_page()
    {
        $response = $this->actingAs($this->editor)
            ->get(route('admin.pages.create'));

        $response->assertStatus(200);
    }

    /** @test */
    public function editor_can_edit_own_page()
    {
        $response = $this->actingAs($this->editor)
            ->get(route('admin.pages.edit', $this->page));

        $response->assertStatus(200);
    }

    /** @test */
    public function editor_can_edit_any_page()
    {
        $response = $this->actingAs($this->editor)
            ->get(route('admin.pages.edit', $this->adminPage));

        $response->assertStatus(200);
    }

    /** @test */
    public function author_cannot_create_page()
    {
        $response = $this->actingAs($this->author)
            ->get(route('admin.pages.create'));

        $response->assertStatus(403);
    }

    /** @test */
    public function author_cannot_edit_page()
    {
        $response = $this->actingAs($this->author)
            ->get(route('admin.pages.edit', $this->page));

        $response->assertStatus(403);
    }

    /** @test */
    public function author_cannot_delete_page()
    {
        $response = $this->actingAs($this->author)
            ->delete(route('admin.pages.destroy', $this->page));

        $response->assertStatus(403);
    }
}
