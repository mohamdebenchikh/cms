<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Seo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategoryBlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get categories data from the blog data file
        $categoriesData = require database_path('blog/categories.php');
        
        // Process main categories
        foreach ($categoriesData as $mainCategoryData) {
            // Create main category
            $mainCategory = Category::create([
                'name' => $mainCategoryData['name'],
                'slug' => $mainCategoryData['slug'],
                'description' => $mainCategoryData['description'],
                'is_main' => $mainCategoryData['is_main'] ?? false,
            ]);
            
            // Add SEO data to main category
            $mainCategory->seo()->create([
                'title' => 'Category: ' . $mainCategory->name,
                'keywords' => Str::slug($mainCategory->name, ', ') . ', tech blog, development',
                'description' => $mainCategoryData['description'] ?? 'Articles about ' . $mainCategory->name,
            ]);
            
            // Process subcategories if any
            if (isset($mainCategoryData['subcategories']) && is_array($mainCategoryData['subcategories'])) {
                foreach ($mainCategoryData['subcategories'] as $subCategoryData) {
                    // Create subcategory with parent_id set to main category
                    $subCategory = Category::create([
                        'name' => $subCategoryData['name'],
                        'slug' => $subCategoryData['slug'],
                        'description' => $subCategoryData['description'],
                        'parent_id' => $mainCategory->id,
                        'is_main' => false,
                    ]);
                    
                    // Add SEO data to subcategory
                    $subCategory->seo()->create([
                        'title' => 'Category: ' . $subCategory->name,
                        'keywords' => Str::slug($subCategory->name, ', ') . ', ' . Str::slug($mainCategory->name, ', ') . ', tech blog',
                        'description' => $subCategoryData['description'] ?? 'Articles about ' . $subCategory->name,
                    ]);
                }
            }
        }
        
        $this->command->info('Blog categories seeded successfully!');
    }
}
