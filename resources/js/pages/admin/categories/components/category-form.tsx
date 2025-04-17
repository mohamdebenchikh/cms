import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, FileText, Image as ImageIcon, Upload, Trash2, PencilLine, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SlugInput } from '@/components/slug-input';
import { Switch } from '@/components/ui/switch';
import { CategoryFormData, CategoryFormProps } from '../types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageUploadDialog } from '@/components/image-upload-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CategoryForm({ category, mode, onSubmit, errors: serverErrors = {} }: CategoryFormProps) {
  // Check if image_cover is available in the category object
  const hasImageCoverField = category ? 'image_cover' in category : true;

  const { data, setData, processing, clearErrors } = useForm<CategoryFormData>({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image_cover: hasImageCoverField ? (category?.image_cover || null) : null,
    is_main: category?.is_main || false,
  });

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>(serverErrors);

  // Update errors when serverErrors change
  React.useEffect(() => {
    setErrors(serverErrors);
  }, [serverErrors]);

  const handleImageUploaded = (imageUrl: string) => {
    setData('image_cover', imageUrl);
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    // Don't clear errors here, let the parent component handle them
    // setErrors({});

    onSubmit(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display form errors if any */}
        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please correct the errors in the form before submitting.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-2 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {mode === 'create' ? 'Create Category' : 'Edit Category'}
              </CardTitle>
              <CardDescription>
                {mode === 'create'
                  ? 'Create a new category for organizing posts'
                  : 'Update category details'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Category Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium">Category Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  disabled={processing}
                  placeholder="Enter category name"
                  className={cn(errors.name ? "border-destructive" : "")}
                />
                {errors.name && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
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
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-medium">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={data.description || ''}
                  onChange={e => setData('description', e.target.value)}
                  disabled={processing}
                  placeholder="Enter category description"
                  className={cn(errors.description ? "border-destructive" : "")}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.description}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 border-t p-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
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
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Settings</CardTitle>
                <CardDescription>Configure category options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Category Switch */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_main" className="font-medium flex items-center gap-1 cursor-pointer">
                      <FolderTree className="h-4 w-4" /> Main Category
                    </Label>
                    <Switch
                      id="is_main"
                      checked={data.is_main}
                      onCheckedChange={(checked) => {
                        setData('is_main', checked);
                      }}
                      disabled={processing}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Main categories appear in the top navigation.
                  </p>
                </div>

                <Separator />

                {/* Cover Image */}
                {hasImageCoverField && (
                  <div className="space-y-3">
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsUploadDialogOpen(true);
                        }}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Image upload dialog - placed outside the form to prevent form submission issues */}
      <ImageUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onImageUploaded={handleImageUploaded}
        title={data.image_cover ? "Change Cover Image" : "Upload Cover Image"}
        description="Select or drag an image to use as the cover image for this category."
      />
    </>
  );
}
