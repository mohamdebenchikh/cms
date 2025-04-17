<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
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
        return $user->hasPermissionTo('view posts');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Post $post): bool
    {
        // Users can view published posts or their own posts
        return $user->hasPermissionTo('view posts') &&
               ($post->status === 'published' || $post->user_id === $user->id || $user->hasPermissionTo('edit all posts'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create posts');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Post $post): bool
    {
        // Users can update their own posts or all posts if they have permission
        return $user->hasPermissionTo('edit posts') &&
               ($post->user_id === $user->id || $user->hasPermissionTo('edit all posts'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Post $post): bool
    {
        // Users can delete their own posts or all posts if they have permission
        return $user->hasPermissionTo('delete posts') &&
               ($post->user_id === $user->id || $user->hasPermissionTo('delete all posts'));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Post $post): bool
    {
        // Users can restore their own posts or all posts if they have permission
        return $user->hasPermissionTo('edit posts') &&
               ($post->user_id === $user->id || $user->hasPermissionTo('edit all posts'));
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        // Only users with delete all posts permission can force delete posts
        return $user->hasPermissionTo('delete all posts');
    }
}
