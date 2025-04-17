import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Post, Category, Tag } from '@/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PostCard } from '@/components/blog/post-card';
import { BlogHero } from '@/components/blog/blog-hero';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LayoutGrid, List } from 'lucide-react';

interface PostsProps {
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
  tags: Tag[];
  filters: {
    sort: string;
    category: number | null;
    tag: number | null;
  };
}

export default function Posts({ posts, categories, tags, filters }: PostsProps) {
  // State for filters
  const [sortOrder, setSortOrder] = useState<string>(filters.sort || 'newest');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(filters.category);
  const [selectedTag, setSelectedTag] = useState<number | null>(filters.tag);
  const [showFilters, setShowFilters] = useState<boolean>(false);

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

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOrder(value);
    applyFilters({ sort: value, category: selectedCategory, tag: selectedTag });
  };

  // Handle category filter change
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    applyFilters({ sort: sortOrder, category: categoryId, tag: selectedTag });
  };

  // Handle tag filter change
  const handleTagChange = (tagId: number | null) => {
    setSelectedTag(tagId);
    applyFilters({ sort: sortOrder, category: selectedCategory, tag: tagId });
  };

  // Apply all filters
  const applyFilters = ({ sort, category, tag }: { sort: string, category: number | null, tag: number | null }) => {
    const params: any = { sort };
    if (category) params.category = category;
    if (tag) params.tag = tag;

    router.get(route('blog.posts'), params, {
      preserveState: true,
      preserveScroll: true,
      only: ['posts']
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSortOrder('newest');
    setSelectedCategory(null);
    setSelectedTag(null);
    router.get(route('blog.posts'), {}, {
      preserveState: true,
      preserveScroll: true,
      only: ['posts']
    });
  };

  // Create breadcrumbs for the posts page
  const breadcrumbs = [
    { title: 'All Posts' }
  ];

  // Create a more descriptive description with post count
  const enhancedDescription = posts.meta?.total
    ? `Browse all ${posts.meta.total} published article${posts.meta.total !== 1 ? 's' : ''}`
    : 'Browse all our published articles';

  // Create hero content
  const heroContent = (
    <BlogHero
      title="Blog Posts"
      description={enhancedDescription}
      breadcrumbs={breadcrumbs}
      useDefaultImage={true}
    />
  );

  // Get the active category and tag
  const activeCategory = selectedCategory ? categories.find(c => c.id === selectedCategory) : null;
  const activeTag = selectedTag ? tags.find(t => t.id === selectedTag) : null;

  return (
    <BlogLayout
      title="Blog Posts"
      categories={categories}
      breadcrumbs={breadcrumbs}
      heroContent={heroContent}
      showSidebar={false}
    >
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="space-y-6 sticky top-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Filters</span>
                    {(selectedCategory || selectedTag) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="h-8 px-2"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sort Order */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Sort By</h3>
                    <Select value={sortOrder} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Categories</h3>
                    <ScrollArea className="h-[200px] pr-4">
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <Button
                              variant={selectedCategory === category.id ? "default" : "ghost"}
                              size="sm"
                              className="justify-start w-full text-left h-8"
                              onClick={() => handleCategoryChange(selectedCategory === category.id ? null : category.id)}
                            >
                              {category.name}
                              {category.posts_count && (
                                <Badge variant="secondary" className="ml-auto">
                                  {category.posts_count}
                                </Badge>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <Separator />

                  {/* Tags */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant={selectedTag === tag.id ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleTagChange(selectedTag === tag.id ? null : tag.id)}
                        >
                          {tag.name}
                          {tag.posts_count && (
                            <span className="ml-1 text-xs">({tag.posts_count})</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Mobile Filter Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 lg:hidden">
              <div className="text-sm text-muted-foreground">
                Showing {posts.from || posts.meta?.from || 0}-{posts.to || posts.meta?.to || 0} of {posts.total || posts.meta?.total || 0} posts
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {(selectedCategory || selectedTag) && (
                    <Badge variant="secondary" className="ml-1">
                      {(selectedCategory ? 1 : 0) + (selectedTag ? 1 : 0)}
                    </Badge>
                  )}
                </Button>

                <Select value={sortOrder} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile View Mode Selector */}
                <Tabs value={viewMode} onValueChange={(value) => handleViewModeChange(value as 'grid' | 'list')} className="w-auto">
                  <TabsList className="grid w-[80px] grid-cols-2">
                    <TabsTrigger value="grid" className="flex items-center justify-center">
                      <LayoutGrid className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center justify-center">
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Mobile Filters (Collapsible) */}
            {showFilters && (
              <Card className="mb-6 lg:hidden">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Filters</h3>
                    {(selectedCategory || selectedTag) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="h-8 px-2"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>

                  <Separator />

                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.slice(0, 10).map((category) => (
                        <Badge
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => handleCategoryChange(selectedCategory === category.id ? null : category.id)}
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, 15).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant={selectedTag === tag.id ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleTagChange(selectedTag === tag.id ? null : tag.id)}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Filters Display */}
            {(activeCategory || activeTag) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {activeCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {activeCategory.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleCategoryChange(null)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove category filter</span>
                    </Button>
                  </Badge>
                )}
                {activeTag && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Tag: {activeTag.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleTagChange(null)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove tag filter</span>
                    </Button>
                  </Badge>
                )}
              </div>
            )}

            {/* Desktop Results Count */}
            {/* Pagination info is now in the View Mode Selector section */}

            {/* View Mode Selector (Desktop) */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <div className="text-sm text-muted-foreground">
                {(posts.total > 0 || posts.meta?.total > 0) && (
                  <span>Showing {posts.from || posts.meta?.from} to {posts.to || posts.meta?.to} of {posts.total || posts.meta?.total} posts</span>
                )}
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

            {/* Posts Content */}
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
              <div className="text-center py-12 bg-card rounded-lg border">
                <h2 className="text-xl font-semibold mb-2">No posts found</h2>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria.
                </p>
                <Button onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            )}

            {/* Pagination Info - Moved to the top */}

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
          </div>
        </div>
      </div>
    </BlogLayout>
  );
}
