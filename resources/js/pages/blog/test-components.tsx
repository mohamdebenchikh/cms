import React from 'react';
import { Head } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogHeader } from '@/components/blog/blog-header';
import { BlogFooter } from '@/components/blog/blog-footer';
import { Button } from '@/components/ui/button';

export default function TestComponents() {
  return (
    <BlogLayout title="Test Components">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Blog Components Test Page</h1>

        <div className="grid gap-8">
          {/* Header Component Test */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Header Component</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The blog header component is already being used in the layout. It includes:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Responsive navigation with mobile menu</li>
                <li>Theme toggle button</li>
                <li>Search button</li>
                <li>Site branding</li>
              </ul>
              <div className="border rounded-lg p-4 bg-muted/30">
                <BlogHeader showSearch={true} />
              </div>
            </CardContent>
          </Card>

          {/* Footer Component Test */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Footer Component</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The blog footer component is already being used in the layout. It includes:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Site branding and copyright</li>
                <li>Navigation links</li>
                <li>Social media links</li>
                <li>Newsletter signup (optional)</li>
              </ul>
              <div className="border rounded-lg p-4 bg-muted/30">
                <BlogFooter showSocial={true} showNewsletter={true} showRssFeed={false} />
              </div>
            </CardContent>
          </Card>

          {/* Usage Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                These components can be used in different ways:
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Header Variations</h3>
              <div className="grid gap-4 mb-6">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <p className="text-sm mb-2 font-medium">Header without search:</p>
                  <BlogHeader showSearch={false} />
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-4 mb-2">Footer Variations</h3>
              <div className="grid gap-4">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <p className="text-sm mb-2 font-medium">Footer without social links:</p>
                  <BlogFooter showSocial={false} showNewsletter={true} showRssFeed={false} />
                </div>

                <div className="border rounded-lg p-4 bg-muted/30">
                  <p className="text-sm mb-2 font-medium">Footer without newsletter:</p>
                  <BlogFooter showSocial={true} showNewsletter={false} showRssFeed={false} />
                </div>

                <div className="border rounded-lg p-4 bg-muted/30">
                  <p className="text-sm mb-2 font-medium">Minimal footer:</p>
                  <BlogFooter showSocial={false} showNewsletter={false} showRssFeed={false} />
                </div>

                <div className="border rounded-lg p-4 bg-muted/30">
                  <p className="text-sm mb-2 font-medium">Footer with RSS feed (if route exists):</p>
                  <BlogFooter showSocial={true} showNewsletter={false} showRssFeed={true} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                These components are designed to be flexible and reusable:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>They can be used independently or together</li>
                <li>They automatically adapt to the current theme</li>
                <li>They are fully responsive</li>
                <li>They use settings from the application when available</li>
                <li>They can be customized with props</li>
              </ul>

              <div className="mt-6">
                <Button asChild>
                  <a href={route('admin.dashboard')}>Back to Dashboard</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BlogLayout>
  );
}
