<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Image;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ImageControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $admin;
    protected User $author;
    protected Image $image;
    protected Image $adminImage;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles and permissions
        $adminRole = Role::create(['name' => 'admin']);
        $authorRole = Role::create(['name' => 'author']);

        Permission::create(['name' => 'view images']);
        Permission::create(['name' => 'create images']);
        Permission::create(['name' => 'edit images']);
        Permission::create(['name' => 'delete images']);
        Permission::create(['name' => 'edit all images']);
        Permission::create(['name' => 'delete all images']);

        $adminRole->givePermissionTo(Permission::all());
        $authorRole->givePermissionTo([
            'view images', 'create images', 'edit images', 'delete images'
        ]);

        // Create users
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->author = User::factory()->create();
        $this->author->assignRole('author');

        // Create images
        $this->image = Image::factory()->create([
            'user_id' => $this->author->id,
        ]);

        $this->adminImage = Image::factory()->create([
            'user_id' => $this->admin->id,
        ]);
    }

    /** @test */
    public function admin_can_view_images_index()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.images.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/images/index')
            ->has('images')
        );
    }

    /** @test */
    public function author_can_view_images_index()
    {
        $response = $this->actingAs($this->author)
            ->get(route('admin.images.index'));

        $response->assertStatus(200);
    }

    /** @test */
    public function guest_cannot_view_images_index()
    {
        $response = $this->get(route('admin.images.index'));

        $response->assertRedirect(route('admin.login'));
    }

    /** @test */
    public function admin_can_create_image()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.images.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/images/create')
        );
    }

    /** @test */
    public function admin_can_store_image()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('test-image.jpg');

        $imageData = [
            'image' => $file,
            'alt_text' => 'Test Alt Text',
            'title' => 'Test Title',
            'description' => 'Test Description',
            'collection' => 'test',
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.images.store'), $imageData);

        $response->assertRedirect(route('admin.images.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('images', [
            'user_id' => $this->admin->id,
            'alt_text' => $imageData['alt_text'],
            'title' => $imageData['title'],
            'collection' => $imageData['collection'],
        ]);

        // Check that the file was stored
        $image = Image::where('title', $imageData['title'])->first();
        Storage::disk('public')->assertExists($image->path);
    }

    /** @test */
    public function admin_can_show_image()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.images.show', $this->image));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/images/show')
            ->has('image')
        );
    }

    /** @test */
    public function admin_can_edit_image()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.images.edit', $this->image));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/images/edit')
            ->has('image')
        );
    }

    /** @test */
    public function admin_can_update_image()
    {
        $updatedData = [
            'alt_text' => 'Updated Alt Text',
            'title' => 'Updated Title',
            'description' => 'Updated Description',
            'collection' => 'updated',
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.images.update', $this->image), $updatedData);

        $response->assertRedirect(route('admin.images.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('images', [
            'id' => $this->image->id,
            'alt_text' => $updatedData['alt_text'],
            'title' => $updatedData['title'],
            'collection' => $updatedData['collection'],
        ]);
    }

    /** @test */
    public function admin_can_delete_image()
    {
        Storage::fake('public');

        // Create a new image with a file
        $file = UploadedFile::fake()->image('test-image.jpg');
        $path = $file->store('images', 'public');

        $image = Image::factory()->create([
            'user_id' => $this->admin->id,
            'path' => $path,
            'disk' => 'public',
        ]);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.images.destroy', $image));

        $response->assertRedirect(route('admin.images.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('images', [
            'id' => $image->id,
        ]);

        // Check that the file was deleted
        Storage::disk('public')->assertMissing($path);
    }

    /** @test */
    public function author_can_create_image()
    {
        $response = $this->actingAs($this->author)
            ->get(route('admin.images.create'));

        $response->assertStatus(200);
    }

    /** @test */
    public function author_can_edit_own_image()
    {
        $response = $this->actingAs($this->author)
            ->get(route('admin.images.edit', $this->image));

        $response->assertStatus(200);
    }

    /** @test */
    public function author_cannot_edit_others_image()
    {
        $response = $this->actingAs($this->author)
            ->get(route('admin.images.edit', $this->adminImage));

        $response->assertStatus(403);
    }

    /** @test */
    public function author_can_delete_own_image()
    {
        $response = $this->actingAs($this->author)
            ->delete(route('admin.images.destroy', $this->image));

        $response->assertRedirect(route('admin.images.index'));
        $response->assertSessionHas('success');
    }

    /** @test */
    public function author_cannot_delete_others_image()
    {
        $response = $this->actingAs($this->author)
            ->delete(route('admin.images.destroy', $this->adminImage));

        $response->assertStatus(403);
    }
}
