/**
 * Format file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension from file name
 */
export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if a file is an image
 */
export function isImageFile(fileType: string): boolean {
  return fileType.startsWith('image/');
}

/**
 * Generate a thumbnail URL for an image
 */
export function getThumbnailUrl(url: string): string {
  // This is a placeholder - in a real app, you might have a thumbnail generation service
  return url;
}

/**
 * Get a valid image URL from the storage path
 * This function helps ensure that image URLs are properly formatted
 */
export function getImageUrl(path: string, disk: string = 'public'): string {
  // If the path is already a full URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // If the path starts with /storage, it's already a public URL
  if (path.startsWith('/storage')) {
    return path;
  }

  // Otherwise, construct the URL based on the disk and path
  if (disk === 'public') {
    // Remove 'public/' prefix if it exists
    const cleanPath = path.startsWith('public/') ? path.substring(7) : path;
    return `/storage/${cleanPath}`;
  }

  // For other disks, you might need to adjust this logic
  return `/storage/${path}`;
}

/**
 * Check if an image exists by attempting to load it
 * Returns a promise that resolves to true if the image exists, false otherwise
 */
export function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve(true);
    };

    img.onerror = () => {
      resolve(false);
    };

    img.src = url;
  });
}

/**
 * Debug image loading issues by logging information about the image
 */
export function debugImageLoading(image: any): void {
  console.group('Image Debug Info');
  console.log('Image ID:', image.id);
  console.log('File Name:', image.file_name);
  console.log('Path:', image.path);
  console.log('URL:', image.url);
  console.log('Disk:', image.disk);
  console.log('MIME Type:', image.file_type);
  console.groupEnd();
}
