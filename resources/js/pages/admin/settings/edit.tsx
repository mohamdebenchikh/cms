import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import SettingForm from './setting-form';
import { Setting, SettingFormData } from './types';
import { toast } from 'sonner';

interface EditSettingProps {
  setting: Setting;
  groups: string[];
}

export default function EditSetting({ setting, groups }: EditSettingProps) {
  const { patch, processing } = useForm();

  const handleSubmit = (data: SettingFormData) => {
    // Handle new group if selected
    if (data.group === 'new' && data.newGroup) {
      data.group = data.newGroup;
    }
    
    patch(route('admin.settings.update', setting.id), {
      data,
      onSuccess: () => {
        toast.success('Setting updated successfully');
      },
      onError: () => {
        toast.error('Failed to update setting');
      }
    });
  };

  const breadcrumbs = [
    {
      title: 'Settings',
      href: route('admin.settings.index'),
    },
    {
      title: 'Edit Setting',
      href: route('admin.settings.edit', setting.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Setting: ${setting.display_name}`} />

      <div className="container mx-auto py-6">
        <Heading 
          title={`Edit Setting: ${setting.display_name}`}
          description="Update the setting details"
          className="mb-6"
        />

        <div className="max-w-3xl">
          <SettingForm 
            setting={setting}
            groups={groups} 
            mode="edit" 
            onSubmit={handleSubmit} 
          />
        </div>
      </div>
    </AppLayout>
  );
}
