<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create regular users
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create additional users
        User::factory(5)->create();

        // Create roles and permissions
        $this->call(RolesAndPermissionsSeeder::class);

        // Create admin user and assign role
        $this->call(AdminSeeder::class);

        // Create categories with image_cover and SEO data
        $this->call(CategorySeeder::class);

        // Create tags
        $this->call(TagSeeder::class);

        // Create posts with featured images, is_featured flag, and SEO data
        $this->call(PostSeeder::class);

        // Create pages
        Page::factory(15)
            ->recycle([$user, ...(User::all())])
            ->create();

        // Create some published pages
        Page::factory(5)
            ->published()
            ->recycle(User::all())
            ->create();

        // Create basic pages (Privacy Policy, Terms of Service, etc.)
        $this->call(BasicPagesSeeder::class);

        // Create images
        $this->call(ImageSeeder::class);

        // Create settings
        $this->call(SettingSeeder::class);

        // Update settings with richtext type and add author_bio
        $this->call(UpdateSettingsTypeSeeder::class);

        // Add contact information settings
        $this->call(ContactSettingsSeeder::class);
    }
}
