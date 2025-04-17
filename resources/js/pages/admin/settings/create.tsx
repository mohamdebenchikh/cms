import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import SettingForm from './setting-form';
import { SettingFormData } from './types';
import { toast } from 'sonner';

interface CreateSettingProps {
  groups: string[];
}

export default function CreateSetting({ groups }: CreateSettingProps) {
  const { post, processing } = useForm();

  const handleSubmit = (data: SettingFormData) => {
    // Handle new group if selected
    if (data.group === 'new' && data.newGroup) {
      data.group = data.newGroup;
    }
    
    post(route('admin.settings.store'), {
      data,
      onSuccess: () => {
        toast.success('Setting created successfully');
      },
      onError: () => {
        toast.error('Failed to create setting');
      }
    });
  };

  const breadcrumbs = [
    {
      title: 'Settings',
      href: route('admin.settings.index'),
    },
    {
      title: 'Create Setting',
      href: route('admin.settings.create'),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Setting" />

      <div className="container mx-auto py-6">
        <Heading 
          title="Create Setting" 
          description="Add a new setting to your application"
          className="mb-6"
        />

        <div className="max-w-3xl">
          <SettingForm 
            groups={groups} 
            mode="create" 
            onSubmit={handleSubmit} 
          />
        </div>
      </div>
    </AppLayout>
  );
}
