import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AlertCircle, Camera, Trash2 } from 'lucide-react';
import { useInitials } from '@/hooks/use-initials';
import InputError from '@/components/input-error';
import { ImageUploadDialog } from '@/components/image-upload-dialog';

interface AvatarUploadProps {
  initialAvatar?: string;
  userName: string;
  onAvatarChange: (avatarUrl: string) => void;
  error?: string;
}

export function AvatarUpload({ initialAvatar, userName, onAvatarChange, error }: AvatarUploadProps) {
  const [avatar, setAvatar] = useState<string | undefined>(initialAvatar);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const getInitials = useInitials();

  const handleAvatarUploaded = (imageUrl: string) => {
    setAvatar(imageUrl);
    onAvatarChange(imageUrl);
  };

  const handleRemoveAvatar = () => {
    setAvatar(undefined);
    onAvatarChange('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24 cursor-pointer" onClick={() => setIsDialogOpen(true)}>
          <AvatarImage src={avatar} alt={userName} />
          <AvatarFallback className="text-2xl bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Camera className="h-4 w-4" />
            {avatar ? 'Change Avatar' : 'Upload Avatar'}
          </Button>

          {avatar && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveAvatar}
              className="flex items-center gap-1 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {error && (
        <InputError message={error} />
      )}

      <p className="text-xs text-muted-foreground text-center">
        Upload a profile picture (max 2MB)
      </p>

      {/* Image Upload Dialog */}
      <ImageUploadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onImageUploaded={handleAvatarUploaded}
        title="Upload Avatar"
        description="Upload a profile picture (max 2MB)"
        collection="avatars"
      />
    </div>
  );
}
