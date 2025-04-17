import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Can } from '@/components/can';

export function NavMain({ items = [] }: { items: NavItem[] }) {

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Can
                        key={item.title}
                        permission={item.permission}
                        permissions={item.permissions}
                        role={item.role}
                        roles={item.roles}
                        matchAny={item.matchAny}
                    >
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild isActive={item.isActive}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </Can>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
