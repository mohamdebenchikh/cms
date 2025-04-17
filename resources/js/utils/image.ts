import { Image } from '@/types';

/**
 * Get the URL for an image, handling different formats
 * 
 * @param image The image object or string URL
 * @param fallback Optional fallback URL if image is null or invalid
 * @returns The image URL
 */
export function getImageUrl(image: Image | string | null | undefined, fallback: string = ''): string {
  if (!image) {
    return fallback;
  }

  // If it's a string, return it directly
  if (typeof image === 'string') {
    return image;
  }

  // If it's an Image object with a URL property
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

  return fallback;
}

/**
 * Get the alt text for an image
 * 
 * @param image The image object or string URL
 * @param defaultAlt Default alt text if none is found
 * @returns The alt text
 */
export function getImageAlt(image: Image | string | null | undefined, defaultAlt: string = 'Image'): string {
  if (!image) {
    return defaultAlt;
  }

  // If it's a string, return the default alt
  if (typeof image === 'string') {
    return defaultAlt;
  }

  // If it's an Image object, try to get the alt text
  return image.alt_text || image.title || defaultAlt;
}
