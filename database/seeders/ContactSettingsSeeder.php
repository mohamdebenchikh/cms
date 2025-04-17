<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class ContactSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Contact information settings
        $this->createSetting('contact_email', 'contact@example.com', 'Contact Email', 'text', 'contact', 'The primary contact email address for your website', true, 1);
        $this->createSetting('contact_phone', '+1 (555) 123-4567', 'Contact Phone', 'text', 'contact', 'The primary contact phone number for your website', true, 2);
        $this->createSetting('contact_address', '123 Main Street, City, State, 12345', 'Contact Address', 'textarea', 'contact', 'The physical address for your business or organization', true, 3);
        $this->createSetting('contact_hours', 'Monday - Friday: 9:00 AM - 5:00 PM', 'Business Hours', 'textarea', 'contact', 'Your business or operating hours', true, 4);
        
        // Social media links
        $this->createSetting('facebook_url', null, 'Facebook URL', 'text', 'contact', 'Your Facebook page URL', true, 5);
        $this->createSetting('twitter_url', null, 'Twitter URL', 'text', 'contact', 'Your Twitter profile URL', true, 6);
        $this->createSetting('instagram_url', null, 'Instagram URL', 'text', 'contact', 'Your Instagram profile URL', true, 7);
        $this->createSetting('linkedin_url', null, 'LinkedIn URL', 'text', 'contact', 'Your LinkedIn profile or company page URL', true, 8);
        $this->createSetting('youtube_url', null, 'YouTube URL', 'text', 'contact', 'Your YouTube channel URL', true, 9);
        
        // Contact form settings
        $this->createSetting('enable_contact_form', '1', 'Enable Contact Form', 'boolean', 'contact', 'Enable or disable the contact form on your website', true, 10);
        $this->createSetting('contact_form_recipients', null, 'Contact Form Recipients', 'text', 'contact', 'Email addresses that will receive contact form submissions (comma-separated)', false, 11);
        $this->createSetting('contact_success_message', 'Thank you for your message. We will get back to you soon!', 'Success Message', 'textarea', 'contact', 'Message displayed after a successful contact form submission', true, 12);
        
        // Google Maps
        $this->createSetting('google_maps_embed', null, 'Google Maps Embed Code', 'textarea', 'contact', 'The embed code for Google Maps to display your location', true, 13);
        $this->createSetting('google_maps_api_key', null, 'Google Maps API Key', 'text', 'contact', 'Your Google Maps API key for advanced map functionality', false, 14);
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
