import React, { useState } from 'react';
import {  Link, router } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Button } from '@/components/ui/button';
import { Post, Category } from '@/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PostCard } from '@/components/blog/post-card';
import { BlogHero } from '@/components/blog/blog-hero';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {SlidersHorizontal } from 'lucide-react';

interface ArchiveProps {
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
    // Keep meta for backward compatibility
    meta?: {
      current_page: number;
      from: number;
      last_page: number;
      links: {
        url: string | null;
        label: string;
        active: boolean;
      }[];
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
  };
  categories: Category[];
}

export default function Archive({ posts, categories }: ArchiveProps) {
  // Get the current sort parameter from the URL or default to 'newest'
  const urlParams = new URLSearchParams(window.location.search);
  const [sortOrder, setSortOrder] = useState<string>(urlParams.get('sort') || 'newest');

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOrder(value);
    router.get(route('blog.archive'), { sort: value }, {
      preserveState: true,
      preserveScroll: true,
      only: ['posts']
    });
  };

  // Create breadcrumbs for the archive page
  const breadcrumbs = [
    { title: 'All Posts' }
  ];

  // Create a more descriptive description with post count
  const enhancedDescription = posts.total
    ? `Browse all ${posts.total} published article${posts.total !== 1 ? 's' : ''}`
    : 'Browse all our published articles';

  // Create hero content
  const heroContent = (
    <BlogHero
      title="All Posts"
      description={enhancedDescription}
      breadcrumbs={breadcrumbs}
      useDefaultImage={true}
    />
  );

  return (
    <BlogLayout
      title="All Posts"
      categories={categories}
      breadcrumbs={breadcrumbs}
      heroContent={heroContent}
    >

      {/* Sorting Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {posts.from || 0}-{posts.to || 0} of {posts.total || 0} posts
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Select value={sortOrder} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {posts.data.length > 0 ? (
        <div className="grid gap-6">
          {posts.data.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No posts found</h2>
          <p className="text-muted-foreground mb-4">
            There are no posts available yet.
          </p>
          <Button asChild>
            <Link href={route('blog.home')}>Back to Home</Link>
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {posts.total > 0 && (
        <div className="text-sm text-muted-foreground mt-6 mb-4">
          Showing {posts.from} to {posts.to} of {posts.total} posts
        </div>
      )}

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
