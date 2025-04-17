import { useState } from 'react';
import { router } from '@inertiajs/react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Image } from '../types';

interface ImageDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image;
  onImageDeleted: () => void;
}

export function ImageDeleteDialog({ isOpen, onClose, image, onImageDeleted }: ImageDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    
    router.delete(route('admin.images.destroy', image.id), {
      onSuccess: () => {
        onImageDeleted();
      },
      onFinish: () => {
        setIsDeleting(false);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this image?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the image
            "{image.file_name}" and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 rounded-md overflow-hidden border w-full max-w-[200px] mx-auto">
          <img 
            src={image.url} 
            alt={image.file_name} 
            className="w-full h-auto object-cover" 
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
