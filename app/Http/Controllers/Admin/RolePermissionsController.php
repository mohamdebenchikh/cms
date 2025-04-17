<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
// use App\Models\Role; // Commented out to avoid conflict with Spatie's Role model
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionsController extends Controller
{
    /**
     * Display a listing of the roles.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Role::class);

        $query = Role::with('permissions')
            ->withCount('users');

        // Apply search filter
        if ($request->has('search') && $request->search !== '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Apply sorting
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate results
        $perPage = $request->input('per_page', 10);
        $roles = $query->paginate($perPage)->withQueryString();

        // Return Inertia view
        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'filters' => [
                'search' => $request->search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        $this->authorize('create', Role::class);

        $permissions = Permission::orderBy('name')->get();

        // Return Inertia view
        return Inertia::render('admin/roles/create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $this->authorize('create', Role::class);

        $data = $request->validated();

        $role = Role::create(['name' => $data['name']]);

        // Assign permissions if provided
        if (isset($data['permissions']) && is_array($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified role.
     */
    public function show(Role $role): Response
    {
        $this->authorize('view', $role);

        return Inertia::render('admin/roles/show', [
            'role' => $role->load(['permissions', 'users']),
        ]);
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role): Response
    {
        $this->authorize('update', $role);

        $permissions = Permission::orderBy('name')->get();

        return Inertia::render('admin/roles/edit', [
            'role' => $role->load('permissions'),
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $this->authorize('update', $role);

        $data = $request->validated();

        // The policy will handle admin role protection

        $role->update(['name' => $data['name']]);

        // Sync permissions if provided
        if (isset($data['permissions']) && is_array($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        $this->authorize('delete', $role);

        // The policy will handle admin role protection and user association checks

        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }

    /**
     * Bulk delete roles.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        // For bulk operations, we need to check if the user can delete roles in general
        $this->authorize('viewAny', Role::class);
        $this->authorize('delete', Role::class);

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:roles,id',
        ]);

        $roleIds = $request->ids;

        // Get the roles to delete
        $rolesToDelete = Role::whereIn('id', $roleIds)->get();

        // Filter out roles that the user is not authorized to delete
        $rolesToDelete = $rolesToDelete->filter(function ($role) use ($request) {
            return $request->user()->can('delete', $role);
        });

        $deletedCount = 0;

        DB::transaction(function () use ($rolesToDelete, &$deletedCount) {
            foreach ($rolesToDelete as $role) {
                $role->delete();
                $deletedCount++;
            }
        });

        $notDeletedCount = count($roleIds) - $deletedCount;

        if ($notDeletedCount > 0) {
            return redirect()->route('admin.roles.index')
                ->with('success', $deletedCount . ' ' . ($deletedCount === 1 ? 'role' : 'roles') . ' deleted successfully.')
                ->with('error', $notDeletedCount . ' ' . ($notDeletedCount === 1 ? 'role' : 'roles') . ' could not be deleted due to policy restrictions.');
        } else {
            return redirect()->route('admin.roles.index')
                ->with('success', $deletedCount . ' ' . ($deletedCount === 1 ? 'role' : 'roles') . ' deleted successfully.');
        }
    }

    /**
     * Display a listing of all permissions.
     */
    public function permissions(): Response
    {
        $this->authorize('viewPermissions', Role::class);

        $permissions = Permission::orderBy('name')->get()->groupBy(function ($permission) {
            // Group permissions by their prefix (e.g., 'view users', 'create users' -> 'users')
            $parts = explode(' ', $permission->name);
            return end($parts);
        });

        return Inertia::render('admin/roles/permissions', [
            'permissions' => $permissions,
        ]);
    }
}
