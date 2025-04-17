<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class UpdateSettingsTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update site_description to use richtext
        $siteDescription = Setting::where('key', 'site_description')->first();
        if ($siteDescription) {
            $siteDescription->update([
                'type' => 'richtext',
            ]);
        }

        // Add author_bio setting if it doesn't exist
        Setting::updateOrCreate(
            ['key' => 'author_bio'],
            [
                'value' => '<p>I am a passionate writer and developer. I love sharing my knowledge and experiences with others.</p>',
                'display_name' => 'Author Bio',
                'type' => 'richtext',
                'group' => 'general',
                'description' => 'A short biography of the site author',
                'is_public' => true,
                'order' => 5,
            ]
        );
    }
}
