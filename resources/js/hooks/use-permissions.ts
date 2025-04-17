import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { SharedData, User } from '@/types';

/**
 * Hook to check user permissions
 * @returns Object with permission checking functions
 */
export function usePermissions() {
  const { auth } = usePage<SharedData>().props;
  const user = auth.user as User;

  // Memoize the permissions and roles to avoid recalculating on each render
  const { permissions, roles, isAdmin } = useMemo(() => {
    const userPermissions = user?.permissions?.map(p => p.name) || [];
    const userRoles = user?.roles?.map(r => r.name) || [];
    const hasAdminRole = userRoles.includes('admin');

    return {
      permissions: userPermissions,
      roles: userRoles,
      isAdmin: hasAdminRole
    };
  }, [user]);

  /**
   * Check if user has a specific permission
   * @param permission Permission name to check
   * @returns Boolean indicating if user has the permission
   */
  const hasPermission = (permission: string): boolean => {
    // Admin role has all permissions
    if (isAdmin) return true;
    
    return permissions.includes(permission);
  };

  /**
   * Check if user has any of the specified permissions
   * @param permissionsToCheck Array of permission names to check
   * @returns Boolean indicating if user has any of the permissions
   */
  const hasAnyPermission = (permissionsToCheck: string[]): boolean => {
    // Admin role has all permissions
    if (isAdmin) return true;
    
    return permissionsToCheck.some(permission => permissions.includes(permission));
  };

  /**
   * Check if user has all of the specified permissions
   * @param permissionsToCheck Array of permission names to check
   * @returns Boolean indicating if user has all of the permissions
   */
  const hasAllPermissions = (permissionsToCheck: string[]): boolean => {
    // Admin role has all permissions
    if (isAdmin) return true;
    
    return permissionsToCheck.every(permission => permissions.includes(permission));
  };

  /**
   * Check if user has a specific role
   * @param role Role name to check
   * @returns Boolean indicating if user has the role
   */
  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  /**
   * Check if user has any of the specified roles
   * @param rolesToCheck Array of role names to check
   * @returns Boolean indicating if user has any of the roles
   */
  const hasAnyRole = (rolesToCheck: string[]): boolean => {
    return rolesToCheck.some(role => roles.includes(role));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAdmin,
    permissions,
    roles
  };
}
