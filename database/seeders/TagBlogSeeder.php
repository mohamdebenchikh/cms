<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagBlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get tags data from the blog data file
        $tagsData = require database_path('blog/tags.php');
        
        // Process tags
        foreach ($tagsData as $tagData) {
            Tag::create([
                'name' => $tagData['name'],
                'slug' => $tagData['slug'],
            ]);
        }
        
        $this->command->info('Blog tags seeded successfully!');
    }
}
