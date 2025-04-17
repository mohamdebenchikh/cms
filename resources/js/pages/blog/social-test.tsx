import React from 'react';
import { usePage } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SharedData } from '@/types';
import SeoHead from '@/components/blog/seo-head';
import { getSocialLinks } from '@/utils/settings';
import { BlogFooter } from '@/components/blog/blog-footer';

export default function SocialTest() {
  const { settings } = usePage<SharedData>().props;
  const socialLinks = getSocialLinks();
  
  return (
    <BlogLayout title="Social Media Test">
      <SeoHead 
        title="Social Media Test"
        description="Testing the social media links functionality"
      />
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Social Media Links Test Page</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Available Social Media Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Facebook:</strong> {socialLinks.facebook || 'Not set'}</li>
                <li><strong>Twitter:</strong> {socialLinks.twitter || 'Not set'}</li>
                <li><strong>Instagram:</strong> {socialLinks.instagram || 'Not set'}</li>
                <li><strong>LinkedIn:</strong> {socialLinks.linkedin || 'Not set'}</li>
                <li><strong>YouTube:</strong> {socialLinks.youtube || 'Not set'}</li>
                <li><strong>GitHub:</strong> {socialLinks.github || 'Not set'}</li>
                <li><strong>Website:</strong> {socialLinks.website || 'Not set'}</li>
                <li><strong>Email:</strong> {socialLinks.email || 'Not set'}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Footer with Social Media Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-muted/30">
              <BlogFooter showSocial={true} showNewsletter={false} showRssFeed={false} />
            </div>
          </CardContent>
        </Card>
      </div>
    </BlogLayout>
  );
}
