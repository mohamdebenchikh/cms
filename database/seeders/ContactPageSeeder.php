<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class ContactPageSeeder extends Seeder
{
    public function run()
    {
        Page::create([
            'title' => 'Contact Us',
            'slug' => 'contact',
            'content' => '<p>We\'d love to hear from you! Fill out the form below to get in touch with our team.</p>',
            'status' => 'published',
            'user_id' => 1, // Make sure this user exists
        ]);
    }
}
