import React from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, FileText } from 'lucide-react';
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
import { SlugInput } from '@/components/slug-input';
import { Tag } from '@/types';
import { TagFormData } from '../types';

interface TagFormDialogProps {
  tag?: Tag;
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
}

export function TagFormDialog({ tag, isOpen, onClose, mode }: TagFormDialogProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm<TagFormData>({
    name: tag?.name || '',
    slug: tag?.slug || '',
  });

  // We'll use the SlugInput component which handles slug generation

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      post(route('admin.tags.store'), {
        // Don't set headers here to ensure it uses Inertia's default behavior
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Tag created successfully');
          handleClose();
        },
        onError: (errors) => {
          if (errors.name) {
            toast.error(errors.name);
          } else if (errors.slug) {
            toast.error(errors.slug);
          } else {
            toast.error('Failed to create tag');
          }
        },
      });
    } else if (mode === 'edit' && tag) {
      put(route('admin.tags.update', tag.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Tag updated successfully');
          handleClose();
        },
        onError: (errors) => {
          if (errors.name) {
            toast.error(errors.name);
          } else if (errors.slug) {
            toast.error(errors.slug);
          } else {
            toast.error('Failed to update tag');
          }
        },
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {mode === 'create' ? 'Create Tag' : 'Edit Tag'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Create a new tag for organizing posts'
                : 'Update tag details'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium">Tag Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                disabled={processing}
                placeholder="Enter tag name"
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
              helpText="The slug is used in the URL of the tag page. It should be unique and contain only letters, numbers, and hyphens."
              generateButtonText="Generate from name"
            />
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
              {processing ? 'Saving...' : mode === 'create' ? 'Create Tag' : 'Update Tag'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
