import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Circle,
  ImageIcon
} from 'lucide-react';
import { Image } from '../types';
import { debugImageLoading, getImageUrl } from '../utils';
import { ImageActionDropdown } from './image-action-dropdown';
import { ImagePreviewDialog } from './image-preview-dialog';

interface ImageCardProps {
  image: Image;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelect: (id: number, e?: React.MouseEvent) => void;
  onEdit: (image: Image) => void;
  onDelete: (image: Image) => void;
  onShowDetails?: (image: Image) => void;
}

export function ImageCard({
  image,
  isSelectionMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onShowDetails
}: ImageCardProps) {
  // State for preview dialog
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  const handleImageError = () => {
    setIsImageError(true);
    console.error(`Failed to load image: ${image.url}`);
    // Log detailed information for debugging
    debugImageLoading(image);
  };

  const handleImageLoad = () => {
    setIsImageError(false);
  };


  return (
    <div className="h-full">
      <div
        className={`overflow-hidden group relative rounded-md border bg-card text-card-foreground shadow ${isSelected ? 'ring-2 ring-primary' : ''} cursor-pointer h-full`}
        onClick={() => {
          if (!isSelectionMode) {
            setIsPreviewDialogOpen(true);
          }
        }}
      >
      {/* Selection Checkbox - Only visible in selection mode or when hovered/selected */}
      {(isSelectionMode || isSelected) && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 z-30 bg-background/80 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent's onClick
            onSelect(image.id, e);
          }}
        >
          {isSelected ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Dropdown Menu - Only visible on hover */}
      {!isSelectionMode && (
        <ImageActionDropdown
          image={image}
          onShowDetails={onShowDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      {/* Image Container */}
      <div className="aspect-square">
        {/* Image or Placeholder */}
        <div className="relative w-full h-full">
          {/* Always render the placeholder as a background */}
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <img
              src="/placeholder-image.svg"
              alt="Placeholder"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Only render the actual image if there's no error */}
          {!isImageError && (
            <img
              src={image.url || (image.path ? getImageUrl(image.path, image.disk || 'public') : '')}
              alt={image.file_name || 'Image'}
              className="absolute inset-0 w-full h-full object-cover z-10 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent's onClick
                if (isSelectionMode) {
                  onSelect(image.id);
                } else {
                  // Show preview dialog when clicking the image
                  setIsPreviewDialogOpen(true);
                }
              }}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}

          {/* Show error message if image failed to load */}
          {isImageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/50 text-white">
              <ImageIcon className="h-10 w-10 mb-2" />
              <span className="text-xs">Image not available</span>
              <span className="text-xs text-muted mt-1">{image.file_name}</span>
            </div>
          )}

          {/* Simple hover overlay with file name */}
          {!isSelectionMode && !isImageError && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col justify-between">
              {/* Bottom info */}
              <div className="w-full p-3 text-white mt-auto">
                <p className="text-sm font-medium truncate">{image.file_name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        isOpen={isPreviewDialogOpen}
        onClose={() => setIsPreviewDialogOpen(false)}
        image={image}
        onShowDetails={() => {
          setIsPreviewDialogOpen(false);
          if (onShowDetails) {
            onShowDetails(image);
          }
        }}
      />
    </div>
  );
}
