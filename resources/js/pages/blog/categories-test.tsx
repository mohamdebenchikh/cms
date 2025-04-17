import React from 'react';
import { Head } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategorySubHeader } from '@/components/blog/category-subheader';
import { Category } from '@/types';

interface CategoriesTestProps {
  categories: Category[];
}

export default function CategoriesTest({ categories }: CategoriesTestProps) {
  return (
    <BlogLayout 
      title="Categories Sub-Header Test"
      categories={categories}
    >
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Categories Sub-Header Test</h1>
        
        <div className="grid gap-8">
          {/* Standalone Category Sub-Header */}
          <Card>
            <CardHeader>
              <CardTitle>Standalone Category Sub-Header</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The category sub-header can also be used as a standalone component:
              </p>
              <div className="border rounded-lg p-4 bg-muted/30">
                <CategorySubHeader categories={categories} />
              </div>
            </CardContent>
          </Card>
          
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Horizontal scrolling with navigation arrows</li>
                <li>Sticky positioning below the main header</li>
                <li>Highlights the current category</li>
                <li>Shows post counts for each category</li>
                <li>Responsive design for all screen sizes</li>
                <li>Smooth scrolling behavior</li>
                <li>Hidden scrollbar for a cleaner look</li>
                <li>Gradient fade effect on scroll buttons</li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Implementation Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The category sub-header is implemented as a reusable component that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Is added to the BlogLayout component</li>
                <li>Automatically receives categories from the page props</li>
                <li>Highlights the current category when provided</li>
                <li>Uses a sticky position to stay visible while scrolling</li>
                <li>Includes scroll buttons that appear only when needed</li>
                <li>Uses CSS to hide scrollbars while maintaining scroll functionality</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </BlogLayout>
  );
}
