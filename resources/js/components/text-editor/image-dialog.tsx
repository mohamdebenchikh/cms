import React, { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Upload, Loader2, Image as ImageIcon, Link } from 'lucide-react';
import { toast } from 'sonner';

interface ImageDialogProps {
    editor: Editor;
    isOpen: boolean;
    onClose: () => void;
}

export function ImageDialog({ editor, isOpen, onClose }: ImageDialogProps) {
    // URL tab state
    const [url, setUrl] = useState('');
    const [alt, setAlt] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [activeTab, setActiveTab] = useState('upload');

    // Upload tab state
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageTitle, setImageTitle] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (url) {
            // Convert width and height to numbers if provided
            const widthValue = width ? parseInt(width, 10) : undefined;
            const heightValue = height ? parseInt(height, 10) : undefined;

            // Use setResizableImage instead of setImage
            editor
                .chain()
                .focus()
                .setResizableImage({
                    src: url,
                    alt: alt || undefined,
                    width: widthValue,
                    height: heightValue,
                })
                .createParagraphNear()
                .focus()
                .run();
        }

        resetForm();
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImageTitle(selectedFile.name.split('.')[0]);
            setAlt(selectedFile.name.split('.')[0]);

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
            setAlt(droppedFile.name.split('.')[0]);

            // Create a preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(droppedFile);
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError('Please select an image');
            return;
        }

        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        // Create form data
        const formData = new FormData();
        formData.append('image', file);

        if (alt) {
            formData.append('alt_text', alt);
        }

        if (imageTitle) {
            formData.append('title', imageTitle);
        }

        try {
            // Get the CSRF token from the meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            // Use Axios to upload the image
            const response = await axios.post(route('admin.images.upload'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                withCredentials: true, // Ensure cookies are sent with the request
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            });

            // Handle the response
            const data = response.data;

            if (data.success && data.url) {
                // Convert width and height to numbers if provided
                const widthValue = width ? parseInt(width, 10) : undefined;
                const heightValue = height ? parseInt(height, 10) : undefined;

                // Insert the image into the editor using setResizableImage
                editor
                    .chain()
                    .focus()
                    .setResizableImage({
                        src: data.url,
                        alt: alt || undefined,
                        width: widthValue,
                        height: heightValue,
                    })
                    .createParagraphNear()
                    .focus()
                    .run();

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
        setUrl('');
        setAlt('');
        setWidth('');
        setHeight('');
        setFile(null);
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
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Insert Image</DialogTitle>
                    <DialogDescription>
                        Upload an image or provide a URL to insert into your content.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload" className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Upload
                        </TabsTrigger>
                        <TabsTrigger value="url" className="flex items-center gap-2">
                            <Link className="h-4 w-4" />
                            URL
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-4">
                        <form onSubmit={handleUploadSubmit}>
                            <div className="grid gap-4">
                                {/* Drag and drop area or file preview */}
                                <div
                                    className={`border-2 ${error ? 'border-destructive' : 'border-dashed border-input'} rounded-md p-6 transition-colors ${!previewUrl ? 'hover:border-primary hover:bg-muted/30 cursor-pointer' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => !previewUrl && fileInputRef.current?.click()}
                                    style={{ minHeight: previewUrl ? 'auto' : '180px' }}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />

                                    {previewUrl ? (
                                        <div className="relative flex flex-col items-center">
                                            <div className="relative w-full max-w-md mx-auto">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-full max-h-[250px] object-contain rounded-md shadow-sm"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFile(null);
                                                        setPreviewUrl(null);
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = '';
                                                        }
                                                    }}
                                                >
                                                    ×
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {file?.name} ({Math.round(file?.size ? file.size / 1024 : 0)} KB)
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center h-full">
                                            <div className="bg-muted/40 p-4 rounded-full mb-3">
                                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm font-medium mb-2">Drag and drop an image here or click to browse</p>
                                            <p className="text-xs text-muted-foreground px-6 py-1 bg-muted/30 rounded-full">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <div className="text-destructive text-sm flex items-center gap-2 bg-destructive/10 px-3 py-2 rounded-md">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="image-alt-upload">
                                        Alt Text <span className="text-muted-foreground">(recommended)</span>
                                    </Label>
                                    <Input
                                        id="image-alt-upload"
                                        value={alt}
                                        onChange={(e) => setAlt(e.target.value)}
                                        placeholder="Image description for accessibility"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="image-width-upload">
                                            Width <span className="text-muted-foreground">(optional)</span>
                                        </Label>
                                        <Input
                                            id="image-width-upload"
                                            type="number"
                                            value={width}
                                            onChange={(e) => setWidth(e.target.value)}
                                            placeholder="Auto"
                                            min="50"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="image-height-upload">
                                            Height <span className="text-muted-foreground">(optional)</span>
                                        </Label>
                                        <Input
                                            id="image-height-upload"
                                            type="number"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            placeholder="Auto"
                                            min="50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar - only show when uploading */}
                            {isUploading && (
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <Progress value={uploadProgress} className="h-2" />
                                </div>
                            )}

                            <DialogFooter className="mt-4">
                                <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!file || isUploading}
                                    className="gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            Upload & Insert
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="url" className="mt-4">
                        <form onSubmit={handleUrlSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="image-url">Image URL</Label>
                                    <Input
                                        id="image-url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        autoFocus={activeTab === 'url'}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="image-alt-url">
                                        Alt Text <span className="text-muted-foreground">(recommended)</span>
                                    </Label>
                                    <Input
                                        id="image-alt-url"
                                        value={alt}
                                        onChange={(e) => setAlt(e.target.value)}
                                        placeholder="Image description for accessibility"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="image-width">
                                            Width <span className="text-muted-foreground">(optional)</span>
                                        </Label>
                                        <Input
                                            id="image-width"
                                            type="number"
                                            value={width}
                                            onChange={(e) => setWidth(e.target.value)}
                                            placeholder="Auto"
                                            min="50"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="image-height">
                                            Height <span className="text-muted-foreground">(optional)</span>
                                        </Label>
                                        <Input
                                            id="image-height"
                                            type="number"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            placeholder="Auto"
                                            min="50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="mt-4">
                                <Button type="button" variant="outline" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!url}
                                    className="gap-2"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    Insert Image
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
