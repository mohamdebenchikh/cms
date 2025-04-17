import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageUploadFormData } from '../types';
import axios from 'axios';

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUploaded: () => void;
}

export function ImageUploadDialog({ isOpen, onClose, onImageUploaded }: ImageUploadDialogProps) {
  const [formData, setFormData] = useState<ImageUploadFormData>({
    file: null as unknown as File,
    alt_text: '',
    caption: '',
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ file: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ file: 'Image size should not exceed 5MB' });
      return;
    }

    setFormData({ ...formData, file });
    setErrors({});

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setErrors({});

    if (!formData.file) {
      setErrors({ file: 'Please select an image file' });
      setIsUploading(false);
      return;
    }

    try {
      // Create form data for file upload
      const data = new FormData();
      data.append('file', formData.file);
      if (formData.alt_text) data.append('alt_text', formData.alt_text);
      if (formData.caption) data.append('caption', formData.caption);

      // Get the CSRF token from the meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      // Use axios for file upload
      await axios.post(route('admin.images.store'), data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
        withCredentials: true // Ensure cookies are sent with the request
      });

      onImageUploaded();
      resetForm();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error('Failed to upload image');
        console.error('Upload error:', error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      file: null as unknown as File,
      alt_text: '',
      caption: '',
    });
    setPreview(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Upload a new image to your media library
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label htmlFor="file">Image</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors ${
                errors.file ? 'border-destructive' : 'border-input'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-[200px] mx-auto rounded-md object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(null);
                      setFormData({ ...formData, file: null as unknown as File });
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="py-4">
                  <div className="flex justify-center mb-2">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>
              )}
            </div>
            {errors.file && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.file}
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
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={formData.caption || ''}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="Add a caption (optional)"
              className={errors.caption ? "border-destructive" : ""}
            />
            {errors.caption && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.caption}
              </p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || !formData.file}>
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
