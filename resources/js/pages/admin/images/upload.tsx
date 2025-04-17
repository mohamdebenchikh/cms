import React, { useState, useRef, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Upload, X, Image as ImageIcon, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { dashboardBreadcrumb, imagesBreadcrumb } from './types';

// Create a breadcrumb for the upload page
const uploadBreadcrumb = {
  title: "Upload",
  href: route('admin.images.upload-page'),
};

const breadcrumbs = [dashboardBreadcrumb, imagesBreadcrumb, uploadBreadcrumb];

interface FileWithPreview extends File {
  id: string;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  progress: number;
}

export default function Upload() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileWithPreview[] = Array.from(selectedFiles)
      .filter(file => file.type.startsWith('image/'))
      .map(file => {
        const id = Math.random().toString(36).substring(2, 11);
        return {
          ...file,
          id,
          preview: URL.createObjectURL(file),
          uploading: false,
          uploaded: false,
          progress: 0,
        };
      });

    setFiles(prev => [...prev, ...newFiles]);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag events
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
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  // Remove a file from the list
  const removeFile = (id: string) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(file => file.id !== id);
      return updatedFiles;
    });
  };

  // Upload a single file
  const uploadFile = async (file: FileWithPreview) => {
    // Skip if already uploading or uploaded
    if (file.uploading || file.uploaded) return;

    // Update file status
    setFiles(prev => 
      prev.map(f => 
        f.id === file.id ? { ...f, uploading: true, error: undefined } : f
      )
    );

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', altText);
    formData.append('caption', caption);

    try {
      const response = await axios.post(route('admin.images.store'), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setFiles(prev => 
              prev.map(f => 
                f.id === file.id ? { ...f, progress } : f
              )
            );
          }
        }
      });

      // Update file status to uploaded
      setFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { ...f, uploading: false, uploaded: true, progress: 100 } : f
        )
      );

      toast.success(`${file.name} uploaded successfully`);
    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Update file status with error
      setFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            uploading: false, 
            error: error.response?.data?.errors?.file || 'Upload failed' 
          } : f
        )
      );

      toast.error(`Failed to upload ${file.name}`);
    }
  };

  // Upload all files
  const uploadAllFiles = async () => {
    const filesToUpload = files.filter(file => !file.uploading && !file.uploaded);
    
    if (filesToUpload.length === 0) {
      toast.info('No new files to upload');
      return;
    }

    // Upload files sequentially to avoid overwhelming the server
    for (const file of filesToUpload) {
      await uploadFile(file);
    }

    toast.success('All files uploaded successfully');
  };

  // Clear all files
  const clearAllFiles = () => {
    // Revoke object URLs to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
    setFiles([]);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Upload Images" />

      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Heading
            title="Upload Images"
            description="Upload multiple images to your media library"
          />

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.visit(route('admin.images.index'))}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dropzone and File List */}
          <div className="md:col-span-2 space-y-6">
            {/* Dropzone */}
            <Card>
              <CardContent className="p-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-input hover:bg-muted/50'
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
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col items-center justify-center py-4">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {isDragging ? 'Drop images here' : 'Drag and drop images here'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse your files
                    </p>
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Select Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File List */}
            {files.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Selected Files ({files.length})</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearAllFiles}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear All
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={uploadAllFiles}
                        disabled={files.every(file => file.uploading || file.uploaded)}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload All
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {files.map((file) => (
                      <div 
                        key={file.id} 
                        className={`flex items-center gap-4 p-3 rounded-md border ${
                          file.error ? 'border-destructive bg-destructive/5' : 
                          file.uploaded ? 'border-green-500 bg-green-50' : 
                          'border-input'
                        }`}
                      >
                        {/* Preview */}
                        <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={file.preview} 
                            alt={file.name} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        
                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                          
                          {/* Progress or Status */}
                          {file.uploading && (
                            <div className="w-full mt-1">
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary" 
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Uploading: {file.progress}%
                              </p>
                            </div>
                          )}
                          
                          {file.error && (
                            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> {file.error}
                            </p>
                          )}
                          
                          {file.uploaded && (
                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                              <Check className="h-3 w-3" /> Uploaded successfully
                            </p>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex-shrink-0 flex gap-2">
                          {!file.uploading && !file.uploaded && (
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => uploadFile(file)}
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button 
                            variant={file.uploading ? "destructive" : "outline"} 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => removeFile(file.id)}
                            disabled={file.uploading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Image Details */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Image Details</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These details will be applied to all uploaded images.
                </p>

                <div className="space-y-4">
                  {/* Alt Text */}
                  <div className="space-y-2">
                    <Label htmlFor="alt_text">Alt Text</Label>
                    <Input
                      id="alt_text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Describe the image for accessibility"
                    />
                    <p className="text-xs text-muted-foreground">
                      Helps with accessibility and SEO
                    </p>
                  </div>

                  {/* Caption */}
                  <div className="space-y-2">
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea
                      id="caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Add a caption (optional)"
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
