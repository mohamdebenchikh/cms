import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ShowProps, dashboardBreadcrumb, pagesBreadcrumb, showBreadcrumb } from './types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Calendar, User } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { TextRenderer } from '@/components/text-editor';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Helper function to get user initials for avatar
const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export default function Show({ page }: ShowProps) {
  const breadcrumbs = [dashboardBreadcrumb, pagesBreadcrumb, { ...showBreadcrumb, title: page.title }];

  // Helper function to get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'outline';
      case 'archived':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Page: ${page.title}`} />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Heading
            title={page.title}
            description="View page details and content"
          />

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={route('admin.pages.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pages
              </Link>
            </Button>
            <Button asChild>
              <Link href={route('admin.pages.edit', page.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Page
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Page Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Page Information</CardTitle>
              <CardDescription>
                Details about this page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd className="mt-1">
                    <Badge variant={getStatusVariant(page.status)}>
                      {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                    </Badge>
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">URL</dt>
                  <dd className="mt-1 text-sm">
                    <code className="rounded bg-muted px-1 py-0.5">
                      {window.location.origin}/pages/{page.slug}
                    </code>
                  </dd>
                </div>

                <Separator />

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Author</dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{getUserInitials(page.user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{page.user.name}</span>
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd className="mt-1 text-sm">
                    {format(new Date(page.created_at), 'PPP')}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                  <dd className="mt-1 text-sm">
                    {formatDistanceToNow(new Date(page.updated_at), { addSuffix: true })}
                  </dd>
                </div>

                {page.published_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Published {formatDistanceToNow(new Date(page.published_at), { addSuffix: true })}
                    </span>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Page Content Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                The main content of the page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TextRenderer content={page.content} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
