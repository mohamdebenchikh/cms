import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import UserForm from './user-form';
import Heading from '@/components/heading';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { EditProps, UserFormData, dashboardBreadcrumb, usersBreadcrumb, editBreadcrumb } from './types';

const breadcrumbs = [dashboardBreadcrumb, usersBreadcrumb, editBreadcrumb];

const Edit: React.FC<EditProps> = ({ user, roles }) => {
  const handleSubmit = (formData: UserFormData) => {
    router.put(route('admin.users.update', user.id), { ...formData }, {
      onSuccess: () => {
        toast.success('User updated successfully');
      },
      onError: () => {
        toast.error('Failed to update user');
      },
    });
  };

  return (
    <>
      <Head title={`Edit User: ${user.name}`} />

      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="flex h-full flex-1 flex-col gap-4 p-4">
          <Heading
            title={`Edit User: ${user.name}`}
            description="Update user information and permissions"
          />

          <UserForm
            user={user}
            roles={roles}
            mode="edit"
            onSubmit={handleSubmit}
          />
        </div>
      </AppLayout>
    </>
  );
};

export default Edit;
