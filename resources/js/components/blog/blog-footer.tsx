import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Rss,
  Youtube,
  Github,
  Globe,
  AtSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSocialLinks } from '@/utils/settings';

// Define footer navigation items
const footerNavItems = [
  { title: 'About', href: 'blog.about' },
  { title: 'Contact', href: 'blog.contact' },
  { title: 'Privacy', href: 'blog.privacy' },
  { title: 'Terms', href: 'blog.terms' }
];

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

interface BlogFooterProps {
  showSocial?: boolean;
  showNewsletter?: boolean;
  showRssFeed?: boolean;
  socialLinks?: SocialLink[];
}

export function BlogFooter({
  showSocial = true,
  showNewsletter = false,
  showRssFeed = false,
  socialLinks
}: BlogFooterProps) {
  const { name, settings } = usePage<SharedData>().props;
  const siteName = settings?.site_name || name;
  const currentYear = new Date().getFullYear();

  // Get social links from settings
  const socialMediaLinks = getSocialLinks();

  // Default social links if not provided
  const defaultSocialLinks: SocialLink[] = [
    {
      platform: 'twitter',
      url: socialMediaLinks.twitter || '#',
      icon: <Twitter className="h-4 w-4" />
    },
    {
      platform: 'facebook',
      url: socialMediaLinks.facebook || '#',
      icon: <Facebook className="h-4 w-4" />
    },
    {
      platform: 'instagram',
      url: socialMediaLinks.instagram || '#',
      icon: <Instagram className="h-4 w-4" />
    },
    {
      platform: 'linkedin',
      url: socialMediaLinks.linkedin || '#',
      icon: <Linkedin className="h-4 w-4" />
    },
    {
      platform: 'youtube',
      url: socialMediaLinks.youtube || '#',
      icon: <Youtube className="h-4 w-4" />
    },
    {
      platform: 'github',
      url: socialMediaLinks.github || '#',
      icon: <Github className="h-4 w-4" />
    },
    {
      platform: 'website',
      url: socialMediaLinks.website || '#',
      icon: <Globe className="h-4 w-4" />
    },
    {
      platform: 'email',
      url: socialMediaLinks.email ? `mailto:${socialMediaLinks.email}` : '#',
      icon: <AtSign className="h-4 w-4" />
    }
  ];

  // Use provided social links or default ones
  const links = socialLinks || defaultSocialLinks;

  // Helper function to check if a URL is valid
  const isValidUrl = (url: string) => {
    return url && url !== '#' && url !== 'undefined' && url !== 'null';
  };

  return (
    <footer className="border-t bg-background">
      {/* Main Footer */}
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Branding and Copyright */}
          <div className="md:col-span-4">
            <Link href={route('blog.home')} className="text-lg font-bold">
              {siteName}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              © {currentYear} {siteName}. All rights reserved.
            </p>

            {/* Social Links */}
            {showSocial && (
              <div className="mt-4 flex space-x-3">
                {links.filter(link => isValidUrl(link.url)).map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    aria-label={`Follow us on ${link.platform}`}
                  >
                    {link.icon}
                  </a>
                ))}
                {/* RSS Feed link - only shown if showRssFeed is true */}
                {showRssFeed && (
                  <a
                    href="#"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    aria-label="RSS Feed"
                  >
                    <Rss className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4">
            <h3 className="mb-4 text-sm font-medium">Links</h3>
            <ul className="space-y-2">
              {footerNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={route(item.href)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          {showNewsletter && (
            <div className="md:col-span-4">
              <h3 className="mb-4 text-sm font-medium">Subscribe to our newsletter</h3>
              <div className="flex max-w-sm flex-col space-y-2">
                <p className="text-xs text-muted-foreground">
                  Get the latest posts and updates delivered to your inbox.
                </p>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <Button type="submit" size="sm">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t bg-muted/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            Powered by Laravel & React
          </p>
          <div className="flex items-center gap-4">
            {footerNavItems.map((item) => (
              <Link
                key={item.href}
                href={route(item.href)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


