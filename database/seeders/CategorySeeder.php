<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get categories from the predefined file
        $categories = require database_path('seeders/blog/categories.php');

        // Create categories from the predefined data
        foreach ($categories as $categoryData) {
            $category = Category::create([
                'name' => $categoryData['name'],
                'slug' => $categoryData['slug'],
                'description' => $categoryData['description'] ?? null,
                'is_main' => $categoryData['is_main'] ?? false,
                'image_cover' => $categoryData['image_cover'] ?? fake()->imageUrl(1200, 400),
            ]);

            // Add SEO data to each category
            $category->seo()->create([
                'title' => $categoryData['name'],
                'keywords' => strtolower($categoryData['name']) . ', ' . implode(', ', fake()->words(3)),
                'description' => $categoryData['description'] ?? fake()->paragraph(),
            ]);
        }

        // If we need more categories for testing, create some random ones
        if (config('app.env') === 'local' || config('app.env') === 'testing') {
            Category::factory(5)->create([
                'image_cover' => fake()->imageUrl(1200, 400),
            ])
            ->each(function (Category $category) {
                // Add SEO data to random categories
                $category->seo()->create([
                    'title' => 'Category: ' . $category->name,
                    'keywords' => strtolower($category->name) . ', ' . implode(', ', fake()->words(3)),
                    'description' => fake()->paragraph(),
                ]);
            });
        }
    }
}
