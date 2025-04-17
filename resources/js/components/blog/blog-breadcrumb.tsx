import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BlogBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BlogBreadcrumb({ items, className }: BlogBreadcrumbProps) {
  return (
    <nav
      className={cn(
        "flex items-center text-sm mb-6",
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link
            href={route('blog.home')}
            className="flex items-center hover:opacity-100 opacity-80 transition-opacity"
          >
            <Home className="h-4 w-4 mr-1" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-2 opacity-60" />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:opacity-100 opacity-80 transition-opacity"
              >
                {item.title}
              </Link>
            ) : (
              <span className="font-medium opacity-90">{item.title}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
