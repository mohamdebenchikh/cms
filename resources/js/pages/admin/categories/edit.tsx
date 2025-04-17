import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CategoryForm } from './components/category-form';
import { CategoryFormData, EditProps, dashboardBreadcrumb, categoriesBreadcrumb } from './types';
import { toast } from 'sonner';

export default function Edit({ category, errors: serverErrors = {} }: EditProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>(serverErrors);
  const breadcrumbs = [
    dashboardBreadcrumb,
    categoriesBreadcrumb,
    {
      title: `Edit: ${category.name}`,
      href: route('admin.categories.edit', category.id)
    }
  ];

  const handleSubmit = (data: CategoryFormData) => {
    router.put(route('admin.categories.update', category.id), data, {
      onSuccess: () => {
        toast.success('Category updated successfully');
        router.visit(route('admin.categories.index'));
      },
      onError: (errors) => {
        setValidationErrors(errors);

        // Show a toast only for general errors
        if (errors.error) {
          toast.error(errors.error);
        } else if (Object.keys(errors).length === 0) {
          toast.error('Failed to update category');
        }
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Category: ${category.name}`} />

      <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-6xl mx-auto">
        <CategoryForm
          category={category}
          mode="edit"
          onSubmit={handleSubmit}
          errors={validationErrors}
        />
      </div>
    </AppLayout>
  );
}
