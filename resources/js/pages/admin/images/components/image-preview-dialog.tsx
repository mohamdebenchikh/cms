import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogHeader
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Download,
  Copy,
  ExternalLink,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react';
import { Image } from '../types';
import { getImageUrl } from '../utils';

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image;
  onShowDetails?: () => void;
}

export function ImagePreviewDialog({ isOpen, onClose, image, onShowDetails }: ImagePreviewDialogProps) {
  // State for zoom level and rotation
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

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

  // Zoom in function
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  // Zoom out function
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  // Rotate image function
  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Reset zoom and rotation
  const resetView = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] md:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-center">
            {image.title || image.file_name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-full max-w-[700px] mx-auto rounded-md overflow-hidden bg-muted group">
            <div className="aspect-video w-full flex items-center justify-center">
              <img
                src={getImageSource()}
                alt={image.file_name}
                className="max-w-full max-h-full object-contain transition-all duration-200"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                }}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.svg';
                }}
              />
            </div>
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

          {/* Zoom controls */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={zoomOut}
              disabled={zoomLevel <= 0.5}
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              className="text-xs px-2"
            >
              {Math.round(zoomLevel * 100)}%
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={zoomIn}
              disabled={zoomLevel >= 3}
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={rotateImage}
              className="h-8 w-8 ml-2"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter className="px-2">
          <div className="flex flex-wrap gap-3 w-full justify-center">
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={() => window.open(getImageSource(), '_blank')}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={() => copyImageUrl(getImageSource())}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </Button>
            {onShowDetails && (
              <Button
                variant="outline"
                size="sm"
                className="px-3"
                onClick={() => {
                  onClose();
                  onShowDetails();
                }}
              >
                <Info className="mr-2 h-4 w-4" />
                View Details
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
