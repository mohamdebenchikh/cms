<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Seo;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BasicPagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get basic pages data
        $basicPages = require database_path('seeders/blog/basic-pages.php');
        
        // Get admin user (or first user if no admin)
        $admin = User::whereHas('roles', function ($query) {
            $query->where('name', 'admin');
        })->first() ?? User::first();
        
        if (!$admin) {
            $this->command->error('No users found. Please run the UserSeeder first.');
            return;
        }
        
        foreach ($basicPages as $pageData) {
            // Check if page with this slug already exists
            $existingPage = Page::where('slug', $pageData['slug'])->first();
            
            if ($existingPage) {
                $this->command->info("Page with slug '{$pageData['slug']}' already exists. Skipping.");
                continue;
            }
            
            // Create the page
            $page = Page::create([
                'title' => $pageData['title'],
                'slug' => $pageData['slug'],
                'content' => $pageData['content'],
                'status' => $pageData['status'],
                'user_id' => $admin->id,
                'published_at' => Carbon::now(),
            ]);
            
            // Create SEO data if provided
            if (isset($pageData['seo'])) {
                $page->seo()->create([
                    'title' => $pageData['seo']['title'],
                    'keywords' => $pageData['seo']['keywords'],
                    'description' => $pageData['seo']['description'],
                ]);
            }
            
            $this->command->info("Created page: {$pageData['title']}");
        }
    }
}
