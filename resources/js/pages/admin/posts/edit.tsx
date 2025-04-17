import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { EditProps, dashboardBreadcrumb, postsBreadcrumb, editBreadcrumb } from './types';
import PostForm from './post-form';

import { toast } from 'sonner';
import { PostFormData } from './components/form';
import { bypassUnsavedChangesWarning } from '@/components/unsaved-changes-warning';

export default function Edit({ post, categories, tags }: EditProps) {
  const breadcrumbs = [dashboardBreadcrumb, postsBreadcrumb, { ...editBreadcrumb, title: `Edit: ${post.title}` }];

  // State to store validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Reference to the form's resetDirtyState function
  const resetDirtyStateRef = useRef<(() => void) | null>(null);

  // Make the ref available to the PostForm component
  (window as any).resetDirtyStateRef = resetDirtyStateRef;

  const handleSubmit = (data: PostFormData) => {
    // Use the bypass function to prevent the unsaved changes warning
    bypassUnsavedChangesWarning(() => {
      router.put(route('admin.posts.update', post.id), data, {
      onSuccess: () => {
        toast.success('Post updated successfully');
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
          toast.error('Failed to update post');
        }
      },
    });
    });
  };

  const handleDelete = (id: number) => {
    // Use the bypass function to prevent the unsaved changes warning
    bypassUnsavedChangesWarning(() => {
      router.delete(route('admin.posts.destroy', id), {
      onSuccess: () => {
        toast.success('Post deleted successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete post');
      },
    });
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Post: ${post.title}`} />

      <PostForm
          post={post}
          categories={categories}
          tags={tags}
          mode="edit"
          onSubmit={handleSubmit}
          errors={validationErrors}
          onDelete={handleDelete}
      />
    </AppLayout>
  );
}
