<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingService
{
    /**
     * The cache key for all settings.
     *
     * @var string
     */
    protected $cacheKey = 'settings';
    
    /**
     * The cache TTL in seconds.
     *
     * @var int
     */
    protected $cacheTtl = 3600; // 1 hour
    
    /**
     * All settings.
     *
     * @var array
     */
    protected $settings = [];
    
    /**
     * Create a new setting service instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->loadSettings();
    }
    
    /**
     * Load all settings from the cache or database.
     *
     * @return void
     */
    protected function loadSettings(): void
    {
        $this->settings = Cache::remember($this->cacheKey, $this->cacheTtl, function () {
            return Setting::all()->keyBy('key')->toArray();
        });
    }
    
    /**
     * Get a setting value by key.
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        if (!isset($this->settings[$key])) {
            return $default;
        }
        
        $setting = $this->settings[$key];
        
        switch ($setting['type']) {
            case 'boolean':
                return (bool) $setting['value'];
            case 'number':
                return (float) $setting['value'];
            case 'array':
            case 'json':
                return json_decode($setting['value'], true);
            default:
                return $setting['value'] ?? $default;
        }
    }
    
    /**
     * Set a setting value by key.
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public function set(string $key, $value): void
    {
        $setting = Setting::where('key', $key)->first();
        
        if (!$setting) {
            return;
        }
        
        // Format the value based on the setting type
        if ($setting->type === 'boolean') {
            $value = $value ? '1' : '0';
        } elseif (in_array($setting->type, ['array', 'json']) && is_array($value)) {
            $value = json_encode($value);
        }
        
        $setting->value = $value;
        $setting->save();
        
        // Update the cached settings
        $this->settings[$key]['value'] = $value;
        Cache::put($this->cacheKey, $this->settings, $this->cacheTtl);
    }
    
    /**
     * Get all settings.
     *
     * @param bool $publicOnly
     * @return array
     */
    public function all(bool $publicOnly = false): array
    {
        if (!$publicOnly) {
            return $this->settings;
        }
        
        return array_filter($this->settings, function ($setting) {
            return $setting['is_public'];
        });
    }
    
    /**
     * Get settings by group.
     *
     * @param string $group
     * @param bool $publicOnly
     * @return array
     */
    public function group(string $group, bool $publicOnly = false): array
    {
        $settings = array_filter($this->settings, function ($setting) use ($group, $publicOnly) {
            if ($publicOnly && !$setting['is_public']) {
                return false;
            }
            
            return $setting['group'] === $group;
        });
        
        // Sort by order
        uasort($settings, function ($a, $b) {
            return $a['order'] <=> $b['order'];
        });
        
        return $settings;
    }
    
    /**
     * Clear the settings cache.
     *
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget($this->cacheKey);
        $this->loadSettings();
    }
}
