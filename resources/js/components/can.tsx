import React from 'react';
import { usePermissions } from '@/hooks/use-permissions';

interface CanProps {
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  matchAny?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component to conditionally render content based on user permissions
 * 
 * @example
 * // Render content if user has 'create posts' permission
 * <Can permission="create posts">
 *   <Button>Create Post</Button>
 * </Can>
 * 
 * @example
 * // Render content if user has any of the specified permissions
 * <Can permissions={['edit posts', 'delete posts']} matchAny>
 *   <Button>Edit</Button>
 * </Can>
 * 
 * @example
 * // Render content if user has 'admin' role
 * <Can role="admin">
 *   <AdminPanel />
 * </Can>
 * 
 * @example
 * // Render fallback content if user doesn't have permission
 * <Can permission="delete users" fallback={<p>You don't have permission</p>}>
 *   <DeleteButton />
 * </Can>
 */
export function Can({
  permission,
  permissions,
  role,
  roles,
  matchAny = false,
  children,
  fallback = null
}: CanProps) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAdmin
  } = usePermissions();

  // Admin always has access
  if (isAdmin) {
    return <>{children}</>;
  }

  // Check permissions
  if (permission) {
    return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
  }

  if (permissions) {
    return (matchAny ? hasAnyPermission(permissions) : hasAllPermissions(permissions))
      ? <>{children}</>
      : <>{fallback}</>;
  }

  // Check roles
  if (role) {
    return hasRole(role) ? <>{children}</> : <>{fallback}</>;
  }

  if (roles) {
    return hasAnyRole(roles) ? <>{children}</> : <>{fallback}</>;
  }

  // If no permission or role is specified, don't render anything
  console.warn('Can component used without specifying permission or role');
  return null;
}
