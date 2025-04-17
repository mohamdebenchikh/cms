import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageUploadDialog } from '@/components/image-upload-dialog';
import { Image, Upload, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingFileUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  error?: string;
  settingKey: string;
}

export function SettingFileUpload({
  value,
  onChange,
  disabled = false,
  error,
  settingKey
}: SettingFileUploadProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleImageUploaded = (imageUrl: string) => {
    onChange(imageUrl);
  };

  const handleRemoveImage = () => {
    onChange(null);
  };

  const isLogo = settingKey === 'site_logo';
  const isFavicon = settingKey === 'favicon';

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative border rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-2 bg-muted/50">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="text-sm truncate max-w-[200px]">{value.split('/').pop()}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className={cn(
            "relative bg-muted/30 flex items-center justify-center p-4",
            isLogo ? "h-24" : isFavicon ? "h-16" : "h-32"
          )}>
            <img
              src={value}
              alt="Preview"
              className={cn(
                "max-w-full max-h-full object-contain",
                isFavicon ? "max-h-12" : ""
              )}
            />
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full h-16 flex items-center justify-center gap-2",
            error ? "border-destructive" : ""
          )}
          onClick={() => setIsUploadDialogOpen(true)}
          disabled={disabled}
        >
          <Upload className="h-4 w-4" />
          <span>Upload {isLogo ? "Logo" : isFavicon ? "Favicon" : "Image"}</span>
        </Button>
      )}

      <ImageUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onImageUploaded={handleImageUploaded}
        title={`Upload ${isLogo ? "Site Logo" : isFavicon ? "Favicon" : "Image"}`}
        description={
          isLogo 
            ? "Upload your site logo. Recommended size: 200×50 pixels." 
            : isFavicon 
              ? "Upload your site favicon. Recommended size: 32×32 pixels."
              : "Upload an image."
        }
      />
    </div>
  );
}
