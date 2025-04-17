import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CategoryForm } from './components/category-form';
import { CategoryFormData, CreateProps, dashboardBreadcrumb, categoriesBreadcrumb, createBreadcrumb } from './types';
import { toast } from 'sonner';

const breadcrumbs = [dashboardBreadcrumb, categoriesBreadcrumb, createBreadcrumb];

export default function Create({ errors: serverErrors = {} }: CreateProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>(serverErrors);

  const handleSubmit = (data: CategoryFormData) => {
    router.post(route('admin.categories.store'), data, {
      onSuccess: () => {
        toast.success('Category created successfully');
        router.visit(route('admin.categories.index'));
      },
      onError: (errors) => {
        setValidationErrors(errors);

        // Show a toast only for general errors
        if (errors.error) {
          toast.error(errors.error);
        } else if (Object.keys(errors).length === 0) {
          toast.error('Failed to create category');
        }
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Category" />

      <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-6xl mx-auto">
        <CategoryForm
          mode="create"
          onSubmit={handleSubmit}
          errors={validationErrors}
        />
      </div>
    </AppLayout>
  );
}
