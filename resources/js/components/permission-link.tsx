import React from 'react';
import { Link } from '@inertiajs/react';
import { Can } from '@/components/can';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PermissionLinkProps {
  href: string;
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  matchAny?: boolean;
  tooltipText?: string;
  fallback?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

/**
 * A link that is only rendered if the user has the required permissions
 * 
 * @example
 * // Render a link if user has 'view posts' permission
 * <PermissionLink href="/posts" permission="view posts">
 *   View Posts
 * </PermissionLink>
 * 
 * @example
 * // Render a link if user has any of the specified permissions
 * <PermissionLink 
 *   href="/admin/settings" 
 *   permissions={['edit settings', 'view settings']} 
 *   matchAny 
 *   tooltipText="Settings"
 * >
 *   Settings
 * </PermissionLink>
 */
export function PermissionLink({
  href,
  permission,
  permissions,
  role,
  roles,
  matchAny = false,
  tooltipText,
  fallback = null,
  className,
  children,
  ...props
}: PermissionLinkProps) {
  const link = (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );

  // If tooltip text is provided, wrap the link in a tooltip
  const content = tooltipText ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {link}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : link;

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
