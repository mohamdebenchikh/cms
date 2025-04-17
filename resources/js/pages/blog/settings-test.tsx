import React from 'react';
import { usePage } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SharedData } from '@/types';
import SeoHead from '@/components/blog/seo-head';

export default function SettingsTest() {
  const { settings } = usePage<SharedData>().props;
  
  return (
    <BlogLayout title="Settings Test">
      <SeoHead 
        title="Settings Test"
        description="Testing the settings functionality"
      />
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Settings Test Page</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Site Name:</strong> {settings?.site_name || 'Not set'}</li>
                  <li><strong>Site Description:</strong> {settings?.site_description || 'Not set'}</li>
                  <li><strong>Site Logo:</strong> {settings?.site_logo ? 
                    <img src={settings.site_logo} alt="Site Logo" className="h-8 w-auto mt-2" /> : 
                    'Not set'}
                  </li>
                  <li><strong>Favicon:</strong> {settings?.favicon ? 
                    <img src={settings.favicon} alt="Favicon" className="h-6 w-auto mt-2" /> : 
                    'Not set'}
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Meta Title:</strong> {settings?.meta_title || 'Not set'}</li>
                  <li><strong>Meta Description:</strong> {settings?.meta_description || 'Not set'}</li>
                  <li><strong>Meta Keywords:</strong> {settings?.meta_keywords || 'Not set'}</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Advanced Settings</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Maintenance Mode:</strong> {settings?.maintenance_mode ? 'Enabled' : 'Disabled'}</li>
                  <li><strong>Maintenance Message:</strong> {settings?.maintenance_message || 'Not set'}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BlogLayout>
  );
}
