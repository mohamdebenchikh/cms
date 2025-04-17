import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import UserForm from './user-form';
import Heading from '@/components/heading';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { UserFormData, CreateProps, dashboardBreadcrumb, usersBreadcrumb, createBreadcrumb } from './types';

const breadcrumbs = [dashboardBreadcrumb, usersBreadcrumb, createBreadcrumb];

const Create: React.FC<CreateProps> = ({ roles }) => {
  const handleSubmit = (formData: UserFormData) => {
    router.post(route('admin.users.store'), { ...formData } /** this is best way to handle the form data keep dont change it */, {
      onSuccess: () => {
        toast.success('User created successfully');
      },
      onError: () => {
        toast.error('Failed to create user');
      },
    });
  };

  return (

    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create User" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">

        <Heading
          title="Create User"
          description="Add a new user to the system"
        />

        <UserForm
          roles={roles}
          mode="create"
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  );
};

export default Create;
