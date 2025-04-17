import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Settings } from 'lucide-react';
import { Setting, GroupSettingsFormData } from './types';
import GroupSettingsForm from './group-settings-form';
import { toast } from 'sonner';
import SettingsLayout from '@/layouts/admin/settings-layout';

interface SettingsIndexProps {
  settings: Setting[];
  groups: string[];
  currentGroup: string;
}

export default function SettingsIndex({ settings, groups, currentGroup }: SettingsIndexProps) {
  const { post, processing } = useForm();

  const handleSubmit = (data: GroupSettingsFormData) => {
    post(route('admin.settings.update-group', { group: currentGroup }), {
      data,
      onSuccess: () => {
        toast.success('Settings updated successfully');
      },
      onError: () => {
        toast.error('Failed to update settings');
      }
    });
  };

  const breadcrumbs = [
    {
      title: 'Settings',
      href: route('admin.settings.index'),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Settings" />

      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Heading
            title="Settings"
            description="Manage and configure your application settings"
          />
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button asChild variant="outline" className="justify-start sm:justify-center">
              <Link href={route('admin.settings.create', { group: currentGroup })}>
                <Plus className="mr-2 h-4 w-4" />
                Add to <span className="capitalize">{currentGroup}</span>
              </Link>
            </Button>
            <Button asChild className="justify-start sm:justify-center">
              <Link href={route('admin.settings.create')}>
                <Plus className="mr-2 h-4 w-4" />
                New Setting
              </Link>
            </Button>
          </div>
        </div>

        <SettingsLayout groups={groups} currentGroup={currentGroup}>
          {settings.length > 0 ? (
            <GroupSettingsForm
              settings={settings}
              currentGroup={currentGroup}
              onSubmit={handleSubmit}
            />
          ) : (
            <div className="border border-dashed border-muted rounded-lg p-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-6">
                  <Settings className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No settings found</h3>
                <p className="text-muted-foreground mb-8 max-w-md">
                  There are no settings in the <span className="capitalize font-medium">{currentGroup}</span> group yet.
                  Add your first setting to get started.
                </p>
                <Button asChild size="lg">
                  <Link href={route('admin.settings.create', { group: currentGroup })}>
                    <Plus className="mr-2 h-5 w-5" />
                    Add Setting
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </SettingsLayout>
      </div>
    </AppLayout>
  );
}
