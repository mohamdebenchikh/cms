<?php

namespace App\Http\Middleware;

use App\Services\SettingService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
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
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Get public settings for admin area
        $publicSettings = [];
        if (!$request->routeIs('blog.*')) {
            // For admin routes, only include necessary settings
            $publicSettings = [
                'site_name' => $this->settingService->get('site_name', config('app.name')),
                'site_logo' => $this->settingService->get('site_logo'),
                'favicon' => $this->settingService->get('favicon'),
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? [
                    ...$request->user()->toArray(),
                    'roles' => $request->user()->roles->map->only(['id', 'name']),
                    'permissions' => $request->user()->getPermissionsViaRoles()->map->only(['id', 'name']),
                ] : null,
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => $request->cookie('sidebar_state') === 'true',
            'settings' => $publicSettings,
        ];
    }
}
