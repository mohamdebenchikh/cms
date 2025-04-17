import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Post, Category } from '@/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PostCard } from '@/components/blog/post-card';
import { BlogHero } from '@/components/blog/blog-hero';

interface CategoryProps {
  category: Category;
  posts: {
    data: Post[];
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
  };
  categories: Category[];
}

export default function CategoryView({ category, posts, categories }: CategoryProps) {
  // State for view mode (grid or list)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load view mode preference from localStorage on component mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem('blog-posts-view-mode');
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode preference to localStorage when it changes
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('blog-posts-view-mode', mode);
  };
  // Create breadcrumbs for the category page
  const breadcrumbs = [
    { title: 'Categories', href: route('blog.categories') },
    { title: category.name }
  ];

  // Create a more descriptive description with post count
  const enhancedDescription = category.description
    ? `${category.description}${posts.total ? ` · ${posts.total} post${posts.total !== 1 ? 's' : ''}` : ''}`
    : posts.total ? `${posts.total} post${posts.total !== 1 ? 's' : ''}` : '';

  // Create hero content
  const heroContent = (
    <BlogHero
      title={category.name}
      description={enhancedDescription}
      image={category.image_cover}
      breadcrumbs={breadcrumbs}
      useDefaultImage={true}
    >
      {category.is_main && (
        <Badge variant="secondary" className="mt-4">
          Main Category
        </Badge>
      )}
    </BlogHero>
  );

  return (
    <BlogLayout
      title={`${category.name} - Category`}
      categories={categories}
      currentCategory={category}
      breadcrumbs={breadcrumbs}
      heroContent={heroContent}
    >

      {/* View Mode Selector */}
      {posts.data.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            Showing {posts.from} to {posts.to} of {posts.total} posts
          </div>
          <Tabs value={viewMode} onValueChange={(value) => handleViewModeChange(value as 'grid' | 'list')} className="w-auto">
            <TabsList className="grid w-[160px] grid-cols-2">
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {posts.data.length > 0 ? (
        <div>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.data.map((post) => (
                <PostCard key={post.id} post={post} variant="vertical" />
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-6">
              {posts.data.map((post) => (
                <PostCard key={post.id} post={post} variant="horizontal" />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No posts found</h2>
          <p className="text-muted-foreground mb-4">
            There are no posts in this category yet.
          </p>
          <Button asChild>
            <Link href={route('blog.home')}>Back to Home</Link>
          </Button>
        </div>
      )}

      {/* Pagination Info moved to the top */}

      {/* Pagination */}
      {posts.last_page > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {posts.current_page > 1 && (
              <PaginationItem>
                <PaginationPrevious href={posts.prev_page_url || '#'} />
              </PaginationItem>
            )}

            {posts.links.slice(1, -1).map((link, i) => (
              <PaginationItem key={i}>
                <PaginationLink href={link.url || '#'} isActive={link.active}>
                  {link.label}
                </PaginationLink>
              </PaginationItem>
            ))}

            {posts.current_page < posts.last_page && (
              <PaginationItem>
                <PaginationNext href={posts.next_page_url || '#'} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

    </BlogLayout>
  );
}
