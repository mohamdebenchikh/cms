<?php

namespace App\Http\Middleware;

use App\Services\SettingService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class HandleBlogSettings
{
    /**
     * The settings service instance.
     *
     * @var \App\Services\SettingService
     */
    protected $settingService;

    /**
     * Create a new middleware instance.
     *
     * @param \App\Services\SettingService $settingService
     * @return void
     */
    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): mixed
    {
        // Check if the site is in maintenance mode
        if ($this->settingService->get('maintenance_mode', false) && !$request->user()?->hasRole('admin')) {
            // Get maintenance message
            $maintenanceMessage = $this->settingService->get('maintenance_message', 'The site is currently under maintenance. Please check back later.');
            
            // Return maintenance page
            return Inertia::render('blog/maintenance', [
                'message' => $maintenanceMessage,
                'siteName' => $this->settingService->get('site_name', config('app.name')),
                'siteDescription' => $this->settingService->get('site_description', ''),
                'siteLogo' => $this->settingService->get('site_logo'),
                'favicon' => $this->settingService->get('favicon'),
            ])->toResponse($request);
        }

        // Get all public settings
        $publicSettings = $this->settingService->all(true);
        
        // Format settings for frontend
        $formattedSettings = [];
        foreach ($publicSettings as $key => $setting) {
            $formattedSettings[$key] = $setting['value'];
            
            // Format specific setting types
            if ($setting['type'] === 'boolean') {
                $formattedSettings[$key] = (bool) $setting['value'];
            } elseif ($setting['type'] === 'number') {
                $formattedSettings[$key] = (float) $setting['value'];
            } elseif (in_array($setting['type'], ['array', 'json']) && $setting['value']) {
                $formattedSettings[$key] = json_decode($setting['value'], true);
            }
        }
        
        // Share settings with Inertia
        Inertia::share('settings', $formattedSettings);
        
        // Set app name from settings
        if (isset($formattedSettings['site_name'])) {
            config(['app.name' => $formattedSettings['site_name']]);
        }
        
        // Set locale from settings if available
        if (isset($formattedSettings['default_locale'])) {
            App::setLocale($formattedSettings['default_locale']);
        }
        
        return $next($request);
    }
}
