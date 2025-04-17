<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get tags from the predefined file
        $tags = require database_path('seeders/blog/tags.php');

        // Create tags from the predefined data
        foreach ($tags as $tagData) {
            Tag::create([
                'name' => $tagData['name'],
                'slug' => $tagData['slug'],
            ]);
        }

        // If we need more tags for testing, create some random ones
        if (config('app.env') === 'local' || config('app.env') === 'testing') {
            Tag::factory(10)->create();
        }
    }
}
