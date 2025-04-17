import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import RoleForm from './role-form';
import Heading from '@/components/heading';
import { toast } from 'sonner';
import { RoleFormData, EditProps, dashboardBreadcrumb, rolesBreadcrumb, editBreadcrumb } from './types';

export default function Edit({ role, permissions }: EditProps) {
  const breadcrumbs = [
    dashboardBreadcrumb,
    rolesBreadcrumb,
    { ...editBreadcrumb, title: `Edit: ${role.name}` }
  ];

  const handleSubmit = (formData: RoleFormData) => {
    router.put(route('admin.roles.update', role.id), {...formData}, {
      onSuccess: () => {
        toast.success('Role updated successfully');
      },
      onError: (errors) => {
        toast.error('Failed to update role');
        console.error(errors);
      },
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Role: ${role.name}`} />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <Heading
          title={`Edit Role: ${role.name}`}
          description="Update role details and permissions"
        />

            <RoleForm
              role={role}
              permissions={permissions}
              mode="edit"
              onSubmit={handleSubmit}
            />
         
      </div>
    </AppLayout>
  );
}
