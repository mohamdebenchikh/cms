import React, { ReactNode } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { BlogHeader } from '@/components/blog/blog-header';
import { BlogFooter } from '@/components/blog/blog-footer';
import { BlogSidebar } from '@/components/blog/blog-sidebar';
import { CategorySubHeader } from '@/components/blog/category-subheader';
import { BreadcrumbItem } from '@/components/blog/blog-breadcrumb';
import { Category, Tag } from '@/types';

interface BlogLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  categories?: Category[];
  mainCategories?: Category[];
  tags?: Tag[];
  popularPosts?: any[];
  showSidebar?: boolean;
  currentCategory?: Category;
  currentTag?: Tag;
  breadcrumbs?: BreadcrumbItem[];
  showHero?: boolean;
  heroImage?: string;
  heroContent?: ReactNode;
  showTableOfContents?: boolean; // New prop to explicitly enable Table of Contents
}

export default function BlogLayout({
  children,
  title,
  description,
  categories = [],
  mainCategories = [],
  tags = [],
  popularPosts = [],
  showSidebar = true,
  currentCategory,
  currentTag,
  breadcrumbs = [],
  showHero = false,
  heroImage,
  heroContent,
  showTableOfContents = false // Default to false
}: BlogLayoutProps) {
  // Get categories from page props if not provided
  const page = usePage();
  const pageCategories = page.props.categories as Category[] || [];
  const pageMainCategories = page.props.mainCategories as Category[] || [];
  const pageTags = page.props.tags as Tag[] || [];

  // Use provided categories or fallback to page props
  const displayCategories = categories.length > 0 ? categories : pageCategories;
  const displayMainCategories = mainCategories.length > 0 ? mainCategories : pageMainCategories;
  const displayTags = tags.length > 0 ? tags : pageTags;
  return (
    <>
      <Head title={title}>
        {description && <meta name="description" content={description} />}
      </Head>
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <BlogHeader showSearch={true} categories={displayCategories} mainCategories={displayMainCategories} />

        {/* Category Sub-Header */}
        <CategorySubHeader
          categories={displayCategories}
          mainCategories={displayMainCategories}
          currentCategory={currentCategory}
          className="z-20"
        />

        {/* Hero Content (Full Width) */}
        {heroContent && (
          <div className="w-full">
            {heroContent}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 mt-8">
          {showSidebar ? (
            <div className="container py-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                {/* Content */}
                <div className="md:col-span-8">
                  {children}
                </div>

                {/* Sidebar */}
                <div className="md:col-span-4">
                  <BlogSidebar
                    categories={displayCategories}
                    tags={displayTags}
                    popularPosts={popularPosts}
                    currentCategory={currentCategory}
                    currentTag={currentTag}
                    showSearch={true}
                    showCategories={true}
                    showTags={true}
                    showPopularPosts={popularPosts.length > 0}
                    showTableOfContents={showTableOfContents}
                    showArchiveByDate={true}
                  />
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </main>

        {/* Footer */}
        <BlogFooter showSocial={true} showNewsletter={true} showRssFeed={false} />
      </div>
    </>
  );
}
