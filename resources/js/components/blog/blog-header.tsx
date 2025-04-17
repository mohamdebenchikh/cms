import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, Search, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/hooks/use-theme';
import { SharedData, Category } from '@/types';
// Category dropdown removed

// Define navigation items
const navItems = [
  { title: 'Home', href: 'blog.home' },
  { title: 'Posts', href: 'blog.posts' },
  { title: 'About', href: 'blog.about' },
  { title: 'Contact', href: 'blog.contact' }
];

interface BlogHeaderProps {
  showSearch?: boolean;
  categories?: Category[];
  mainCategories?: Category[];
}

export function BlogHeader({ showSearch = true, categories = [], mainCategories = [] }: BlogHeaderProps) {
  const { name, settings } = usePage<SharedData>().props;
  const siteName = settings?.site_name || name;
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="flex flex-col gap-4 py-6">
                  {/* Home link */}
                  <Link
                    href={route('blog.home')}
                    className="text-sm font-medium transition-colors hover:text-foreground/80"
                  >
                    Home
                  </Link>

                  {/* Posts link */}
                  <Link
                    href={route('blog.posts')}
                    className="text-sm font-medium transition-colors hover:text-foreground/80"
                  >
                    Posts
                  </Link>

                  {/* Categories section */}
                  <div className="py-2">
                    <h3 className="mb-2 px-1 text-sm font-medium">Categories</h3>
                    <div className="flex flex-col gap-1 pl-3">
                      {mainCategories.length > 0 ? (
                        mainCategories.map((category) => (
                          <Link
                            key={category.id}
                            href={route('blog.category', category.slug)}
                            className="text-sm text-muted-foreground hover:text-foreground font-medium"
                          >
                            {category.name}
                            {category.posts_count !== undefined && (
                              <span className="ml-1 text-xs">({category.posts_count})</span>
                            )}
                          </Link>
                        ))
                      ) : categories.filter(cat => cat.is_main).length > 0 ? (
                        categories.filter(cat => cat.is_main).map((category) => (
                          <Link
                            key={category.id}
                            href={route('blog.category', category.slug)}
                            className="text-sm text-muted-foreground hover:text-foreground font-medium"
                          >
                            {category.name}
                            {category.posts_count !== undefined && (
                              <span className="ml-1 text-xs">({category.posts_count})</span>
                            )}
                          </Link>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No categories</span>
                      )}
                      <Link
                        href={route('blog.categories')}
                        className="mt-1 text-sm font-medium text-primary hover:text-primary/80"
                      >
                        View All Categories
                      </Link>
                    </div>
                  </div>

                  {/* Other navigation items */}
                  {navItems.slice(1).map((item) => (
                    <Link
                      key={item.href}
                      href={route(item.href)}
                      className="text-sm font-medium transition-colors hover:text-foreground/80"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href={route('blog.home')} className="flex items-center space-x-2">
            {settings?.site_logo ? (
              <img src={settings.site_logo} alt={siteName} className="h-8 w-auto" />
            ) : (
              <span className="text-xl font-bold">{siteName}</span>
            )}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Home link */}
          <Link
            href={route('blog.home')}
            className="text-sm font-medium transition-colors hover:text-foreground/80"
          >
            Home
          </Link>

          {/* Categories dropdown removed */}

          {/* Other navigation items */}
          {navItems.slice(1).map((item) => (
            <Link
              key={item.href}
              href={route(item.href)}
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Theme Toggle and Search */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {showSearch && (
            <Link href={route('blog.search')}>
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
