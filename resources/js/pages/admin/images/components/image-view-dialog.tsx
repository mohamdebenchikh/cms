import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  FileText,
  HardDrive,
  Image as ImageIcon,
  User,
  Edit,
  ExternalLink
} from 'lucide-react';
import { Image } from '../types';
import { formatFileSize, getImageUrl } from '../utils';

interface ImageViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image;
  onEdit?: (image: Image) => void;
}

export function ImageViewDialog({ isOpen, onClose, image, onEdit }: ImageViewDialogProps) {
  // Get image source with fallback
  const getImageSource = () => {
    if (image.path) {
      return getImageUrl(image.path, image.disk || 'public');
    }
    return image.url || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>Image Details</DialogTitle>
          <DialogDescription>
            Details for {image.title || image.file_name}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-auto py-4 px-2">
            <div className="max-w-[600px] mx-auto space-y-4">
              <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] gap-3 items-center border-b pb-2">
                <span className="text-sm font-medium">File Name:</span>
                <span className="text-sm break-all">{image.file_name}</span>
              </div>

              {image.title && (
                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] gap-3 items-center border-b pb-2">
                  <span className="text-sm font-medium">Title:</span>
                  <span className="text-sm break-all">{image.title}</span>
                </div>
              )}

              {image.alt_text && (
                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] gap-3 items-center border-b pb-2">
                  <span className="text-sm font-medium">Alt Text:</span>
                  <span className="text-sm break-all">{image.alt_text}</span>
                </div>
              )}

              <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] gap-3 items-center border-b pb-2">
                <span className="text-sm font-medium">Size:</span>
                <span className="text-sm">{formatFileSize(image.file_size)}</span>
              </div>

              <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] gap-3 items-center border-b pb-2">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm">{image.file_type}</span>
              </div>

              {image.collection && (
                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] gap-3 items-center border-b pb-2">
                  <span className="text-sm font-medium">Collection:</span>
                  <span className="text-sm capitalize">{image.collection}</span>
                </div>
              )}

              <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] gap-3 items-center border-b pb-2">
                <span className="text-sm font-medium">Uploaded By:</span>
                <span className="text-sm">{image.user?.name || 'Unknown'}</span>
              </div>

              <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] gap-3 items-center border-b pb-2">
                <span className="text-sm font-medium">Uploaded On:</span>
                <span className="text-sm">
                  {new Date(image.created_at).toLocaleDateString()} at {new Date(image.created_at).toLocaleTimeString()}
                </span>
              </div>

              {image.description && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Description:</span>
                  <p className="text-sm whitespace-pre-wrap border rounded-md p-3 bg-muted/30">
                    {image.description}
                  </p>
                </div>
              )}
            </div>
        </div>

        <DialogFooter className="px-2">
          <div className="flex gap-3 w-full justify-end">
            {onEdit && (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(image);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Image
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="outline" size="sm">Close</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
