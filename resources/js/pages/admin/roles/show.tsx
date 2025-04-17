import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ShowProps } from './types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { CalendarDays, Pencil, Users, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { dashboardBreadcrumb, rolesBreadcrumb, showBreadcrumb } from './types';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';

export default function Show({ role }: ShowProps) {
  const breadcrumbs = [
    dashboardBreadcrumb, 
    rolesBreadcrumb, 
    { ...showBreadcrumb, title: role.name }
  ];

  // Group permissions by resource
  const groupedPermissions = (role.permissions || []).reduce((groups, permission) => {
    // Extract resource from permission name (e.g., "view users" -> "users")
    const parts = permission.name.split(' ');
    const resource = parts[parts.length - 1];
    
    if (!groups[resource]) {
      groups[resource] = [];
    }
    
    groups[resource].push(permission);
    return groups;
  }, {} as Record<string, typeof role.permissions>);

  // Sort resources alphabetically
  const sortedResources = Object.keys(groupedPermissions).sort();

  const isAdminRole = role.name.toLowerCase() === 'admin';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Role: ${role.name}`} />
      
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <Heading
            title={`Role: ${role.name}`}
            description="View role details and permissions"
          />
          
          {!isAdminRole && (
            <Button asChild>
              <Link href={route('admin.roles.edit', role.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Role
              </Link>
            </Button>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Role Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                  <dd className="text-lg font-semibold">{role.name}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Guard</dt>
                  <dd>{role.guard_name}</dd>
                </div>
                
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Created {formatDistanceToNow(new Date(role.created_at), { addSuffix: true })}
                  </span>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users with this Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              {role.users && role.users.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {role.users.length} {role.users.length === 1 ? 'user has' : 'users have'} this role
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {role.users.slice(0, 10).map(user => (
                      <Badge key={user.id} variant="outline">
                        {user.name}
                      </Badge>
                    ))}
                    {role.users.length > 10 && (
                      <Badge variant="outline">+{role.users.length - 10} more</Badge>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No users have this role</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Permissions
            </CardTitle>
            <CardDescription>
              {isAdminRole 
                ? 'The admin role has all permissions by default' 
                : `This role has ${role.permissions?.length || 0} permissions`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAdminRole ? (
              <p className="text-sm text-muted-foreground">
                The admin role has unrestricted access to all features and functionality.
              </p>
            ) : role.permissions && role.permissions.length > 0 ? (
              <div className="space-y-6">
                {sortedResources.map(resource => (
                  <div key={resource} className="space-y-2">
                    <h3 className="text-md font-medium capitalize">{resource}</h3>
                    <Separator />
                    <div className="flex flex-wrap gap-2 pt-2">
                      {groupedPermissions[resource]?.map(permission => (
                        <Badge key={permission.id} variant="secondary">
                          {permission.name.replace(` ${resource}`, '')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">This role has no permissions</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href={route('admin.roles.index')}>
                Back to Roles
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
