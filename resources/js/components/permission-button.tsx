import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Can } from '@/components/can';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PermissionButtonProps extends ButtonProps {
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  matchAny?: boolean;
  tooltipText?: string;
  fallback?: React.ReactNode;
}

/**
 * A button that is only rendered if the user has the required permissions
 * 
 * @example
 * // Render a button if user has 'create posts' permission
 * <PermissionButton permission="create posts" onClick={handleCreate}>
 *   Create Post
 * </PermissionButton>
 * 
 * @example
 * // Render a button if user has any of the specified permissions
 * <PermissionButton 
 *   permissions={['edit posts', 'delete posts']} 
 *   matchAny 
 *   tooltipText="You need edit or delete permissions"
 * >
 *   Edit
 * </PermissionButton>
 */
export function PermissionButton({
  permission,
  permissions,
  role,
  roles,
  matchAny = false,
  tooltipText,
  fallback = null,
  children,
  ...props
}: PermissionButtonProps) {
  const button = (
    <Button {...props}>
      {children}
    </Button>
  );

  // If tooltip text is provided, wrap the button in a tooltip
  const content = tooltipText ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : button;

  return (
    <Can
      permission={permission}
      permissions={permissions}
      role={role}
      roles={roles}
      matchAny={matchAny}
      fallback={fallback}
    >
      {content}
    </Can>
  );
}
