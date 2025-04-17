import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
  overlayOpacity?: 'light' | 'medium' | 'dark';
  defaultImage?: string;
}

export function PageHero({
  title,
  subtitle,
  backgroundImage,
  children,
  className,
  align = 'center',
  size = 'md',
  overlay = true,
  overlayOpacity = 'medium',
  defaultImage = '/images/hero-bg.jpeg',
}: PageHeroProps) {
  // Determine height based on size
  const heightClass = {
    sm: 'min-h-[200px] md:min-h-[250px]',
    md: 'min-h-[300px] md:min-h-[400px]',
    lg: 'min-h-[400px] md:min-h-[500px]',
  }[size];

  // Determine text alignment
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align];

  // Determine overlay opacity
  const overlayClass = {
    light: 'bg-black/30',
    medium: 'bg-black/50',
    dark: 'bg-black/70',
  }[overlayOpacity];

  return (
    <div className={cn(
      'relative w-full flex flex-col justify-center',
      heightClass,
      className
    )}>
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // If the image fails to load, use the default image
              e.currentTarget.src = defaultImage;
            }}
          />
          {overlay && (
            <div className={cn(
              'absolute inset-0',
              overlayClass
            )} />
          )}
        </div>
      )}

      {/* Content */}
      <div className={cn(
        'relative z-10 container flex flex-col',
        alignClass,
        backgroundImage ? 'text-white' : ''
      )}>
        <h1 className={cn(
          'font-bold',
          size === 'lg' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-3xl md:text-4xl lg:text-5xl'
        )}>
          {title}
        </h1>

        {subtitle && (
          <p className={cn(
            'mt-4',
            size === 'lg' ? 'text-xl md:text-2xl max-w-3xl' : 'text-lg md:text-xl max-w-2xl',
            backgroundImage ? 'text-white/90' : 'text-muted-foreground'
          )}>
            {subtitle}
          </p>
        )}

        {children && (
          <div className={cn(
            'mt-6',
            backgroundImage ? 'text-white' : ''
          )}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
