import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Edit,
  Trash2,
  Download,
  Copy,
  MoreVertical,
  Eye,
  FileEdit,
  Info
} from 'lucide-react';
import { Image } from '../types';
import { ImagePreviewDialog } from './image-preview-dialog';

interface ImageActionDropdownProps {
  image: Image;
  onShowDetails?: (image: Image) => void;
  onEdit?: (image: Image) => void;
  onDelete?: (image: Image) => void;
}

export function ImageActionDropdown({
  image,
  onShowDetails,
  onEdit,
  onDelete
}: ImageActionDropdownProps) {
  // State for preview dialog
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  // Copy image URL to clipboard
  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Image URL copied to clipboard');
  };

  return (
    <div
      className="absolute top-2 right-2 z-30"
      onClick={(e) => e.stopPropagation()} // Prevent triggering the parent's onClick
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 bg-background/90 backdrop-blur-sm shadow-sm hover:bg-background hover:shadow-md transition-all"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* View options */}
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsPreviewDialogOpen(true);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Image
          </DropdownMenuItem>

          {onShowDetails && (
            <DropdownMenuItem onClick={() => onShowDetails(image)}>
              <Info className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          )}

          {/* Edit options */}
          <DropdownMenuItem onClick={() => router.visit(route('admin.images.edit', image.id))}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Image
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Utility options */}
          <DropdownMenuItem onClick={() => copyImageUrl(image.url)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy URL
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => window.open(image.url, '_blank')}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>

          {/* Delete option */}
          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(image)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
