import React, { useState } from 'react';
import { Image as ImageType } from '@/types';
import { ImageIcon } from 'lucide-react';

interface ImageCardProps {
  image: ImageType | string;
  alt?: string;
  className?: string;
  aspectRatio?: 'square' | '16/9' | '4/3' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill';
  onClick?: () => void;
}

export function ImageCard({
  image,
  alt = 'Image',
  className = '',
  aspectRatio = 'square',
  objectFit = 'cover',
  onClick
}: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Get the correct aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case '16/9':
        return 'aspect-[16/9]';
      case '4/3':
        return 'aspect-[4/3]';
      case 'auto':
        return '';
      default:
        return 'aspect-square';
    }
  };

  // Get the correct object fit class
  const getObjectFitClass = () => {
    switch (objectFit) {
      case 'cover':
        return 'object-cover';
      case 'contain':
        return 'object-contain';
      case 'fill':
        return 'object-fill';
      default:
        return 'object-cover';
    }
  };

  // Get the image URL
  const getImageUrl = () => {
    if (typeof image === 'string') {
      return image;
    }

    // If it's an Image object
    if (image.url) {
      return image.url;
    }

    // If there's a path and disk, construct the URL
    if (image.path) {
      const disk = image.disk || 'public';
      
      // If the path is already a full URL, return it
      if (image.path.startsWith('http://') || image.path.startsWith('https://')) {
        return image.path;
      }
      
      // If the path starts with /storage, it's already a public URL
      if (image.path.startsWith('/storage')) {
        return image.path;
      }
      
      // Otherwise, construct the URL based on the disk and path
      if (disk === 'public') {
        // Remove 'public/' prefix if it exists
        const cleanPath = image.path.startsWith('public/') 
          ? image.path.substring(7) 
          : image.path;
        
        return `/storage/${cleanPath}`;
      }
      
      // For other disks, you might need to adjust this logic
      return `/storage/${image.path}`;
    }

    // Fallback to placeholder
    return '/placeholder-image.svg';
  };

  // Get the alt text
  const getAltText = () => {
    if (typeof image === 'string') {
      return alt;
    }

    return image.alt_text || image.title || alt;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div 
      className={`relative overflow-hidden bg-muted ${getAspectRatioClass()} ${className}`}
      onClick={onClick}
    >
      {/* Placeholder shown while loading or on error */}
      <div className={`absolute inset-0 flex items-center justify-center bg-muted transition-opacity duration-300 ${!isLoading && !hasError ? 'opacity-0' : 'opacity-100'}`}>
        <ImageIcon className="h-10 w-10 text-muted-foreground opacity-50" />
      </div>

      {/* Actual image */}
      <img
        src={getImageUrl()}
        alt={getAltText()}
        className={`h-full w-full transition-opacity duration-300 ${getObjectFitClass()} ${isLoading || hasError ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
}
