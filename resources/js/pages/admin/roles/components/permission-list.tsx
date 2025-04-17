import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Permission } from '@/types';
import { getResourceIcon, getActionIcon } from '../utils.tsx';
import { ShieldQuestion } from 'lucide-react';

interface PermissionListProps {
  resource: string | null;
  permissions: Permission[];
  selectedPermissions: string[];
  onTogglePermission: (permissionName: string) => void;
  onToggleAllPermissions: (resource: string, permissions: Permission[]) => void;
  isAdminRole: boolean;
  permissionCounts: { total: number; selected: number };
}

export function PermissionList({
  resource,
  permissions,
  selectedPermissions,
  onTogglePermission,
  onToggleAllPermissions,
  isAdminRole,
  permissionCounts
}: PermissionListProps) {
  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <ShieldQuestion className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Select a resource from the sidebar to manage its permissions</p>
      </div>
    );
  }

  const allSelected = permissions.every(p => selectedPermissions.includes(p.name));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id={`select-all-${resource}`}
            checked={allSelected}
            onCheckedChange={() => onToggleAllPermissions(resource, permissions)}
            disabled={isAdminRole}
          />
          <Label
            htmlFor={`select-all-${resource}`}
            className="font-medium capitalize flex items-center gap-2"
          >
            {getResourceIcon(resource)}
            Select all {resource} permissions
          </Label>
        </div>
        <Badge variant="outline">
          {permissionCounts.selected}/{permissionCounts.total} selected
        </Badge>
      </div>

      <Separator />

      <div className="space-y-2">
        {permissions.map(permission => {
          // Extract action from permission name (e.g., "view users" -> "view")
          const parts = permission.name.split(' ');
          const action = parts[0];
          const isSelected = selectedPermissions.includes(permission.name);

          return (
            <div
              key={permission.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isSelected ? 'bg-primary/5 border-primary/20' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div>
                  <Label
                    htmlFor={`permission-${permission.id}`}
                    className="font-medium capitalize flex items-center gap-1 cursor-pointer"
                  >
                    {getActionIcon(action)}
                    {permission.name.replace(` ${resource}`, '')}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action === 'view' ? `Access to view ${resource}` :
                     action === 'create' ? `Ability to create new ${resource}` :
                     action === 'edit' || action === 'update' ? `Ability to modify existing ${resource}` :
                     action === 'delete' ? `Permission to remove ${resource}` :
                     `${action} ${resource}`}
                  </p>
                </div>
              </div>
              <Switch
                id={`permission-${permission.id}`}
                checked={isSelected}
                onCheckedChange={() => onTogglePermission(permission.name)}
                disabled={isAdminRole}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
