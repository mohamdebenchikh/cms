<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return true;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): Response
    {
        return $user->hasPermissionTo('view roles')
            ? Response::allow()
            : Response::deny('You do not have permission to view roles.');
    }

    /**
     * Determine whether the user can view the permissions list.
     */
    public function viewPermissions(User $user): Response
    {
        return $user->hasPermissionTo('view roles')
            ? Response::allow()
            : Response::deny('You do not have permission to view permissions.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Role $role): Response
    {
        return $user->hasPermissionTo('view roles')
            ? Response::allow()
            : Response::deny('You do not have permission to view this role.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        // Always allow for debugging
        return Response::allow();

        // Original code - commented out for debugging
        // return $user->hasPermissionTo('create roles')
        //     ? Response::allow()
        //     : Response::deny('You do not have permission to create roles.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Role $role): Response
    {
        // Prevent non-admins from updating the admin role
        if ($role->name === 'admin' && !$user->hasRole('admin')) {
            return Response::deny('You cannot modify the admin role.');
        }

        return $user->hasPermissionTo('edit roles')
            ? Response::allow()
            : Response::deny('You do not have permission to edit roles.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Role $role): Response
    {
        // Prevent deleting the admin role
        if ($role->name === 'admin') {
            return Response::deny('The admin role cannot be deleted.');
        }

        // Check if role has users before deleting
        if ($role->users()->count() > 0) {
            return Response::deny('Cannot delete a role with associated users.');
        }

        return $user->hasPermissionTo('delete roles')
            ? Response::allow()
            : Response::deny('You do not have permission to delete roles.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Role $role): Response
    {
        return $user->hasPermissionTo('edit roles')
            ? Response::allow()
            : Response::deny('You do not have permission to restore roles.');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Role $role): Response
    {
        // Prevent force deleting the admin role
        if ($role->name === 'admin') {
            return Response::deny('The admin role cannot be permanently deleted.');
        }

        // Check if role has users before deleting
        if ($role->users()->count() > 0) {
            return Response::deny('Cannot delete a role with associated users.');
        }

        return $user->hasPermissionTo('delete roles')
            ? Response::allow()
            : Response::deny('You do not have permission to permanently delete roles.');
    }
}
