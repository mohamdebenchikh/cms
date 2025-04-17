import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import RoleForm from './role-form';
import Heading from '@/components/heading';
import { toast } from 'sonner';
import { RoleFormData, CreateProps, dashboardBreadcrumb, rolesBreadcrumb, createBreadcrumb } from './types';

const breadcrumbs = [dashboardBreadcrumb, rolesBreadcrumb, createBreadcrumb];

export default function Create({ permissions }: CreateProps) {
  const handleSubmit = (formData: RoleFormData) => {
    router.post(route('admin.roles.store'), { ...formData }, /** this is best way to handle the form data keep dont change it */ {
      onSuccess: () => {
        toast.success('Role created successfully');
      },
      onError: (errors) => {
        toast.error('Failed to create role');
        console.error(errors);
      },
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Role" />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <Heading
          title="Create Role"
          description="Create a new role with specific permissions"
        />


            <RoleForm
              permissions={permissions}
              mode="create"
              onSubmit={handleSubmit}
            />
      
      </div>
    </AppLayout>
  );
}
