import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
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
  AlertCircle,
  Save
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image, ImageUpdateFormData } from '../types';
import { formatFileSize } from '../utils';

interface ImageDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image;
  onImageUpdated: () => void;
}

export function ImageDetailsDialog({ isOpen, onClose, image, onImageUpdated }: ImageDetailsDialogProps) {
  const [formData, setFormData] = useState<ImageUpdateFormData>({
    file_name: '',
    alt_text: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (image) {
      setFormData({
        file_name: image.file_name || '',
        alt_text: image.alt_text || '',
        description: image.description || '',
      });
    }
  }, [image]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    router.put(route('admin.images.update', image.id), formData, {
      onSuccess: () => {
        onImageUpdated();
      },
      onError: (errors) => {
        setErrors(errors);
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const copyImageUrl = () => {
    navigator.clipboard.writeText(image.url);
    toast.success('Image URL copied to clipboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Image Details</DialogTitle>
          <DialogDescription>
            View and edit image information
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 overflow-hidden">
          {/* Image Preview */}
          <div className="md:w-1/2 flex flex-col">
            <div className="rounded-md overflow-hidden border bg-muted/20 flex items-center justify-center h-[300px]">
              <img
                src={image.url}
                alt={image.alt_text || image.file_name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Type:</span>
                <span>{image.file_type}</span>
              </div>

              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Size:</span>
                <span>{formatFileSize(image.file_size)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Uploaded:</span>
                <span>{new Date(image.created_at).toLocaleDateString()}</span>
              </div>

              {image.user && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">By:</span>
                  <span>{image.user.name}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={copyImageUrl}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy URL
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(image.url, '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Name */}
              <div className="space-y-2">
                <Label htmlFor="file_name">File Name</Label>
                <Input
                  id="file_name"
                  value={formData.file_name}
                  onChange={(e) => setFormData({ ...formData, file_name: e.target.value })}
                  className={errors.file_name ? "border-destructive" : ""}
                />
                {errors.file_name && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.file_name}
                  </p>
                )}
              </div>

              {/* Alt Text */}
              <div className="space-y-2">
                <Label htmlFor="alt_text">Alt Text</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text || ''}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  placeholder="Describe the image for accessibility"
                  className={errors.alt_text ? "border-destructive" : ""}
                />
                {errors.alt_text && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.alt_text}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Describe the image for screen readers and SEO
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add a description (optional)"
                  className={errors.description ? "border-destructive" : ""}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.description}
                  </p>
                )}
              </div>

              <DialogFooter className="mt-4 px-0">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
