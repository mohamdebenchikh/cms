import { usePage } from '@inertiajs/react';

/**
 * Get a setting value from the shared data
 *
 * @param key The setting key
 * @param defaultValue Default value if setting is not found
 * @returns The setting value or default value
 */
export function getSetting(key: string, defaultValue: any = null): any {
  try {
    const { settings } = usePage().props as any;

    if (!settings) {
      return defaultValue;
    }

    return settings[key] !== undefined ? settings[key] : defaultValue;
  } catch (error) {
    console.error(`Error getting setting: ${key}`, error);
    return defaultValue;
  }
}

/**
 * Get all settings for a specific group
 *
 * @param group The settings group name
 * @returns An object with all settings for the group
 */
export function getSettingsByGroup(group: string): Record<string, any> {
  try {
    const { settingsByGroup } = usePage().props as any;

    if (!settingsByGroup || !settingsByGroup[group]) {
      return {};
    }

    return settingsByGroup[group];
  } catch (error) {
    console.error(`Error getting settings for group: ${group}`, error);
    return {};
  }
}

/**
 * Get social media links from settings
 *
 * @returns Object containing social media links
 */
export function getSocialLinks() {
  return {
    twitter: getSetting('twitter_url', ''),
    facebook: getSetting('facebook_url', ''),
    instagram: getSetting('instagram_url', ''),
    linkedin: getSetting('linkedin_url', ''),
    youtube: getSetting('youtube_url', ''),
    github: getSetting('github_url', ''),
    website: getSetting('website_url', ''),
    email: getSetting('contact_email', ''),
  };
}

/**
 * Get contact information from settings
 *
 * @returns Object containing contact information
 */
export function getContactInfo() {
  return {
    email: getSetting('contact_email', ''),
    phone: getSetting('contact_phone', ''),
    address: getSetting('contact_address', ''),
  };
}

/**
 * Get site information from settings
 *
 * @returns Object containing site information
 */
export function getSiteInfo() {
  return {
    name: getSetting('site_name', 'My Blog'),
    description: getSetting('site_description', ''),
    logo: getSetting('site_logo', ''),
    favicon: getSetting('site_favicon', ''),
  };
}
