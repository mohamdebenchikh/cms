import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onImageUploaded: (imageUrl: string) => void;
    title?: string;
    description?: string;
    collection?: string;
}

export function ImageUploadDialog({
    isOpen,
    onClose,
    onImageUploaded,
    title = "Upload Image",
    description = "Upload an image to use as the featured image for this post.",
    collection = "post-featured-images"
}: ImageUploadDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [altText, setAltText] = useState('');
    const [imageTitle, setImageTitle] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImageTitle(selectedFile.name.split('.')[0]);

            // Create a preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
            setImageTitle(droppedFile.name.split('.')[0]);

            // Create a preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(droppedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent propagation to parent forms

        if (!file) {
            setError('Please select an image');
            return;
        }

        setIsUploading(true);
        setError(null);

        // Create form data
        const formData = new FormData();
        formData.append('file', file);

        if (altText) {
            formData.append('alt_text', altText);
        }

        if (imageTitle) {
            formData.append('title', imageTitle);
        }

        formData.append('collection', collection);

        try {
            // Reset progress
            setUploadProgress(0);

            // Get the CSRF token from the meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            // Use Axios to upload the image
            console.log('Uploading image with form data:', Object.fromEntries(formData.entries()));
            const response = await axios.post(route('admin.images.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true, // Ensure cookies are sent with the request
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            });

            console.log('Axios response:', response.data);

            // Handle the response
            const data = response.data;

            // For admin.images.store route, we need to construct the URL
            if (response.status === 302 || response.status === 200) {
                // If it's a redirect or success but no URL in response
                const imageUrl = `/storage/${response.data.path || 'images/' + response.data.filename}`;
                onImageUploaded(imageUrl);
                resetForm();
                onClose();
                toast.success('Image uploaded successfully');
                return;
            }
            else if (data.success && data.url) {
                onImageUploaded(data.url);
                resetForm();
                onClose();
                toast.success('Image uploaded successfully');
            } else {
                setError('Failed to upload image: No URL returned');
                toast.error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            // @ts-expect-error - Axios error response structure
            const errorMessage = error.response?.data?.message || 'Failed to upload image';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setAltText('');
        setImageTitle('');
        setPreviewUrl(null);
        setError(null);
        setUploadProgress(0);
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
                <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Drag and drop area or file preview */}
                        <div
                            className={`border-2 ${error ? 'border-destructive' : 'border-dashed border-input'} rounded-md p-6 transition-colors ${!previewUrl ? 'hover:border-primary/50' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => !previewUrl && fileInputRef.current?.click()}
                        >
                            {previewUrl ? (
                                <div className="relative">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-48 object-contain rounded-md"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetForm();
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4 text-center">
                                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                    <div className="text-sm text-muted-foreground mb-1">
                                        Drag and drop an image, or click to select
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        PNG, JPG, GIF up to 10MB
                                    </div>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="flex items-center gap-2 text-destructive text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Image metadata fields */}
                        {file && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={imageTitle}
                                        onChange={(e) => setImageTitle(e.target.value)}
                                        placeholder="Image title"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="alt-text">Alt Text</Label>
                                    <Input
                                        id="alt-text"
                                        value={altText}
                                        onChange={(e) => setAltText(e.target.value)}
                                        placeholder="Describe the image for accessibility"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Progress bar - only show when uploading */}
                    {isUploading && (
                        <div className="py-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!file || isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                'Upload'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
