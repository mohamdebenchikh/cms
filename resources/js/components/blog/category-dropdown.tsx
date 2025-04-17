import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Category } from '@/types';

interface CategoryDropdownProps {
  categories: Category[];
  mainCategories?: Category[];
}

export function CategoryDropdown({ categories, mainCategories = [] }: CategoryDropdownProps) {
  // Use main categories if available, otherwise filter for main categories from the categories array
  const displayCategories = mainCategories.length > 0
    ? mainCategories
    : categories.filter(category => category.is_main === true);

  // Sort categories by name
  const sortedCategories = [...displayCategories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 h-9 px-3">
          Categories
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {sortedCategories.length > 0 ? (
          <>
            {sortedCategories.map((category) => (
              <DropdownMenuItem key={category.id} asChild>
                <Link
                  href={route('blog.category', category.slug)}
                  className="flex items-center justify-between w-full"
                >
                  {category.name}
                  {category.posts_count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {category.posts_count}
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem asChild className="font-medium">
              <Link href={route('blog.categories')} className="text-primary">
                View All Categories
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem disabled>No categories found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
