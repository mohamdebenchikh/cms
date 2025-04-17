import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Post, Category, SharedData } from '@/types';
import { PostCard } from '@/components/blog/post-card';
import { HeroCarousel } from '@/components/blog/hero-carousel';
import { ImageIcon } from 'lucide-react';
import SeoHead from '@/components/blog/seo-head';

interface HomeProps {
  featuredPost: Post;
  featuredPosts: Post[];
  latestPosts: Post[];
  popularPosts: Post[];
  categories: Category[];
  archiveData: {
    year: number;
    month: number;
    month_name: string;
    post_count: number;
    url: string;
  }[];
}

export default function Home({ featuredPost, featuredPosts, latestPosts, popularPosts, categories, archiveData }: HomeProps) {
  const { settings } = usePage<SharedData>().props;

  return (
    <BlogLayout
      categories={categories}
      popularPosts={popularPosts}
      showSidebar={false}
    >
      <SeoHead
        title={settings?.meta_title || 'Home'}
        description={settings?.meta_description || 'Welcome to our blog'}
        keywords={settings?.meta_keywords}
        ogImage={featuredPosts?.[0]?.featured_image}
      />
      <div className="container py-8">
        {/* Hero Carousel with Featured Posts */}
        {featuredPosts && featuredPosts.length > 0 && (
          <HeroCarousel posts={featuredPosts} autoplayInterval={6000} />
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Main Content */}
          <div className="md:col-span-8">
            <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
            <div className="grid gap-6">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button variant="outline" asChild>
                <Link href={route('blog.posts')}>View All Posts</Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4">
            <div className="space-y-8">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge key={category.id} variant="secondary" asChild>
                        <Link href={route('blog.category', category.slug)}>
                          {category.name}
                        </Link>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Posts */}
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
                            {/* Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground opacity-50" />
                            </div>

                            {/* Actual image */}
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="h-full w-full object-cover relative z-10"
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
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Archive by Date */}
              <Card>
                <CardHeader>
                  <CardTitle>Archive by Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {archiveData.map((archive) => (
                      <div key={`${archive.year}-${archive.month}`} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                        <Link
                          href={archive.url}
                          className="text-sm hover:underline"
                        >
                          {archive.month_name} {archive.year}
                        </Link>
                        <span className="text-xs text-muted-foreground">({archive.post_count})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={route('blog.archive')}>View All Archives</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscribe to Newsletter</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Subscribe
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
}
