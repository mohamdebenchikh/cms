import React, { PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Settings } from 'lucide-react';

interface SettingsLayoutProps extends PropsWithChildren {
  groups: string[];
  currentGroup: string;
}

export default function SettingsLayout({ children, groups, currentGroup }: SettingsLayoutProps) {
  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
      <aside className="w-full max-w-xl lg:w-64">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-md">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-lg">Settings Groups</h3>
        </div>
        <Separator className="mb-4" />
        <nav className="flex flex-col space-y-1">
          {groups.map((group) => (
            <div
              key={group}
              className="flex items-center justify-between rounded-md overflow-hidden"
            >
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={cn("justify-start capitalize w-full h-10 font-normal", {
                  "bg-muted font-medium": currentGroup === group,
                  "hover:bg-muted/50": currentGroup !== group,
                })}
              >
                <Link href={route('admin.settings.index', { group })}>
                  {group}
                </Link>
              </Button>
            </div>
          ))}
        </nav>
      </aside>

      <Separator className="my-6 lg:hidden" />

      <div className="flex-1 lg:max-w-3xl">
        <section className="space-y-6">
          {children}
        </section>
      </div>
    </div>
  );
}
