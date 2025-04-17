import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
  iconClassName?: string;
  containerClassName?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  iconClassName,
  containerClassName,
  ...props
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (!src || imageError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted rounded-md border border-input",
        fallbackClassName
      )}>
        <ImageIcon className={cn("text-muted-foreground", iconClassName)} />
      </div>
    );
  }

  return (
    <div className={cn("relative", containerClassName)}>
      {isLoading && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-muted/50 rounded-md",
          fallbackClassName
        )}>
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt || "Image"}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
}
