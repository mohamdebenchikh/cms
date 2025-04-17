import { SidebarInset } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset {...props}>
                <ScrollArea className="h-full w-full">
                    <div className="max-w-full overflow-hidden p-1">
                        {children}
                    </div>
                </ScrollArea>
            </SidebarInset>
        );
    }

    return (
        <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl" {...props}>
            <ScrollArea className="h-full w-full">
                <div className="max-w-full overflow-hidden p-1">
                    {children}
                </div>
            </ScrollArea>
        </main>
    );
}
