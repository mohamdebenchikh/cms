import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ShowProps, dashboardBreadcrumb, postsBreadcrumb, showBreadcrumb } from './types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Calendar, User, Tag as TagIcon, FileText } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { TextRenderer } from '@/components/text-editor';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export default function Show({ post }: ShowProps) {
  const breadcrumbs = [dashboardBreadcrumb, postsBreadcrumb, { ...showBreadcrumb, title: post.title }];

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
      <Head title={`Post: ${post.title}`} />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Heading
            title={post.title}
            description="View post details and content"
          />

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={route('admin.posts.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Link>
            </Button>
            <Button asChild>
              <Link href={route('admin.posts.edit', post.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Post
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Post Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Post Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd>
                    <Badge variant={getStatusVariant(post.status)}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </Badge>
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Slug</dt>
                  <dd className="text-sm font-mono bg-muted p-1 rounded">{post.slug}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                  <dd>
                    {post.category ? (
                      <Link
                        href={route('admin.categories.show', post.category.id)}
                        className="text-primary hover:underline"
                      >
                        {post.category.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Uncategorized</span>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Tags</dt>
                  <dd className="flex flex-wrap gap-1 mt-1">
                    {post.tags && post.tags.length > 0 ? (
                      post.tags.map(tag => (
                        <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                          <TagIcon className="h-3 w-3" />
                          {tag.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No tags</span>
                    )}
                  </dd>
                </div>

                <Separator />

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Author</dt>
                  <dd className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{getUserInitials(post.user.name)}</AvatarFallback>
                    </Avatar>
                    <Link
                      href={route('admin.users.show', post.user.id)}
                      className="text-primary hover:underline"
                    >
                      {post.user.name}
                    </Link>
                  </dd>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Created {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                </div>

                {post.published_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Published {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                    </span>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Post Content Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                The main content of the post
              </CardDescription>
            </CardHeader>
            <CardContent>
              {post.excerpt && (
                <div className="mb-4 p-4 bg-muted rounded-md">
                  <h3 className="text-sm font-medium mb-2">Excerpt</h3>
                  <TextRenderer content={post.excerpt} />
                </div>
              )}

              <TextRenderer content={post.content} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
