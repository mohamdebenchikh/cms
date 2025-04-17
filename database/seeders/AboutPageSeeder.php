<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class AboutPageSeeder extends Seeder
{
    public function run()
    {
        Page::create([
            'title' => 'About Us',
            'slug' => 'about',
            'content' => '<p>Welcome to our blog! We are a team of passionate writers and developers dedicated to sharing knowledge and insights about technology.</p><p>Our mission is to provide high-quality content that helps developers and tech enthusiasts stay up-to-date with the latest trends and best practices in the industry.</p><p>Whether you\'re a seasoned developer or just starting your journey in tech, we\'ve got something for you.</p>',
            'status' => 'published',
            'user_id' => 1, // Make sure this user exists
        ]);
    }
}
