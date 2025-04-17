<?php

namespace App\Policies;

use App\Models\Page;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PagePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view pages');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Page $page): bool
    {
        // Users can view published pages or their own pages
        return $user->hasPermissionTo('view pages') &&
               ($page->status === 'published' || $page->user_id === $user->id || $user->hasPermissionTo('edit all pages'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create pages');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Page $page): bool
    {
        // Users can update their own pages or all pages if they have permission
        return $user->hasPermissionTo('edit pages') &&
               ($page->user_id === $user->id || $user->hasPermissionTo('edit all pages'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Page $page): bool
    {
        // Users can delete their own pages or all pages if they have permission
        return $user->hasPermissionTo('delete pages') &&
               ($page->user_id === $user->id || $user->hasPermissionTo('delete all pages'));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Page $page): bool
    {
        // Users can restore their own pages or all pages if they have permission
        return $user->hasPermissionTo('edit pages') &&
               ($page->user_id === $user->id || $user->hasPermissionTo('edit all pages'));
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Page $page): bool
    {
        // Only users with delete all pages permission can force delete pages
        return $user->hasPermissionTo('delete all pages');
    }
}
