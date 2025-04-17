import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ShowProps, dashboardBreadcrumb, categoriesBreadcrumb, showBreadcrumb } from './types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, FileText, Calendar, Hash } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
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

export default function Show({ category }: ShowProps) {
  const breadcrumbs = [dashboardBreadcrumb, categoriesBreadcrumb, showBreadcrumb(category.id)];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Category: ${category.name}`} />
      
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Heading
            title={`Category: ${category.name}`}
            description="View category details and associated posts"
          />

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={route('admin.categories.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Link>
            </Button>
            <Button asChild>
              <Link href={route('admin.categories.edit', category.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Category
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Category Details
              </CardTitle>
              <CardDescription>
                Basic information about this category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="text-base font-medium">{category.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Slug</h3>
                <p className="text-base font-medium">{category.slug}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p className="text-base">
                  {format(new Date(category.created_at), 'PPP')}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formatDistanceToNow(new Date(category.created_at), { addSuffix: true })})
                  </span>
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <p className="text-base">
                  {format(new Date(category.updated_at), 'PPP')}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formatDistanceToNow(new Date(category.updated_at), { addSuffix: true })})
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Posts in this Category
              </CardTitle>
              <CardDescription>
                {category.posts && category.posts.length > 0
                  ? `This category contains ${category.posts.length} posts`
                  : 'This category does not have any posts yet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.description && (
                <div className="mb-4 p-4 bg-muted rounded-md">
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm">{category.description}</p>
                </div>
              )}
              
              {category.posts && category.posts.length > 0 ? (
                <div className="space-y-4">
                  {category.posts.map(post => (
                    <div key={post.id} className="flex items-start p-3 border rounded-md">
                      <div className="flex-1">
                        <h3 className="font-medium">{post.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                            {post.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.posts.edit', post.id)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No posts found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This category does not have any posts yet
                  </p>
                </div>
              )}
            </CardContent>
            {category.posts && category.posts.length > 0 && (
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {category.posts.length} posts in this category
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={route('admin.posts.create')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Create New Post
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
