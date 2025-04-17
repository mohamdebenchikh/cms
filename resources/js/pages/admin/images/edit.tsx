import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { dashboardBreadcrumb, imagesBreadcrumb, Image } from './types';
import { ImageForm } from './components/image-form';

interface EditProps {
  image: Image;
}

// Create a breadcrumb for the edit page
const editBreadcrumb = {
  title: "Edit Image",
  href: "#",
};

const breadcrumbs = [dashboardBreadcrumb, imagesBreadcrumb, editBreadcrumb];

export default function Edit({ image }: EditProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Image: ${image.file_name}`} />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Heading
            title="Edit Image"
            description="Update image details"
          />

          <Button
            variant="outline"
            onClick={() => router.visit(route('admin.images.index'))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Images
          </Button>
        </div>

        <ImageForm 
          mode="edit" 
          image={image} 
        />
      </div>
    </AppLayout>
  );
}
