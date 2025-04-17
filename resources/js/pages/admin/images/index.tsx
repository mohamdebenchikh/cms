import React, { useState, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
// Removed unused imports
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
// Pagination components are now imported in the ImagePagination component
import {
  Plus,
  X,
  Image as ImageIcon,
  CheckCircle2,
  Circle,
  Trash,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { debounce } from 'lodash';
// Import components
import { ImageDeleteDialog } from './components/image-delete-dialog';
import { ImageCard } from './components/image-card';
import { ImageViewDialog } from './components/image-view-dialog';
import { ImageFilter } from './components/image-filter';
import { ImageSearchInput } from './components/image-search-input';
import { ImagePagination } from './components/image-pagination';
import { IndexProps, dashboardBreadcrumb, imagesBreadcrumb } from './types';

const breadcrumbs = [dashboardBreadcrumb, imagesBreadcrumb];

export default function Images({ images, filters }: IndexProps) {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });
  const [sortValue, setSortValue] = useState('created_at_desc');

  // State for dialogs
  const [selectedImage, setSelectedImage] = useState<typeof images.data[0] | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  // State for selection
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Handle search input change with debounce
  const handleSearchChange = debounce((value: string) => {
    router.get(
      route('admin.images.index'),
      { ...filters, search: value, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  }, 500);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    // If file_type is 'all', we want to remove it from the filters
    const updatedFilters = { ...filters };

    if (key === 'file_type' && value === 'all') {
      delete updatedFilters.file_type;
    } else {
      updatedFilters[key] = value;
    }

    router.get(
      route('admin.images.index'),
      { ...updatedFilters, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Handle collection filter changes
  const handleCollectionChange = (collections: string[]) => {
    setSelectedCollections(collections);
    const updatedFilters = { ...filters };

    if (collections.length > 0) {
      updatedFilters.collection = collections.join(',');
    } else {
      delete updatedFilters.collection;
    }

    router.get(
      route('admin.images.index'),
      { ...updatedFilters, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Handle date range filter changes
  const handleDateRangeChange = (range: { from: string | null; to: string | null }) => {
    setDateRange(range);
    const updatedFilters = { ...filters };

    if (range.from) {
      updatedFilters.from_date = range.from;
    } else {
      delete updatedFilters.from_date;
    }

    if (range.to) {
      updatedFilters.to_date = range.to;
    } else {
      delete updatedFilters.to_date;
    }

    router.get(
      route('admin.images.index'),
      { ...updatedFilters, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortValue(sort);
    const [field, direction] = sort.split('_');
    const updatedFilters = {
      ...filters,
      sort_field: field,
      sort_direction: direction.replace('_', '')
    };

    router.get(
      route('admin.images.index'),
      { ...updatedFilters, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCollections([]);
    setDateRange({ from: null, to: null });
    setSortValue('created_at_desc');
    setSearchQuery('');

    router.get(route('admin.images.index'), {
      page: 1,
      per_page: filters.per_page || 12
    });
  };



  // Handle edit action
  const handleEditImage = (image: typeof images.data[0]) => {
    router.visit(route('admin.images.edit', image.id));
  };

  // Handle image delete
  const handleImageDeleted = () => {
    setIsDeleteDialogOpen(false);
    toast.success('Image deleted successfully');
    router.reload();
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedImages.length === 0) return;

    router.post(route('admin.images.bulk-destroy'), {
      ids: selectedImages
    }, {
      onSuccess: () => {
        setSelectedImages([]);
        setIsSelectionMode(false);
        setIsBulkDeleteDialogOpen(false);
        toast.success(`${selectedImages.length} images deleted successfully`);
        router.reload();
      },
      onError: () => {
        toast.error('Failed to delete images');
      }
    });
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedImages([]);
    }
  };

  // Toggle image selection
  const toggleImageSelection = (imageId: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter(id => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  // Select all images
  const selectAllImages = useCallback(() => {
    if (selectedImages.length === images.data.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.data.map(image => image.id));
    }
  }, [selectedImages, images.data]);

  // Add keyboard shortcut for select all (Ctrl+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Ctrl+A when in selection mode
      if (isSelectionMode && e.ctrlKey && e.key === 'a') {
        e.preventDefault(); // Prevent default browser select all
        selectAllImages();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelectionMode, images.data, selectedImages, selectAllImages]);

  // Image management functions are now handled in the ImageActionDropdown component

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Images" />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Heading
            title="Images"
            description="Manage your media library"
          />

          <div className="flex gap-2">
            {isSelectionMode ? (
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={selectAllImages}
                        className="h-9"
                      >
                        {selectedImages.length === images.data.length ? (
                          <>
                            <Circle className="mr-2 h-4 w-4" />
                            Deselect All
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Select All
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select all images (Ctrl+A)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  variant="outline"
                  onClick={toggleSelectionMode}
                  className="bg-muted"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Selection
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={toggleSelectionMode}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Select Images
                </Button>

                <Button onClick={() => router.visit(route('admin.images.create'))}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>

              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions Toolbar - Visible when in selection mode */}
        {isSelectionMode && (
          <div className="flex items-center justify-between bg-muted p-2 rounded-md">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {selectedImages.length} of {images.data.length} selected
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedImages([])}
                disabled={selectedImages.length === 0}
                className="h-8"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Selection
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
                disabled={selectedImages.length === 0}
                className="h-8"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row justify-between">
          <ImageSearchInput
            initialValue={searchQuery}
            onSearch={(value) => {
              setSearchQuery(value);
              handleSearchChange(value);
            }}
            placeholder="Search images by name, description..."
            className="md:max-w-xs"
          />

          <div className="flex flex-col md:flex-row gap-2 items-center">
            <div className="flex-1">
              <ImageFilter
                collections={[
                  { value: 'posts', label: 'Posts' },
                  { value: 'pages', label: 'Pages' },
                  { value: 'users', label: 'Users' },
                  { value: 'banners', label: 'Banners' },
                  { value: 'none', label: 'Uncategorized' }
                ]}
                selectedCollections={selectedCollections}
                onCollectionChange={handleCollectionChange}
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                sortBy={sortValue}
                onSortChange={handleSortChange}
                onReset={resetFilters}
              />
            </div>

            {/* Per page select moved to footer */}
          </div>
        </div>

        {/* Active Filters - Removed in favor of the new ImageFilter component */}

        {/* Image Gallery */}
        {images.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.data.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                isSelectionMode={isSelectionMode}
                isSelected={selectedImages.includes(image.id)}
                onSelect={toggleImageSelection}
                onEdit={handleEditImage}
                onDelete={(image) => {
                  setSelectedImage(image);
                  setIsDeleteDialogOpen(true);
                }}
                onShowDetails={(image) => {
                  setSelectedImage(image);
                  setIsDetailsDialogOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No images found</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              {searchQuery ? 'Try adjusting your search or filters' : 'Upload your first image to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={() => router.visit(route('admin.images.create'))}>
                <Plus className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            )}
          </div>
        )}

        {/* Pagination and Per Page Select */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 border-t pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Show:</span>
              <Select
                value={filters.per_page?.toString() || '12'}
                onValueChange={(value) => handleFilterChange('per_page', value)}
                defaultValue="12"
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="36">36</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm">per page</span>
            </div>

            <ImagePagination
              meta={images}
              routeName="admin.images.index"
              filters={filters}
            />
          </div>
      </div>



      {/* We don't need a global preview dialog since each card has its own */}

      {/* Image Details Dialog */}
      {selectedImage && (
        <ImageViewDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          image={selectedImage}
          onEdit={handleEditImage}
        />
      )}

      {/* Delete Dialog */}
      {selectedImage && (
        <ImageDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          image={selectedImage}
          onImageDeleted={handleImageDeleted}
        />
      )}

      {/* Bulk Delete Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete these images?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              {selectedImages.length === 1 ? ' this image' : ` ${selectedImages.length} images`}
              from your media library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedImages.length} {selectedImages.length === 1 ? 'image' : 'images'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
