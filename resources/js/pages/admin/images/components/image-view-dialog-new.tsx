import React from 'react';
import { toast } from 'sonner';
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
  Download,
  Copy,
  Edit,
  ExternalLink,
  Info,
  Eye
} from 'lucide-react';
import { Image } from '../types';
import { formatFileSize, getImageUrl } from '../utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ImageViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image;
  onEdit?: (image: Image) => void;
}

export function ImageViewDialog({ isOpen, onClose, image, onEdit }: ImageViewDialogProps) {
  // Copy image URL to clipboard
  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Image URL copied to clipboard');
  };

  // Get image source with fallback
  const getImageSource = () => {
    if (image.path) {
      return getImageUrl(image.path, image.disk || 'public');
    }
    return image.url || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Image Details</DialogTitle>
          <DialogDescription>
            View details for {image.file_name}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preview" className="w-full overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Details
            </TabsTrigger>
          </TabsList>
          
          {/* Preview Tab */}
          <TabsContent value="preview" className="overflow-auto py-4">
            <div className="flex flex-col items-center">
              <div className="aspect-square w-full max-w-[500px] rounded-md overflow-hidden bg-muted relative group">
                <img
                  src={getImageSource()}
                  alt={image.file_name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.svg';
                  }}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                    onClick={() => window.open(getImageSource(), '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mt-4 w-full max-w-[500px]">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(getImageSource(), '_blank')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => copyImageUrl(getImageSource())}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy URL
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details" className="overflow-auto py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                <span className="text-sm font-medium">File Name:</span>
                <span className="text-sm truncate">{image.file_name}</span>
              </div>

              {image.title && (
                <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                  <span className="text-sm font-medium">Title:</span>
                  <span className="text-sm truncate">{image.title}</span>
                </div>
              )}

              {image.alt_text && (
                <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                  <span className="text-sm font-medium">Alt Text:</span>
                  <span className="text-sm truncate">{image.alt_text}</span>
                </div>
              )}

              <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                <span className="text-sm font-medium">Size:</span>
                <span className="text-sm">{formatFileSize(image.file_size)}</span>
              </div>

              <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm">{image.file_type}</span>
              </div>

              {image.collection && (
                <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                  <span className="text-sm font-medium">Collection:</span>
                  <span className="text-sm capitalize">{image.collection}</span>
                </div>
              )}

              <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                <span className="text-sm font-medium">Uploaded By:</span>
                <span className="text-sm">{image.user?.name || 'Unknown'}</span>
              </div>

              <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                <span className="text-sm font-medium">Uploaded On:</span>
                <span className="text-sm">
                  {new Date(image.created_at).toLocaleDateString()} at {new Date(image.created_at).toLocaleTimeString()}
                </span>
              </div>

              {image.description && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">Description:</span>
                  <p className="text-sm whitespace-pre-wrap border rounded-md p-2 bg-muted/50">
                    {image.description}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <div className="flex gap-2 w-full justify-end">
            {onEdit && (
              <Button 
                variant="default"
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
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
