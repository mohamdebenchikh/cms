// React is automatically imported in the build process
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PermissionsProps, dashboardBreadcrumb, permissionsBreadcrumb } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  ArrowLeft,
  Eye,
  Plus,
  Edit,
  Trash,
  Shield,
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const breadcrumbs = [dashboardBreadcrumb, permissionsBreadcrumb];

// Define the badge variant type
type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

// Helper function to get permission action icon and variant
const getPermissionActionInfo = (action: string) => {
  switch (action) {
    case 'view':
      return {
        icon: <Eye className="h-4 w-4" />,
        variant: 'default' as BadgeVariant,
        label: 'View'
      };
    case 'create':
      return {
        icon: <Plus className="h-4 w-4" />,
        variant: 'secondary' as BadgeVariant,
        label: 'Create'
      };
    case 'edit':
    case 'update':
      return {
        icon: <Edit className="h-4 w-4" />,
        variant: 'outline' as BadgeVariant,
        label: 'Edit'
      };
    case 'delete':
      return {
        icon: <Trash className="h-4 w-4" />,
        variant: 'destructive' as BadgeVariant,
        label: 'Delete'
      };
    default:
      return {
        icon: <Shield className="h-4 w-4" />,
        variant: 'outline' as BadgeVariant,
        label: action.charAt(0).toUpperCase() + action.slice(1)
      };
  }
};

export default function Permissions({ permissions }: PermissionsProps) {
  // Sort resources alphabetically
  const sortedResources = Object.keys(permissions).sort();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  // Filter resources based on search term
  const filteredResources = sortedResources.filter(resource =>
    resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permissions[resource].some(permission =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Resources to display based on selection
  const displayResources = selectedResource ? [selectedResource] : filteredResources;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permissions" />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Heading
            title="Permissions"
            description="View all available permissions in the system"
          />

          <Button variant="outline" asChild>
            <Link href={route('admin.roles.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Roles
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              System Permissions
            </CardTitle>
            <CardDescription>
              These permissions can be assigned to roles to control access to different features
            </CardDescription>

            {/* Search and filter */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedResource(null);
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedResource ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedResource(null)}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Clear Filter
                  </Button>
                ) : (
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Summary section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-lg border bg-card flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Total Resources</div>
                  <div className="text-2xl font-bold">{sortedResources.length}</div>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-card flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">View Permissions</div>
                  <div className="text-2xl font-bold">
                    {Object.values(permissions).flat().filter(p => p.name.startsWith('view')).length}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-card flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Plus className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">Create Permissions</div>
                  <div className="text-2xl font-bold">
                    {Object.values(permissions).flat().filter(p => p.name.startsWith('create')).length}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-card flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <Trash className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">Delete Permissions</div>
                  <div className="text-2xl font-bold">
                    {Object.values(permissions).flat().filter(p => p.name.startsWith('delete')).length}
                  </div>
                </div>
              </div>
            </div>

            {displayResources.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No permissions found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {displayResources.map(resource => {
                  // Group permissions by action type (view, create, edit, delete)
                  const groupedByAction = permissions[resource].reduce((acc, permission) => {
                    const action = permission.name.split(' ')[0];
                    if (!acc[action]) acc[action] = [];
                    acc[action].push(permission);
                    return acc;
                  }, {} as Record<string, typeof permissions[typeof resource]>);

                  return (
                    <div key={resource} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                      <div className="bg-muted p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium capitalize flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            {resource}
                            <Badge className="ml-2">{permissions[resource].length}</Badge>
                          </h3>

                          {!selectedResource && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedResource(resource)}
                            >
                              <Filter className="mr-2 h-4 w-4" />
                              Filter
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Permissions for managing {resource.toLowerCase()}
                        </p>
                      </div>

                      <Separator />

                      <div className="p-4 space-y-6">
                        {Object.entries(groupedByAction).map(([action, actionPermissions]) => {
                          const { icon, label } = getPermissionActionInfo(action);

                          return (
                            <div key={`${resource}-${action}`} className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-md flex items-center justify-center bg-primary/10">
                                  {icon}
                                </div>
                                <h4 className="text-sm font-medium">{label}</h4>
                                <Badge variant="outline" className="ml-auto">
                                  {actionPermissions.length}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {actionPermissions.map(permission => {
                                  // Extract the specific resource from the permission name
                                  const specificResource = permission.name.replace(`${action} `, '');

                                  return (
                                    <div
                                      key={permission.id}
                                      className="flex items-start p-3 rounded-md border hover:bg-muted transition-colors"
                                    >
                                      <div className="flex-1">
                                        <div className="font-medium capitalize text-sm">
                                          {permission.name}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {action === 'view' ? `Access to view ${specificResource}` :
                                           action === 'create' ? `Ability to create new ${specificResource}` :
                                           action === 'edit' || action === 'update' ? `Ability to modify existing ${specificResource}` :
                                           action === 'delete' ? `Permission to remove ${specificResource}` :
                                           `${action} ${specificResource}`}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
