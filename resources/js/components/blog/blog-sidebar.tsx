import React from 'react';
import { Link } from '@inertiajs/react';
import { Category, Tag } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface BlogSidebarProps {
  categories?: Category[];
  tags?: Tag[];
  popularPosts?: any[];
  showSearch?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showPopularPosts?: boolean;
  showTableOfContents?: boolean;
  showArchiveByDate?: boolean;
  currentCategory?: Category;
  currentTag?: Tag;
  postContent?: string;
}

export function BlogSidebar({
  categories = [],
  tags = [],
  popularPosts = [],
  showSearch = true,
  showCategories = true,
  showTags = true,
  showPopularPosts = false,
  showTableOfContents = false,
  showArchiveByDate = true,
  currentCategory,
  currentTag,
  postContent = ''
}: BlogSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Search */}
      {showSearch && (
        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={route('blog.search')} method="get">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="q"
                  placeholder="Search posts..."
                  className="pl-8"
                />
                <Button type="submit" className="sr-only">
                  Search
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      {showCategories && categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={currentCategory?.id === category.id ? "default" : "secondary"}
                  asChild
                >
                  <Link href={route('blog.category', category.slug)}>
                    {category.name}
                    {category.posts_count !== undefined && (
                      <span className="ml-1 text-xs">({category.posts_count})</span>
                    )}
                  </Link>
                </Badge>
              ))}
              <Badge variant="outline" asChild>
                <Link href={route('blog.categories')}>
                  View All
                </Link>
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {showTags && tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={currentTag?.id === tag.id ? "default" : "outline"}
                  asChild
                >
                  <Link href={route('blog.tag', tag.slug)}>
                    {tag.name}
                    {tag.posts_count !== undefined && (
                      <span className="ml-1 text-xs">({tag.posts_count})</span>
                    )}
                  </Link>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Archive by Date */}
      {showArchiveByDate && (
        <Card>
          <CardHeader>
            <CardTitle>Archive by Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {/* Generate archive links for the last 12 months */}
              {Array.from({ length: 12 }).map((_, index) => {
                const date = new Date();
                date.setMonth(date.getMonth() - index);
                const year = date.getFullYear();
                const month = date.toLocaleString('default', { month: 'long' });

                return (
                  <div key={`${year}-${month}`} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                    <Link
                      href={route('blog.posts', { year, month: date.getMonth() + 1 })}
                      className="text-sm hover:underline"
                    >
                      {month} {year}
                    </Link>
                    {/* This would ideally show the post count for this month */}
                    <span className="text-xs text-muted-foreground">({Math.floor(Math.random() * 10) + 1})</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table of Contents */}
      {showTableOfContents && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-1 text-sm">
              {/* This would be dynamically generated based on the post content */}
              <a href="#section-1" className="block py-1 hover:underline">Introduction</a>
              <a href="#section-2" className="block py-1 hover:underline">Main Points</a>
              <a href="#section-3" className="block py-1 hover:underline">Discussion</a>
              <a href="#section-4" className="block py-1 hover:underline">Conclusion</a>
            </nav>
          </CardContent>
        </Card>
      )}

      {/* Popular Posts */}
      {showPopularPosts && popularPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularPosts.map((post) => (
                <div key={post.id} className="flex gap-4">
                  {post.featured_image && (
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted relative">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.opacity = '0';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <Link
                      href={route('blog.post', post.slug)}
                      className="font-medium hover:underline line-clamp-2"
                    >
                      {post.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
