import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, FileText, Image as ImageIcon, Upload, Trash2, PencilLine } from 'lucide-react';
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
import { SlugInput } from '@/components/slug-input';
import { ImageUploadDialog } from '@/components/image-upload-dialog';
import { Category } from '@/types';
import { CategoryFormData } from '../types';
import { cn } from '@/lib/utils';

interface CategoryFormDialogProps {
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
}

export function CategoryFormDialog({ category, isOpen, onClose, mode }: CategoryFormDialogProps) {
  // Check if image_cover is available in the category object
  const hasImageCoverField = category ? 'image_cover' in category : true;

  const { data, setData, post, put, processing, errors, reset } = useForm<CategoryFormData>({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image_cover: hasImageCoverField ? (category?.image_cover || null) : null,
  });

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleImageUploaded = (imageUrl: string) => {
    setData('image_cover', imageUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      post(route('admin.categories.store'), {
        onSuccess: () => {
          toast.success('Category created successfully');
          handleClose();
        },
        onError: () => {
          toast.error('Failed to create category');
        },
      });
    } else if (mode === 'edit' && category) {
      put(route('admin.categories.update', category.id), {
        onSuccess: () => {
          toast.success('Category updated successfully');
          handleClose();
        },
        onError: () => {
          toast.error('Failed to update category');
        },
      });
    }
  };

  const handleClose = () => {
    console.log('Closing dialog and resetting form');
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {mode === 'create' ? 'Create Category' : 'Edit Category'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Create a new category for organizing posts'
                : 'Update category details'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium">Category Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    disabled={processing}
                    placeholder="Enter category name"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.name}
                    </p>
                  )}
                </div>

                <SlugInput
                  name="slug"
                  value={data.slug}
                  onChange={(value) => setData('slug', value)}
                  sourceValue={data.name}
                  disabled={processing}
                  error={errors.slug}
                  label="Slug"
                  helpText="The slug is used in the URL of the category page."
                  generateButtonText="Generate from name"
                />

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-medium">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={data.description || ''}
                    onChange={e => setData('description', e.target.value)}
                    disabled={processing}
                    placeholder="Enter category description"
                    className={errors.description ? "border-destructive" : ""}
                    rows={6}
                  />
                  {errors.description && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {hasImageCoverField && (
                  <div className="space-y-2">
                    <Label htmlFor="image_cover" className="font-medium">Cover Image (Optional)</Label>
                    {data.image_cover ? (
                      <div className="relative rounded-md overflow-hidden border border-input group">
                        <img
                          src={data.image_cover}
                          alt="Cover image"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {/* Edit button */}
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsUploadDialogOpen(true)}
                            className="text-xs"
                          >
                            <PencilLine className="h-4 w-4 mr-1" />
                            Change
                          </Button>

                          {/* Remove button */}
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setData('image_cover', null)}
                            className="text-xs"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "border-2 border-dashed border-input rounded-md p-4 flex flex-col items-center justify-center text-center h-48",
                          "hover:border-primary/50 cursor-pointer transition-colors",
                          errors.image_cover ? "border-destructive" : ""
                        )}
                        onClick={() => setIsUploadDialogOpen(true)}
                      >
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload a cover image</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsUploadDialogOpen(true);
                          }}
                          className="mt-2"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                    )}
                    {errors.image_cover && (
                      <p className="text-destructive text-sm flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.image_cover}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">Recommended size: 1200×400 pixels</p>
                  </div>
                )}

                <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
                  <h4 className="text-sm font-medium mb-2">Category Information</h4>
                  <ul className="text-xs space-y-2 text-muted-foreground">
                    <li>• Categories help organize your posts</li>
                    <li>• A post can belong to one category</li>
                    <li>• Categories can be displayed on your blog</li>
                    <li>• Adding a cover image makes categories more visually appealing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {processing ? 'Saving...' : mode === 'create' ? 'Create Category' : 'Update Category'}
            </Button>
          </DialogFooter>
        </form>

        {/* Image upload dialog - only render if hasImageCoverField is true */}
        {hasImageCoverField && (
          <ImageUploadDialog
            isOpen={isUploadDialogOpen}
            onClose={() => setIsUploadDialogOpen(false)}
            onImageUploaded={handleImageUploaded}
            title="Upload Category Cover Image"
            description="Select or drag an image to use as the cover image for this category."
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
