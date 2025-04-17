<?php

namespace App\Providers;

use App\Policies\RolePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Role;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Role::class => RolePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Register policies
        $this->registerPolicies();

        // Define a custom policy discovery callback
        Gate::guessPolicyNamesUsing(function (string $modelClass) {
            // For Spatie Role model, use our RolePolicy
            if ($modelClass === Role::class || $modelClass === 'Spatie\\Permission\\Models\\Role') {
                return RolePolicy::class;
            }

            // For other models, follow the standard convention
            return 'App\\Policies\\' . class_basename($modelClass) . 'Policy';
        });

        // Temporary debug gate to allow all role operations
        Gate::before(function ($user, $ability, $arguments) {
            if (str_starts_with($ability, 'create') && isset($arguments[0]) && $arguments[0] === Role::class) {
                return true;
            }
            return null;
        });
    }
}
