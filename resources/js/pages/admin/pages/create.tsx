import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboardBreadcrumb, pagesBreadcrumb, createBreadcrumb } from './types';
import { toast } from 'sonner';
import PageForm from './page-form';
import { PageFormData } from './components/form';

const breadcrumbs = [dashboardBreadcrumb, pagesBreadcrumb, createBreadcrumb];

export default function Create() {
  // State to store validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = (formData: PageFormData) => {
    router.post(route('admin.pages.store'), formData, {
      onSuccess: () => {
        toast.success('Page created successfully');
      },
      onError: (errors) => {
        setValidationErrors(errors);
        toast.error('Failed to create page');
      },
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Page" />

      <div className="flex h-full flex-1 flex-col">
        <PageForm
          mode="create"
          onSubmit={handleSubmit}
          errors={validationErrors}
        />
      </div>
    </AppLayout>
  );
}
