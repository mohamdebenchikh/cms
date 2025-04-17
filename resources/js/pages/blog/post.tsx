import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { Post, Category, Tag } from '@/types';
import { CalendarIcon, Clock, User, ImageIcon } from 'lucide-react';
import { PostCard } from '@/components/blog/post-card';
import { BlogHero } from '@/components/blog/blog-hero';
import { BlogBreadcrumb } from '@/components/blog/blog-breadcrumb';
import { createPostBreadcrumbs } from '@/utils/breadcrumbs';
import { formatDate } from '@/utils/date';

interface PostProps {
  post: Post;
  relatedPosts: Post[];
  categories: Category[];
}

export default function PostView({ post, relatedPosts, categories }: PostProps) {
  // Create breadcrumbs for the post
  const breadcrumbs = createPostBreadcrumbs(
    post.title,
    post.category?.name,
    post.category?.slug
  );

  // Create hero content with post header information
  const heroContent = (
    <BlogHero
      title={post.title}
      description={post.excerpt}
      image={post.featured_image}
      breadcrumbs={breadcrumbs}
      useDefaultImage={true}
      isPostHero={false}
    >
      <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-white/80">
        {post.user && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>By {post.user.name}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{formatDate(post.created_at)}</span>
        </div>
        {post.reading_time && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.reading_time} min read</span>
          </div>
        )}
        {post.category && (
          <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white" asChild>
            <Link href={route('blog.category', post.category.slug)}>
              {post.category.name}
            </Link>
          </Badge>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
              <Link href={route('blog.tag', tag.slug)}>
                {tag.name}
              </Link>
            </Badge>
          ))}
        </div>
      )}
    </BlogHero>
  );

  return (
    <BlogLayout
      title={post.title}
      categories={categories}
      currentCategory={post.category}
      breadcrumbs={breadcrumbs}
      heroContent={heroContent}
      popularPosts={relatedPosts.slice(0, 3)}
      showTableOfContents={true} // Enable Table of Contents only for post pages
    >
      <article className="prose prose-stone dark:prose-invert max-w-none bg-card rounded-lg border p-6 shadow-sm">
        {/* Content wrapper */}
        <div className="prose-headings:scroll-mt-20">
          {/* Post Content */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags (Bottom) */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 not-prose border-t pt-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Tagged with:</span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" asChild>
                    <Link href={route('blog.tag', tag.slug)}>
                      {tag.name}
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Author Bio */}
        {post.user && (
          <div className="mt-12 rounded-lg border bg-muted/30 p-6 not-prose">
            <div className="flex items-center gap-4">
              {post.user.avatar ? (
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{post.user.name}</h3>
                {post.user.bio && (
                  <p className="text-sm text-muted-foreground">{post.user.bio}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-8 bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.id} post={relatedPost} variant="vertical" />
            ))}
          </div>
        </div>
      )}

      {/* Share Links for Mobile */}
      <div className="mt-6 flex gap-2 md:hidden">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
          </svg>
          <span className="sr-only">Share on Twitter</span>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
          <span className="sr-only">Share on Facebook</span>
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          <span className="sr-only">Share on LinkedIn</span>
        </a>
      </div>
    </BlogLayout>
  );
}


