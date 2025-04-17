import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, FileText, File, Folder, LayoutGrid, ListIcon, LockIcon, TagIcon, UsersIcon, Image as ImageIcon, Settings } from 'lucide-react';
import AppLogo from './app-logo';
import { ScrollArea } from './ui/scroll-area';



const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/mohamdebenchikh/cms',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://github.com/mohamdebenchikh/cms/wiki',
        icon: BookOpen,
    },
];

export function AppSidebar() {

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: route('admin.dashboard'),
            icon: LayoutGrid,
            isActive: route().current('admin.dashboard')
        },
        {
            title: "Users",
            href: route('admin.users.index'),
            icon: UsersIcon,
            isActive: route().current('admin.users.*'),
            permission: 'view users'
        },
        {
            title: "Role & Permissions",
            href: route('admin.roles.index'),
            icon: LockIcon,
            isActive: route().current('admin.roles.*'),
            permission: 'view roles'
        },
        {
            title: "Posts",
            href: route('admin.posts.index'),
            icon: FileText,
            isActive: route().current('admin.posts.*'),
            permission: 'view posts'
        },
        {
            title: "Pages",
            href: route('admin.pages.index'),
            icon: File,
            isActive: route().current('admin.pages.*'),
            permission: 'view pages'
        },
        {
            title: "Images",
            href: route('admin.images.index'),
            icon: ImageIcon,
            isActive: route().current('admin.images.*'),
            permission: 'view images'
        },
        {
            title: "Categories",
            href: route('admin.categories.index'),
            icon: ListIcon,
            isActive: route().current('admin.categories.*'),
            permission: 'view categories'
        },
        {
            title: "Tags",
            href: route('admin.tags.index'),
            icon: TagIcon,
            isActive: route().current('admin.tags.*'),
            permission: 'view tags'
        },
        {
            title: "Settings",
            href: route('admin.settings.index'),
            icon: Settings,
            isActive: route().current('admin.settings.*'),
            permission: 'view settings'
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <ScrollArea>
                    <NavMain items={mainNavItems} />
                </ScrollArea>

            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
