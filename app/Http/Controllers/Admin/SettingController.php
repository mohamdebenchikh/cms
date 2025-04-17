<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSettingRequest;
use App\Http\Requests\UpdateSettingRequest;
use App\Models\Setting;
use App\Services\SettingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * The setting service instance.
     *
     * @var \App\Services\SettingService
     */
    protected $settingService;

    /**
     * Create a new controller instance.
     *
     * @param \App\Services\SettingService $settingService
     * @return void
     */
    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    /**
     * Display a listing of the settings.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Setting::class);

        $group = $request->query('group', 'general');
        $groups = Setting::select('group')->distinct()->pluck('group');
        $settings = Setting::where('group', $group)
            ->orderBy('order')
            ->get();

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
            'groups' => $groups,
            'currentGroup' => $group,
        ]);
    }

    /**
     * Show the form for creating a new setting.
     */
    public function create(): Response
    {
        $this->authorize('create', Setting::class);

        $groups = Setting::select('group')->distinct()->pluck('group');

        return Inertia::render('admin/settings/create', [
            'groups' => $groups,
        ]);
    }

    /**
     * Store a newly created setting in storage.
     */
    public function store(StoreSettingRequest $request): RedirectResponse
    {
        $this->authorize('create', Setting::class);

        $data = $request->validated();

        // Format options if provided
        if (isset($data['options']) && is_array($data['options'])) {
            $data['options'] = json_encode($data['options']);
        }

        Setting::create($data);

        // Clear the settings cache
        $this->settingService->clearCache();

        return redirect()->route('admin.settings.index', ['group' => $data['group']])
            ->with('success', 'Setting created successfully.');
    }

    /**
     * Show the form for editing the specified setting.
     */
    public function edit(Setting $setting): Response
    {
        $this->authorize('update', $setting);

        $groups = Setting::select('group')->distinct()->pluck('group');

        return Inertia::render('admin/settings/edit', [
            'setting' => $setting,
            'groups' => $groups,
        ]);
    }

    /**
     * Update the specified setting in storage.
     */
    public function update(UpdateSettingRequest $request, Setting $setting): RedirectResponse
    {
        $this->authorize('update', $setting);

        $data = $request->validated();

        // Format options if provided
        if (isset($data['options']) && is_array($data['options'])) {
            $data['options'] = json_encode($data['options']);
        }

        $setting->update($data);

        // Clear the settings cache
        $this->settingService->clearCache();

        return redirect()->route('admin.settings.index', ['group' => $setting->group])
            ->with('success', 'Setting updated successfully.');
    }

    /**
     * Remove the specified setting from storage.
     */
    public function destroy(Setting $setting): RedirectResponse
    {
        $this->authorize('delete', $setting);

        $group = $setting->group;

        $setting->delete();

        // Clear the settings cache
        $this->settingService->clearCache();

        return redirect()->route('admin.settings.index', ['group' => $group])
            ->with('success', 'Setting deleted successfully.');
    }

    /**
     * Update multiple settings at once.
     */
    public function updateGroup(Request $request, string $group): RedirectResponse
    {
        $this->authorize('viewAny', Setting::class);

        $data = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable', 'string'],
        ]);

        foreach ($data['settings'] as $key => $value) {
            $setting = Setting::where('key', $key)->first();

            if ($setting) {
                $this->authorize('update', $setting);

                // Format value based on setting type
                if ($setting->type === 'boolean') {
                    $value = $value ? '1' : '0';
                }

                $setting->value = $value;
                $setting->save();
            }
        }

        // Clear the settings cache
        $this->settingService->clearCache();

        return redirect()->route('admin.settings.index', ['group' => $group])
            ->with('success', 'Settings updated successfully.');
    }

    /**
     * Update a group name.
     */
    public function updateGroupName(Request $request, string $group): RedirectResponse
    {
        $this->authorize('viewAny', Setting::class);

        $data = $request->validate([
            'new_group_name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9_\-\s]+$/',
                // Custom validation rule to check if the group name already exists
                function ($attribute, $value, $fail) use ($group) {
                    // Ignore the unused parameter warning
                    unset($attribute);

                    $exists = Setting::where('group', $value)
                        ->where('group', '!=', $group)
                        ->exists();

                    if ($exists) {
                        $fail('This group name already exists. Please choose a different name.');
                    }
                },
            ],
        ], [
            'new_group_name.required' => 'The group name is required.',
            'new_group_name.max' => 'The group name cannot exceed 255 characters.',
            'new_group_name.regex' => 'The group name can only contain letters, numbers, spaces, underscores, and hyphens.',
        ]);

        $newGroupName = $data['new_group_name'];

        // Update all settings in the group
        Setting::where('group', $group)->update([
            'group' => $newGroupName,
        ]);

        // Clear the settings cache
        $this->settingService->clearCache();

        return redirect()->route('admin.settings.index', ['group' => $newGroupName])
            ->with('success', 'Group name updated successfully.');
    }

    /**
     * Delete all settings in a group.
     */
    public function destroyGroup(string $group): RedirectResponse
    {
        $this->authorize('viewAny', Setting::class);

        // Delete all settings in the group
        Setting::where('group', $group)->delete();

        // Clear the settings cache
        $this->settingService->clearCache();

        return redirect()->route('admin.settings.index')
            ->with('success', 'Group deleted successfully.');
    }
}
