<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // General settings
        $this->createSetting('site_name', 'My CMS', 'Site Name', 'text', 'general', 'The name of your website', true, 1);
        $this->createSetting('site_description', 'A powerful CMS built with Laravel', 'Site Description', 'textarea', 'general', 'A short description of your website', true, 2);
        $this->createSetting('site_logo', null, 'Site Logo', 'file', 'general', 'The logo of your website', true, 3);
        $this->createSetting('favicon', null, 'Favicon', 'file', 'general', 'The favicon of your website', true, 4);

        // SEO settings
        $this->createSetting('meta_title', 'My CMS | Home', 'Meta Title', 'text', 'seo', 'The default meta title for your website', true, 1);
        $this->createSetting('meta_description', 'A powerful CMS built with Laravel', 'Meta Description', 'textarea', 'seo', 'The default meta description for your website', true, 2);
        $this->createSetting('meta_keywords', 'cms, laravel, php', 'Meta Keywords', 'text', 'seo', 'The default meta keywords for your website', true, 3);
        $this->createSetting('google_analytics', null, 'Google Analytics ID', 'text', 'seo', 'Your Google Analytics tracking ID', true, 4);

        // Social settings
        $this->createSetting('facebook_url', null, 'Facebook URL', 'text', 'social', 'Your Facebook page URL', true, 1);
        $this->createSetting('twitter_url', null, 'Twitter URL', 'text', 'social', 'Your Twitter profile URL', true, 2);
        $this->createSetting('instagram_url', null, 'Instagram URL', 'text', 'social', 'Your Instagram profile URL', true, 3);
        $this->createSetting('linkedin_url', null, 'LinkedIn URL', 'text', 'social', 'Your LinkedIn profile URL', true, 4);
        $this->createSetting('youtube_url', null, 'YouTube URL', 'text', 'social', 'Your YouTube channel URL', true, 5);
        $this->createSetting('github_url', null, 'GitHub URL', 'text', 'social', 'Your GitHub profile URL', true, 6);
        $this->createSetting('website_url', null, 'Website URL', 'text', 'social', 'Your personal or company website URL', true, 7);

        // Email settings
        $this->createSetting('contact_email', 'contact@example.com', 'Contact Email', 'text', 'email', 'The email address where contact form submissions will be sent', false, 1);
        $this->createSetting('email_sender_name', 'My CMS', 'Email Sender Name', 'text', 'email', 'The name that will appear as the sender of emails', false, 2);
        $this->createSetting('email_footer', 'Copyright © ' . date('Y') . ' My CMS. All rights reserved.', 'Email Footer', 'textarea', 'email', 'The footer text that will appear in emails', false, 3);

        // Advanced settings
        $this->createSetting('maintenance_mode', '0', 'Maintenance Mode', 'boolean', 'advanced', 'Enable maintenance mode to show a maintenance page to visitors', false, 1);
        $this->createSetting('maintenance_message', 'We are currently performing scheduled maintenance. We will be back online shortly.', 'Maintenance Message', 'textarea', 'advanced', 'Message to display when the site is in maintenance mode', true, 2);
        $this->createSetting('cache_ttl', '3600', 'Cache TTL', 'number', 'advanced', 'Time to live for cache in seconds', false, 3);
        $this->createSetting('pagination_limit', '10', 'Pagination Limit', 'number', 'advanced', 'Number of items to show per page', false, 4);
        $this->createSetting('default_locale', 'en', 'Default Locale', 'select', 'advanced', 'The default language for your website', false, 5, json_encode(['en' => 'English', 'fr' => 'French', 'es' => 'Spanish', 'de' => 'German']));
    }

    /**
     * Create a setting.
     *
     * @param string $key
     * @param string|null $value
     * @param string $displayName
     * @param string $type
     * @param string $group
     * @param string|null $description
     * @param bool $isPublic
     * @param int $order
     * @param string|null $options
     * @return void
     */
    protected function createSetting(
        string $key,
        ?string $value,
        string $displayName,
        string $type = 'text',
        string $group = 'general',
        ?string $description = null,
        bool $isPublic = false,
        int $order = 0,
        ?string $options = null
    ): void {
        Setting::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'display_name' => $displayName,
                'type' => $type,
                'options' => $options,
                'group' => $group,
                'description' => $description,
                'is_public' => $isPublic,
                'order' => $order,
            ]
        );
    }
}
