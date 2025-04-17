import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ShowProps } from './types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { BadgeRole } from './components/badge-role';
import { CalendarDays, Mail, Pencil, ImageIcon, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { dashboardBreadcrumb, usersBreadcrumb, showBreadcrumb } from './types';

const breadcrumbs = [dashboardBreadcrumb, usersBreadcrumb, showBreadcrumb];

// Helper function to get user initials for avatar
const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

const Show: React.FC<ShowProps> = ({ user }) => {
  return (
    <>
      <Head title={`User: ${user.name}`} />

      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">User Details</h1>
              <p className="text-sm text-muted-foreground">
                View detailed information about this user.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start">
              <Link href={route('admin.users.edit', user.id)}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Pencil className="h-4 w-4" />
                  <span>Edit User</span>
                </Button>
              </Link>
              <Link href={route('admin.users.index')}>
                <Button variant="secondary">Back to Users</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* User Profile Card */}
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  User details and account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-3 border-2 border-background shadow-md">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xl">{getUserInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {user.email}
                  </p>
                </div>

                <Separator />

                {/* Bio section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Biography</h3>
                  {user.bio ? (
                    <p className="text-sm">{user.bio}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No biography provided</p>
                  )}
                </div>

                <Separator />

                {/* Account info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Account Information</h3>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member since</span>
                      <span>{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last updated</span>
                      <span>{new Date(user.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Roles section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Roles</h3>
                  <div className="flex flex-wrap gap-2">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map(role => (
                          <BadgeRole key={role.id} role={role} />
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">No roles assigned</span>
                      )}
                    </div>
                  </div>

                  {/* Email verification status */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Email Verification</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.email_verified_at ? "success" : "destructive"}>
                        {user.email_verified_at ? "Verified" : "Unverified"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {user.email_verified_at ? "Email verified" : "Email not verified"}
                      </span>
                    </div>
                  </div>
              </CardContent>
            </Card>

            {/* User Activity Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>
                  Recent activity and content created by this user.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Stats section */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border bg-card p-3">
                      <div className="text-sm font-medium text-muted-foreground">Posts</div>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="text-2xl font-bold">{user.posts?.length || 0}</div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="text-sm font-medium text-muted-foreground">Pages</div>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="text-2xl font-bold">{user.pages?.length || 0}</div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="text-sm font-medium text-muted-foreground">Images</div>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="text-2xl font-bold">{user.images?.length || 0}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Posts section */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      Recent Posts
                    </h3>
                    {user.posts && user.posts.length > 0 ? (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {user.posts.slice(0, 5).map(post => (
                          <div key={post.id} className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors">
                            <div>
                              <p className="font-medium">{post.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                              </p>
                            </div>
                            <Badge variant={post.status === 'published' ? 'default' : 'outline'}>{post.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No posts created by this user.</p>
                    )}
                  </div>

                  {/* Pages section */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Recent Pages
                    </h3>
                    {user.pages && user.pages.length > 0 ? (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {user.pages.slice(0, 5).map(page => (
                          <div key={page.id} className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors">
                            <div>
                              <p className="font-medium">{page.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(page.created_at), { addSuffix: true })}
                              </p>
                            </div>
                            <Badge variant={page.status === 'published' ? 'default' : 'outline'}>{page.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No pages created by this user.</p>
                    )}
                  </div>

                  {/* Images section */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Recent Images
                    </h3>
                    {user.images && user.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {user.images.slice(0, 8).map(image => (
                          <div key={image.id} className="relative aspect-square overflow-hidden rounded-md border group hover:opacity-90 transition-opacity">
                            <img
                              src={image.url || `/storage/${image.path}`}
                              alt={image.alt_text || 'User uploaded image'}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No images uploaded by this user.</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button variant="outline" asChild>
                  <Link href={route('admin.users.edit', user.id)}>
                    Edit User
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default Show;
