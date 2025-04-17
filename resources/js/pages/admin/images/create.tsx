import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { dashboardBreadcrumb, imagesBreadcrumb } from './types';
import { ImageForm } from './components/image-form';

// Create a breadcrumb for the create page
const createBreadcrumb = {
  title: "Upload",
  href: route('admin.images.create'),
};

const breadcrumbs = [dashboardBreadcrumb, imagesBreadcrumb, createBreadcrumb];

export default function Create() {

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Upload Image" />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Heading
            title="Upload Image"
            description="Add a new image to your media library"
          />

          <Button
            variant="outline"
            onClick={() => router.visit(route('admin.images.index'))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Images
          </Button>
        </div>

        <ImageForm mode="create" />
      </div>
    </AppLayout>
  );
}
