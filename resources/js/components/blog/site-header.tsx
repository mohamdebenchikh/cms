import { Link } from '@inertiajs/react';
import React from 'react';
import { getSetting } from '@/utils/settings';

export default function SiteHeader() {
  // Get settings from shared data
  const siteName = getSetting('site_name', 'My Blog');
  const siteLogo = getSetting('site_logo');
  
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {siteLogo ? (
            <Link href={route('blog.home')}>
              <img src={siteLogo} alt={siteName} className="h-10 w-auto" />
            </Link>
          ) : (
            <Link 
              href={route('blog.home')}
              className="text-xl font-bold text-foreground"
            >
              {siteName}
            </Link>
          )}
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href={route('blog.home')}
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            Home
          </Link>
          <Link 
            href={route('blog.archive')}
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            Archive
          </Link>
          <Link 
            href={route('blog.about')}
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            About
          </Link>
          <Link 
            href={route('blog.contact')}
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
