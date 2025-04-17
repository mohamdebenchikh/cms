import React from 'react';
import { Head } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';

interface PageProps {
  page: {
    title: string;
    content: string;
    featured_image?: string;
  };
}

export default function Page({ page }: PageProps) {
  return (
    <BlogLayout title={page.title}>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 md:text-4xl">{page.title}</h1>
          
          {page.featured_image && (
            <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted mb-8">
              <img
                src={page.featured_image}
                alt={page.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          
          <div className="prose prose-stone dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </div>
    </BlogLayout>
  );
}
