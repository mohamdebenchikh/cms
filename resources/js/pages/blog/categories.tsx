import React from 'react';
import { Head } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Category } from '@/types';
import { CategoryCard } from '@/components/blog/category-card';

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <BlogLayout title="Categories">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Categories</h1>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No categories found</h2>
              <p className="text-muted-foreground mb-4">
                There are no categories available yet.
              </p>
              <Button asChild>
                <Link href={route('blog.home')}>Back to Home</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </BlogLayout>
  );
}
