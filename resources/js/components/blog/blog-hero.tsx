import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BlogBreadcrumb, BreadcrumbItem } from './blog-breadcrumb';

interface BlogHeroProps {
  title: string;
  description?: string;
  image?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
  className?: string;
  imageOpacity?: number;
  defaultImage?: string;
  useDefaultImage?: boolean;
  isPostHero?: boolean;
}

export function BlogHero({
  title,
  description,
  image,
  breadcrumbs,
  children,
  className,
  imageOpacity = 0.7,
  defaultImage = '/images/hero-bg.jpeg',
  useDefaultImage = true,
  isPostHero = false
}: BlogHeroProps) {
  // Determine if we should show an image
  const showImage = image || useDefaultImage;
  const imageToUse = image || defaultImage;

  // Use different styles for post hero
  const heroClasses = isPostHero
    ? "relative w-full overflow-hidden border-b bg-background"
    : "relative w-full overflow-hidden border-b";

  return (
    <div className={cn(
      heroClasses,
      !isPostHero && (showImage ? "bg-muted" : "bg-card"),
      className
    )}>
      {/* Background image with overlay */}
      {showImage && !isPostHero ? (
        <div className="relative py-12 md:py-16 lg:py-20">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"
              style={{ opacity: imageOpacity }}
            />
            {/* Pattern overlay */}
            <div className="absolute inset-0 bg-black/10 z-10 opacity-30"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }}
            />
            <img
              src={imageToUse}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                // If the image fails to load and it's not already the default image, use the default
                if (image && image !== defaultImage) {
                  e.currentTarget.src = defaultImage;
                }
              }}
            />
          </div>

          {/* Content with image */}
          <div className="container relative z-10">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <BlogBreadcrumb
                items={breadcrumbs}
                className="text-white/70"
              />
            )}

            {/* Title and description */}
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-4 text-white line-clamp-3">
                {title}
              </h1>

              {description && (
                <p className="text-lg md:text-xl text-white/80 line-clamp-3">
                  {description}
                </p>
              )}

              {children && (
                <div className="mt-6">
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isPostHero ? (
        /* Post hero layout */
        <div className="py-8 md:py-10">
          <div className="container">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <BlogBreadcrumb items={breadcrumbs} />
            )}

            {/* Featured Image */}
            {image && (
              <div className="mt-6 mb-8 aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted relative">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    if (image !== defaultImage) {
                      e.currentTarget.src = defaultImage;
                    }
                  }}
                />
              </div>
            )}

            {/* Title and description */}
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-4 text-foreground">
                {title}
              </h1>

              {description && (
                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                  {description}
                </p>
              )}

              {children && (
                <div className="mt-6 flex flex-wrap justify-center">
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Content without image */
        <div className="py-8 md:py-10 bg-card/50">
          <div className="container">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <BlogBreadcrumb
                items={breadcrumbs}
              />
            )}

            {/* Title and description */}
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-4 text-foreground line-clamp-3">
                {title}
              </h1>

              {description && (
                <p className="text-lg text-muted-foreground line-clamp-3">
                  {description}
                </p>
              )}

              {children && (
                <div className="mt-6">
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
