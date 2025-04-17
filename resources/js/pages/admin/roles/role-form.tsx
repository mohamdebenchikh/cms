import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Permission } from '@/types';
import { RoleFormProps } from './types';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck } from 'lucide-react';

// Import components
import { ResourceSidebar } from './components/resource-sidebar';
import { PermissionList } from './components/permission-list';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function RoleForm({ role, permissions, mode, onSubmit }: RoleFormProps) {
  const isEditMode = mode === 'edit';

  const [activeResource, setActiveResource] = useState<string | null>(null);
  const [resourceFilter, setResourceFilter] = useState('');

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((groups, permission) => {
    // Extract resource from permission name (e.g., "view users" -> "users")
    const parts = permission.name.split(' ');
    const resource = parts[parts.length - 1];

    if (!groups[resource]) {
      groups[resource] = [];
    }

    groups[resource].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  // Sort resources alphabetically
  const sortedResources = Object.keys(groupedPermissions).sort();

  // Set initial active resource if not set
  React.useEffect(() => {
    if (sortedResources.length > 0 && !activeResource) {
      setActiveResource(sortedResources[0]);
    }
  }, [sortedResources, activeResource]);

  const { data, setData, errors, processing } = useForm({
    name: role?.name || '',
    permissions: role?.permissions?.map(p => p.name) || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  const handlePermissionToggle = (permissionName: string) => {
    setData('permissions',
      data.permissions.includes(permissionName)
        ? data.permissions.filter(p => p !== permissionName)
        : [...data.permissions, permissionName]
    );
  };

  const handleResourceToggle = (_resource: string, resourcePermissions: Permission[]) => {
    const permissionNames = resourcePermissions.map(p => p.name);
    const allSelected = permissionNames.every(p => data.permissions.includes(p));

    if (allSelected) {
      // Remove all permissions for this resource
      setData('permissions', data.permissions.filter(p => !permissionNames.includes(p)));
    } else {
      // Add all permissions for this resource that aren't already selected
      const newPermissions = [...data.permissions];
      permissionNames.forEach(p => {
        if (!newPermissions.includes(p)) {
          newPermissions.push(p);
        }
      });
      setData('permissions', newPermissions);
    }
  };

  const isAdminRole = role?.name === 'admin';

  // Count permissions by resource
  const permissionCounts = Object.entries(groupedPermissions).reduce(
    (acc, [resource, perms]) => {
      acc[resource] = {
        total: perms.length,
        selected: perms.filter(p => data.permissions.includes(p.name)).length
      };
      return acc;
    },
    {} as Record<string, { total: number; selected: number }>
  );

  // Handle name change
  const handleNameChange = (name: string) => {
    setData('name', name);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Display form errors if any */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please correct the errors in the form before submitting.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        {/* Admin role alert */}
        {isAdminRole && (
          <div className="px-6 pt-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The admin role has all permissions by default and cannot be modified.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Role summary for edit mode */}
        {isEditMode && role && (
          <div className="px-6 pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{role.name}</h3>
                <p className="text-sm text-muted-foreground">{role.guard_name}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {Object.entries(permissionCounts).map(([resource, counts]) => (
                    <Badge key={resource} variant="outline" className="text-xs">
                      {counts.selected}/{counts.total} {resource}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            {isEditMode ? `Edit Role: ${role?.name}` : 'Create Role'}
          </CardTitle>
          <CardDescription>
            {isEditMode ? 'Update role details and permissions' : 'Create a new role with specific permissions'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Role name section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">Role Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={e => handleNameChange(e.target.value)}
                disabled={processing || isAdminRole}
                placeholder="Enter role name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Role type indicator */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Role Type</Label>
              <div className="text-sm">
                {isAdminRole ? (
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-red-500" />
                    Admin role with full system access
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    Custom role with specific permissions
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-border" /> {/* Divider */}

          {/* Permissions section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Permissions
              </h3>
              <p className="text-sm text-muted-foreground">
                Select the permissions to assign to this role
              </p>
            </div>

            {errors.permissions && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.permissions}
              </p>
            )}

            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar for resource selection */}
              <ResourceSidebar
                resources={sortedResources}
                activeResource={activeResource}
                setActiveResource={setActiveResource}
                permissionCounts={permissionCounts}
                resourceFilter={resourceFilter}
                setResourceFilter={setResourceFilter}
              />

              {/* Main content area */}
              <div className="flex-1">
                {activeResource && groupedPermissions[activeResource] && (
                  <PermissionList
                    resource={activeResource}
                    permissions={groupedPermissions[activeResource]}
                    selectedPermissions={data.permissions}
                    onTogglePermission={handlePermissionToggle}
                    onToggleAllPermissions={handleResourceToggle}
                    isAdminRole={isAdminRole}
                    permissionCounts={permissionCounts[activeResource]}
                  />
                )}
                {!activeResource && (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <ShieldAlert className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Select a resource from the sidebar to manage its permissions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            {isEditMode ?
              'Update the role information and permissions' :
              'Create a new role with the specified permissions'}
          </p>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={processing || isAdminRole}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {processing ? 'Saving...' : mode === 'create' ? 'Create Role' : 'Update Role'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
