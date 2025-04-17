<?php

use App\Services\SettingService;

if (!function_exists('settings')) {
    /**
     * Get the setting service instance.
     *
     * @param string|null $key
     * @param mixed $default
     * @return mixed|\App\Services\SettingService
     */
    function settings(string $key = null, $default = null)
    {
        $settingService = app(SettingService::class);
        
        if (is_null($key)) {
            return $settingService;
        }
        
        return $settingService->get($key, $default);
    }
}
