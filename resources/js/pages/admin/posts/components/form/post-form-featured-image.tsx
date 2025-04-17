import { Button } from "@/components/ui/button";
import { AlertCircle, Image, Upload, Trash2, PencilLine } from "lucide-react";
import { usePostForm } from "./post-form-context";
import { useState } from "react";
import { ImageUploadDialog } from "@/components/image-upload-dialog";
import { cn } from "@/lib/utils";

export function PostFormFeaturedImage() {
  const { form, errors } = usePostForm();
  const { data, setData } = form;
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleImageUploaded = (imageUrl: string) => {
    setData('featured_image', imageUrl);
  };

  return (
    <div className="space-y-2">
      {data.featured_image ? (
        <div className="relative rounded-md overflow-hidden border border-input group">
          <img
            src={data.featured_image}
            alt="Featured image"
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
              onClick={() => setData('featured_image', null)}
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
            "border-2 border-dashed border-input rounded-md p-6 flex flex-col items-center justify-center text-center",
            "hover:border-primary/50 cursor-pointer transition-colors",
            errors.featured_image ? "border-destructive" : ""
          )}
          onClick={() => setIsUploadDialogOpen(true)}
        >
          <Image className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Click to upload a featured image</p>
          <p className="text-xs text-muted-foreground">Supports: JPG, PNG, GIF, WebP (Max 10MB)</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsUploadDialogOpen(true);
            }}
            className="mt-4"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </div>
      )}

      {/* Image upload dialog */}
      <ImageUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onImageUploaded={handleImageUploaded}
        title={data.featured_image ? "Change Featured Image" : "Upload Featured Image"}
        description="Select or drag an image to use as the featured image for this post."
      />
      {errors.featured_image && (
        <p className="text-destructive text-sm flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errors.featured_image}
        </p>
      )}
      <p className="text-xs text-muted-foreground">Recommended size: 1200×630 pixels</p>
    </div>
  );
}
