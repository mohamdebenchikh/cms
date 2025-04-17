import React from 'react';
import { MultiSelect } from './multi-select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Filter,
  Check,
  X,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FilterOption {
  value: string;
  label: string;
}

interface ImageFilterProps {
  collections: FilterOption[];
  selectedCollections: string[];
  onCollectionChange: (collections: string[]) => void;
  dateRange: {
    from: string | null;
    to: string | null;
  };
  onDateRangeChange: (range: { from: string | null; to: string | null }) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  fileType?: string;
  onFileTypeChange?: (fileType: string) => void;
  onReset: () => void;
}

export function ImageFilter({
  collections,
  selectedCollections,
  onCollectionChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortChange,
  onReset
}: ImageFilterProps) {
  // Count active filters
  const activeFilterCount = [
    selectedCollections.length > 0,
    dateRange.from !== null || dateRange.to !== null,
    sortBy !== 'created_at_desc'
  ].filter(Boolean).length;

  // Toggle collection selection
  const toggleCollection = (value: string) => {
    if (selectedCollections.includes(value)) {
      onCollectionChange(selectedCollections.filter(c => c !== value));
    } else {
      onCollectionChange([...selectedCollections, value]);
    }
  };

  // Handle date range changes
  const handleDateChange = (field: 'from' | 'to', value: string) => {
    onDateRangeChange({
      ...dateRange,
      [field]: value || null
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-dashed flex items-center gap-1"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 rounded-full px-1 py-0 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b flex-shrink-0">
            <SheetTitle>Image Filters</SheetTitle>
            <SheetDescription>
              Filter and sort your image gallery
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full max-h-[calc(100vh-180px)]" type="always">
              <div className="px-6 py-4 space-y-6">
              {/* Collections Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Collections</h3>
                  {selectedCollections.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCollectionChange([])}
                      className="h-8 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <MultiSelect
                  options={collections}
                  selected={selectedCollections}
                  onChange={onCollectionChange}
                  placeholder="Select collections..."
                  className="h-9"
                />
              </div>

              <Separator />

              {/* Date Range Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Date Range</h3>
                  {(dateRange.from || dateRange.to) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDateRangeChange({ from: null, to: null })}
                      className="h-8 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-date">From</Label>
                    <Input
                      id="from-date"
                      type="date"
                      value={dateRange.from || ''}
                      onChange={(e) => handleDateChange('from', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to-date">To</Label>
                    <Input
                      id="to-date"
                      type="date"
                      value={dateRange.to || ''}
                      onChange={(e) => handleDateChange('to', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Sort By Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Sort By</h3>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at_desc">Newest first</SelectItem>
                    <SelectItem value="created_at_asc">Oldest first</SelectItem>
                    <SelectItem value="file_name_asc">Name (A-Z)</SelectItem>
                    <SelectItem value="file_name_desc">Name (Z-A)</SelectItem>
                    <SelectItem value="file_size_asc">Size (smallest first)</SelectItem>
                    <SelectItem value="file_size_desc">Size (largest first)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              </div>
            </ScrollArea>
          </div>

          <SheetFooter className="px-6 py-4 border-t flex-shrink-0">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-muted-foreground">
                {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
              </p>
              <div className="flex gap-2">
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onReset}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reset All
                  </Button>
                )}
                <SheetClose asChild>
                  <Button size="sm">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Display active filters as badges */}
      <div className="flex flex-wrap gap-1 max-w-full overflow-x-auto py-1">
        {selectedCollections.map((collection) => {
          const collectionOption = collections.find(c => c.value === collection);
          return (
            <Badge
              key={collection}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span>{collectionOption?.label || collection}</span>
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleCollection(collection)}
              />
            </Badge>
          );
        })}

        {dateRange.from && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            <span>From: {new Date(dateRange.from).toLocaleDateString()}</span>
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleDateChange('from', '')}
            />
          </Badge>
        )}

        {dateRange.to && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            <span>To: {new Date(dateRange.to).toLocaleDateString()}</span>
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleDateChange('to', '')}
            />
          </Badge>
        )}

        {sortBy !== 'created_at_desc' && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            <span>
              {sortBy === 'created_at_asc' && 'Oldest first'}
              {sortBy === 'file_name_asc' && 'Name (A-Z)'}
              {sortBy === 'file_name_desc' && 'Name (Z-A)'}
              {sortBy === 'file_size_asc' && 'Size (smallest)'}
              {sortBy === 'file_size_desc' && 'Size (largest)'}
            </span>
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onSortChange('created_at_desc')}
            />
          </Badge>
        )}

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
