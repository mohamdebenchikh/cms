import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CategorySubHeaderProps {
  categories?: Category[];
  mainCategories?: Category[];
  currentCategory?: Category;
  className?: string;
  showSubcategories?: boolean;
}

export function CategorySubHeader({
  categories = [],
  mainCategories = [],
  currentCategory,
  className = '',
}: CategorySubHeaderProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check if we need to show scroll arrows
  const checkScrollArrows = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    // Show left arrow if we've scrolled to the right
    setShowLeftArrow(scrollLeft > 0);

    // Show right arrow if there's more content to scroll to
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10); // 10px buffer
  };

  // Set up scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollArrows);
      // Initial check
      checkScrollArrows();

      // Check on window resize too
      window.addEventListener('resize', checkScrollArrows);

      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollArrows);
        window.removeEventListener('resize', checkScrollArrows);
      };
    }
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  // If no categories and no main categories, don't render
  if (!categories.length && !mainCategories.length) return null;

  // Separate main categories and other categories
  let mainCats: Category[] = [];
  let otherCats: Category[] = [];

  // If we have main categories, use those
  if (mainCategories.length > 0) {
    mainCats = [...mainCategories];
    // Get other categories that are not in mainCategories
    if (categories.length > 0) {
      const mainCategoryIds = mainCats.map(cat => cat.id);
      otherCats = categories.filter(cat => !mainCategoryIds.includes(cat.id));
    }
  } else {
    // Otherwise, filter regular categories for main ones and others
    mainCats = categories.filter(category => category.is_main === true);
    otherCats = categories.filter(category => !category.is_main);
  }

  // Sort categories by order first, then by name
  const sortedMainCategories = [...mainCats].sort((a, b) => {
    // First sort by order if available
    if (a.order !== undefined && b.order !== undefined) {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
    }
    // Then sort by name
    return a.name.localeCompare(b.name);
  });

  // Sort other categories by name
  const sortedOtherCategories = [...otherCats].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <div className={cn("relative border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container relative flex items-center">
        {/* Left scroll button */}
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 z-10 h-full rounded-none border-0 bg-gradient-to-r from-background to-transparent px-2"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Scroll left</span>
          </Button>
        )}

        {/* Categories */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide"
        >
          <Link
            href={route('blog.home')}
            className={cn(
              "inline-flex h-8 items-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              !currentCategory && "bg-accent text-accent-foreground"
            )}
          >
            All
          </Link>

          {/* Main categories */}
          {sortedMainCategories.map((category) => (
            <Link
              key={category.id}
              href={route('blog.category', category.slug)}
              className={cn(
                "inline-flex h-8 items-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                currentCategory?.id === category.id && "bg-accent text-accent-foreground",
                "font-semibold"
              )}
            >
              {category.name}
              {category.posts_count !== undefined && category.posts_count > 0 && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({category.posts_count})
                </span>
              )}
            </Link>
          ))}

          {/* Other categories dropdown */}
          {sortedOtherCategories.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "inline-flex h-8 items-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    currentCategory && sortedOtherCategories.some(cat => cat.id === currentCategory.id) && "bg-accent text-accent-foreground"
                  )}
                >
                  More Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
                {sortedOtherCategories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link
                      href={route('blog.category', category.slug)}
                      className={cn(
                        "w-full",
                        currentCategory?.id === category.id && "bg-accent text-accent-foreground font-medium"
                      )}
                    >
                      {category.name}
                      {category.posts_count !== undefined && category.posts_count > 0 && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({category.posts_count})
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Right scroll button */}
        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 z-10 h-full rounded-none border-0 bg-gradient-to-l from-background to-transparent px-2"
            onClick={scrollRight}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Scroll right</span>
          </Button>
        )}
      </div>
    </div>
  );
}
