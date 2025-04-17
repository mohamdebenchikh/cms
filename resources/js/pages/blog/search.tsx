import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { Post, Category } from '@/types';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Calendar, Clock, Filter } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PostCard } from '@/components/blog/post-card';
import { CategoryCard } from '@/components/blog/category-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchProps {
  query?: string;
  results?: {
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

export default function SearchPage({ query, results, categories }: SearchProps) {
  // Get the current sort parameter from the URL or default to 'newest'
  const urlParams = new URLSearchParams(window.location.search);
  const [sortOrder, setSortOrder] = useState<string>(urlParams.get('sort') || 'newest');

  // State for view mode (grid or list)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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

  const { data, setData, get, processing } = useForm({
    q: query || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    get(route('blog.search'), {
      data,
      sort: sortOrder,
      preserveState: true,
    });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOrder(value);
    router.get(route('blog.search'), { q: query, sort: value }, {
      preserveState: true,
      preserveScroll: true,
      only: ['results']
    });
  };

  return (
    <BlogLayout
      title={query ? `Search: ${query}` : 'Search'}
      categories={categories}
      showSidebar={false}
    >
      <div className="container max-w-5xl mx-auto py-12">
        {/* Centered Search Form */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Search</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {query ? `Search results for "${query}"` : "Search for articles, tutorials, and more"}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex max-w-xl mx-auto shadow-sm">
              <Input
                type="search"
                placeholder="Search for posts..."
                value={data.q}
                onChange={e => setData('q', e.target.value)}
                className="rounded-r-none h-12 text-base border-r-0"
              />
              <Button
                type="submit"
                className="rounded-l-none h-12 px-6"
                disabled={processing}
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </div>

        {query && results && (
          <>
            {/* Search Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
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

              <div className="text-sm text-muted-foreground">
                {results.total ? `${results.total} ${results.total === 1 ? 'result' : 'results'} found` : ''}
              </div>
            </div>

            {/* Category Pills */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 8).map((category) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className="px-3 py-1 cursor-pointer hover:bg-secondary transition-colors"
                    asChild
                  >
                    <Link href={route('blog.category', category.slug)}>
                      {category.name}
                    </Link>
                  </Badge>
                ))}
                <Badge
                  variant="outline"
                  className="px-3 py-1 cursor-pointer hover:bg-secondary transition-colors"
                  asChild
                >
                  <Link href={route('blog.categories')}>
                    View All
                  </Link>
                </Badge>
              </div>
            </div>

            {results.data.length > 0 ? (
              <div>
                <Tabs value={viewMode} onValueChange={(value) => handleViewModeChange(value as 'grid' | 'list')} className="mb-6">
                  <TabsList>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                  </TabsList>
                  <TabsContent value="list" className="mt-4">
                    <div className="space-y-6">
                      {results.data.map((post) => (
                        <PostCard key={post.id} post={post} variant="horizontal" />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="grid" className="mt-4">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {results.data.map((post) => (
                        <PostCard key={post.id} post={post} variant="vertical" />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <SearchIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No results found</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any posts matching your search. Try using different keywords or browse our categories.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button asChild variant="outline">
                    <Link href={route('blog.home')}>Back to Home</Link>
                  </Button>
                  <Button asChild>
                    <Link href={route('blog.categories')}>Browse Categories</Link>
                  </Button>
                </div>
              </Card>
            )}

            {/* Pagination */}
            {results.total > 0 && results.last_page > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing {results.from} to {results.to} of {results.total} results
                </div>

                <Pagination>
                  <PaginationContent>
                    {results.current_page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious href={results.prev_page_url || '#'} />
                      </PaginationItem>
                    )}

                    {results.links.slice(1, -1).map((link, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink href={link.url || '#'} isActive={link.active}>
                          {link.label}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {results.current_page < results.last_page && (
                      <PaginationItem>
                        <PaginationNext href={results.next_page_url || '#'} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        {!query && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </BlogLayout>
  );
}
