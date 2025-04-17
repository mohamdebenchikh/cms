import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle, Upload, X, Image as ImageIcon, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Image } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getImageUrl } from '../utils';

interface ImageFormProps {
  mode: 'create' | 'edit';
  image?: Image;
  onSuccess?: () => void;
  onCancel?: () => void;
  redirectOnSuccess?: boolean;
}

export function ImageForm({
  mode,
  image,
  onSuccess,
  onCancel,
  redirectOnSuccess = true
}: ImageFormProps) {
  // State for file upload (create mode)
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // State for form data (both modes)
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [altText, setAltText] = useState('');
  const [description, setDescription] = useState('');
  const [collection, setCollection] = useState('');

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && image) {
      setTitle(image.title || '');
      setFileName(image.original_filename || image.filename || '');
      setAltText(image.alt_text || '');
      setDescription(image.description || '');
      setCollection(image.collection || 'none');

      // Set preview using getImageUrl if path is available, otherwise use url
      if (image.path) {
        setPreview(getImageUrl(image.path, image.disk || 'public'));
      } else if (image.url) {
        setPreview(image.url);
      }
    }
  }, [mode, image]);

  // File handling functions (for create mode)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setErrors({ file: 'Please select an image file' });
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrors({ file: 'Image size should not exceed 10MB' });
      return;
    }

    setFile(selectedFile);
    // Set initial values from filename
    const baseName = selectedFile.name.split('.')[0];
    setFileName(selectedFile.name);
    setTitle(baseName);
    setErrors({});

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    // Validate file type
    if (!droppedFile.type.startsWith('image/')) {
      setErrors({ file: 'Please select an image file' });
      return;
    }

    // Validate file size (max 10MB)
    if (droppedFile.size > 10 * 1024 * 1024) {
      setErrors({ file: 'Image size should not exceed 10MB' });
      return;
    }

    setFile(droppedFile);
    // Set initial values from filename
    const baseName = droppedFile.name.split('.')[0];
    setFileName(droppedFile.name);
    setTitle(baseName);
    setErrors({});

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (mode === 'create') {
      if (!file) {
        setErrors({ file: 'Please select an image file' });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      if (fileName) {
        formData.append('file_name', fileName);
      }

      if (altText) {
        formData.append('alt_text', altText);
      }

      if (description) {
        formData.append('description', description);
      }

      // Handle collection (convert 'none' to null)
      if (collection && collection !== 'none') {
        formData.append('collection', collection);
      } else {
        formData.append('collection', '');
      }

      router.post(route('admin.images.store'), formData, {
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success('Image uploaded successfully');

          if (onSuccess) {
            onSuccess();
          } else if (redirectOnSuccess) {
            router.visit(route('admin.images.index'));
          }
        },
        onError: (errors) => {
          setErrors(errors);
          setIsSubmitting(false);
        }
      });
    } else if (mode === 'edit' && image) {
      // Create a record with the form data
      const updateData: Record<string, string | null> = {
        title: title,
        file_name: fileName,
        alt_text: altText,
        description: description,
        collection: (collection && collection !== 'none') ? collection : null
      };

      router.put(route('admin.images.update', image.id), updateData, {
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success('Image updated successfully');

          if (onSuccess) {
            onSuccess();
          } else if (redirectOnSuccess) {
            router.visit(route('admin.images.index'));
          }
        },
        onError: (errors) => {
          setErrors(errors);
          setIsSubmitting(false);
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Image Upload/Preview Section */}
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-6">
            {mode === 'create' && !preview ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? 'border-primary bg-primary/5' :
                  errors.file ? 'border-destructive' :
                  'border-input hover:bg-muted/50'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="rounded-full bg-muted p-3">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Upload an image</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Drag and drop an image, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported formats: JPEG, PNG, GIF, SVG
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        console.error('Image failed to load:', preview);
                        e.currentTarget.src = '/placeholder-image.svg';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mb-2" />
                      <p>No image preview available</p>
                    </div>
                  )}
                </div>
                {mode === 'create' && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            {errors.file && (
              <p className="text-destructive text-sm flex items-center mt-2">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.file}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Fields Section */}
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? "border-destructive" : ""}
                placeholder="Enter a title for this image"
              />
              {errors.title && (
                <p className="text-destructive text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Filename */}
            <div className="space-y-2">
              <Label htmlFor="file_name">File Name</Label>
              <Input
                id="file_name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className={errors.file_name ? "border-destructive" : ""}
                placeholder="Enter a file name"
              />
              {errors.file_name && (
                <p className="text-destructive text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.file_name}
                </p>
              )}
            </div>

            {/* Collection */}
            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <Select
                value={collection || undefined}
                onValueChange={setCollection}
              >
                <SelectTrigger id="collection" className={errors.collection ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="posts">Posts</SelectItem>
                  <SelectItem value="pages">Pages</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="banners">Banners</SelectItem>
                </SelectContent>
              </Select>
              {errors.collection && (
                <p className="text-destructive text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.collection}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Group images by collection for easier organization
              </p>
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
              <Label htmlFor="alt_text">Alt Text</Label>
              <Input
                id="alt_text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image for accessibility"
                className={errors.alt_text ? "border-destructive" : ""}
              />
              {errors.alt_text && (
                <p className="text-destructive text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.alt_text}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description (optional)"
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-destructive text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting || (mode === 'create' && !file)}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    {mode === 'create' ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {mode === 'create' ? 'Upload Image' : 'Save Changes'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
