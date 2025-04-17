import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboardBreadcrumb, postsBreadcrumb, createBreadcrumb, CreateProps } from './types';
import PostForm from './post-form';
import { toast } from 'sonner';
import { PostFormData } from './components/form';
import { bypassUnsavedChangesWarning } from '@/components/unsaved-changes-warning';


const breadcrumbs = [dashboardBreadcrumb, postsBreadcrumb, createBreadcrumb];

// Using CreateProps from types.ts

export default function Create({ categories, tags }: CreateProps) {
  // State to store validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Reference to the form's resetDirtyState function
  const resetDirtyStateRef = useRef<(() => void) | null>(null);

  // Make the ref available to the PostForm component
  (window as any).resetDirtyStateRef = resetDirtyStateRef;

  const handleSubmit = (data: PostFormData) => {
    // Use the bypass function to prevent the unsaved changes warning
    bypassUnsavedChangesWarning(() => {
      router.post(route('admin.posts.store'), data, {
      onSuccess: () => {
        toast.success('Post created successfully');
        // Clear validation errors on success
        setValidationErrors({});

        // Reset the dirty state after successful submission
        if (resetDirtyStateRef.current) {
          resetDirtyStateRef.current();
        }
      },
      onError: (errors) => {
        // Store validation errors to pass to the form
        setValidationErrors(errors as Record<string, string>);

        // Show a toast only for general errors
        if (errors.error) {
          toast.error(errors.error);
        } else if (Object.keys(errors).length === 0) {
          toast.error('Failed to create post');
        }
      },
    });
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Post" />
      <PostForm
        categories={categories}
        tags={tags}
        mode="create"
        onSubmit={handleSubmit}
        errors={validationErrors}
      />
    </AppLayout>
  );
}
