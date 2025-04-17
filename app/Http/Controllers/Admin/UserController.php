<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        // Create a query with eager loading of roles
        $query = User::with('roles');

        $dataTable = new DataTableService($query, $request);

        // Configure the DataTable service
        $dataTable->setDefaultSortField('created_at')
            ->setDefaultSortDirection('asc')
            ->setDefaultPerPage(10)
            ->setSearchableFields(['name', 'email', 'roles.name']);

        // Handle sorting by role name
        if ($request->input('sort_field') === 'roles') {
            $dataTable->applySort('roles.name', $request->input('sort_direction', 'asc'));
        }

        // Handle multiple role filtering
        if ($request->has('role_ids') && $request->input('role_ids')) {
            $roleIds = $request->input('role_ids');
            if (is_array($roleIds)) {
                if (in_array('no_role', $roleIds)) {
                    // If 'no_role' is selected, we need to handle it separately
                    $hasOtherRoles = array_filter($roleIds, fn($id) => $id !== 'no_role');

                    if (count($hasOtherRoles) > 0) {
                        // If other roles are also selected, we use a union
                        $query->where(function($q) use ($hasOtherRoles) {
                            $q->whereDoesntHave('roles')
                              ->orWhereHas('roles', function($q) use ($hasOtherRoles) {
                                  $q->whereIn('id', $hasOtherRoles);
                              });
                        });
                    } else {
                        // If only 'no_role' is selected
                        $query->whereDoesntHave('roles');
                    }
                } else {
                    // Normal role filtering
                    $query->whereHas('roles', function($q) use ($roleIds) {
                        $q->whereIn('id', $roleIds);
                    });
                }
            }
        }

        // Process the query and get results
        $result = $dataTable->process();

        // Get all roles for the filter dropdown
        $roles = Role::orderBy('name')->get();

        // Add role_ids to filters if present
        $filters = $result['filters'];
        if ($request->has('role_ids')) {
            $filters['role_ids'] = $request->input('role_ids');
        }

        return Inertia::render('admin/users/index', [
            'users' => $result['data'],
            'filters' => $filters,
            'roles' => $roles
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        $this->authorize('create', User::class);

        $roles = Role::all();

        return Inertia::render('admin/users/create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        // Assign roles if provided
        if (isset($data['roles']) && is_array($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        return Inertia::render('admin/users/show', [
            'user' => $user->load(['roles', 'posts', 'pages', 'images']),
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        $roles = Role::all();

        return Inertia::render('admin/users/edit', [
            'user' => $user->load('roles'),
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $data = $request->validated();

        // Only update password if provided
        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        // Sync roles if provided
        if (isset($data['roles']) && is_array($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Update the roles for the specified user.
     */
    public function updateRoles(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        // Sync the roles
        $user->syncRoles($validated['roles']);

        return redirect()->back()
            ->with('success', 'User roles updated successfully.');
    }

    /**
     * Bulk delete multiple users.
     */
    public function bulkDestroy(Request $request)
    {
        $this->authorize('delete', User::class);

        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id',
        ]);

        $ids = $validated['ids'];
        $currentUserId = auth()->id();

        // Filter out the current user's ID to prevent self-deletion
        $filteredIds = array_filter($ids, function($id) use ($currentUserId) {
            return (int)$id !== (int)$currentUserId;
        });

        // Count how many users were actually deleted
        $count = count($filteredIds);

        if ($count > 0) {
            // Delete the users
            User::whereIn('id', $filteredIds)->delete();

            $message = $count === 1
                ? '1 user was deleted successfully.'
                : "$count users were deleted successfully.";

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $message
                ]);
            }

            return redirect()->route('admin.users.index')
                ->with('success', $message);
        }

        $message = 'No users were deleted. You cannot delete your own account.';

        if ($request->wantsJson()) {
            return response()->json([
                'success' => false,
                'message' => $message
            ]);
        }

        return redirect()->route('admin.users.index')
            ->with('error', $message);
    }
}

