<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\Seo;
use App\Models\Tag;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get predefined posts from the blog/posts.php file
        $predefinedPosts = require database_path('seeders/blog/posts.php');

        // Get users, categories, and tags
        $users = User::all();
        $categories = Category::all();
        $tags = Tag::all();

        // Default user (admin) if no users found
        $defaultUser = $users->first() ?? User::factory()->create(['name' => 'Admin', 'email' => 'admin@example.com']);

        // Create posts from predefined data
        foreach ($predefinedPosts as $postData) {
            // Find the category by slug or use a random one
            $category = Category::where('slug', $postData['category'])->first() ?? $categories->random();

            // Create the post
            $post = Post::create([
                'title' => $postData['title'],
                'slug' => $postData['slug'],
                'excerpt' => $postData['excerpt'],
                'content' => $postData['content'],
                'status' => 'published',
                'user_id' => $defaultUser->id,
                'category_id' => $category->id,
                'published_at' => Carbon::now()->subDays(rand(1, 30)),
                'is_featured' => rand(0, 10) > 8, // 20% chance of being featured
                'featured_image' => isset($postData['featured_image'])
                    ? $postData['featured_image']
                    : 'https://source.unsplash.com/random/1200x800/?'.Str::slug($category->name),
            ]);

            // Attach random tags (2-4) to each post
            $post->tags()->attach(
                $tags->random(rand(2, 4))->pluck('id')->toArray()
            );

            // Add SEO data
            $post->seo()->create([
                'title' => isset($postData['seo_title']) ? $postData['seo_title'] : $postData['title'],
                'keywords' => isset($postData['seo_keywords'])
                    ? $postData['seo_keywords']
                    : $category->name . ', ' . implode(', ', explode(' ', $postData['title'])),
                'description' => isset($postData['seo_description']) ? $postData['seo_description'] : $postData['excerpt'],
            ]);
        }

        // Create additional random posts if in development environment
        if (app()->environment('local', 'development')) {
            // Create regular posts
            Post::factory(10)
                ->recycle($users)
                ->recycle($categories)
                ->create()
                ->each(function (Post $post) use ($tags) {
                    // Attach random tags to each post
                    $post->tags()->attach(
                        $tags->random(rand(1, 3))->pluck('id')->toArray()
                    );

                    // Add SEO data
                    $post->seo()->create([
                        'title' => 'SEO Title for: ' . $post->title,
                        'keywords' => implode(', ', fake()->words(5)),
                        'description' => fake()->paragraph(),
                    ]);
                });

            // Create draft posts
            Post::factory(5)
                ->draft()
                ->recycle($users)
                ->recycle($categories)
                ->create()
                ->each(function (Post $post) use ($tags) {
                    // Attach random tags to each post
                    $post->tags()->attach(
                        $tags->random(rand(1, 3))->pluck('id')->toArray()
                    );
                });
        }

        // Ensure we have at least 5 featured posts for the carousel
        $featuredCount = Post::where('is_featured', true)->count();
        if ($featuredCount < 5) {
            // Get non-featured published posts
            $nonFeaturedPosts = Post::where('is_featured', false)
                ->where('status', 'published')
                ->take(5 - $featuredCount)
                ->get();

            // Mark them as featured
            foreach ($nonFeaturedPosts as $post) {
                $post->update(['is_featured' => true]);
            }
        }
    }
}
