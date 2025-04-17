import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { EditProps, dashboardBreadcrumb, pagesBreadcrumb, editBreadcrumb } from './types';
import { toast } from 'sonner';
import PageForm from './page-form';
import { PageFormData } from './components/form';

export default function Edit({ page }: EditProps) {
  const breadcrumbs = [dashboardBreadcrumb, pagesBreadcrumb, { ...editBreadcrumb, title: `Edit: ${page.title}` }];

  // State to store validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = (formData: PageFormData) => {
    router.put(route('admin.pages.update', page.id), formData, {
      onSuccess: () => {
        toast.success('Page updated successfully');
      },
      onError: (errors) => {
        setValidationErrors(errors);
        toast.error('Failed to update page');
      },
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Page: ${page.title}`} />

      <div className="flex h-full flex-1 flex-col">
        <PageForm
          page={page}
          mode="edit"
          onSubmit={handleSubmit}
          errors={validationErrors}
        />
      </div>
    </AppLayout>
  );
}
