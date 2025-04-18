import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, PlusCircle, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import axios from 'axios';

export interface TagOption {
  label: string;
  value: string;
}

interface TagInputProps {
  options: TagOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  allowCreation?: boolean;
  className?: string;
  createTagEndpoint?: string;
  onTagCreated?: (newTag: { id: number; name: string }) => void;
}

export function TagInput({
  options,
  selected,
  onChange,
  placeholder = 'Select tags...',
  disabled = false,
  error,
  allowCreation = true,
  className,
  createTagEndpoint = '/admin/tags',
  onTagCreated,
}: TagInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options that match the input value
  const displayOptions = inputValue === ''
    ? options
    : options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );

  // Check if the current input value doesn't match any existing option
  const isNewTag = inputValue !== '' &&
    !options.some((option) =>
      option.label.toLowerCase() === inputValue.toLowerCase()
    );

  const handleSelect = (value: string) => {
    // If already selected, remove it
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      // Otherwise add it
      onChange([...selected, value]);
    }
  };

  const handleCreateTag = async () => {
    if (!inputValue.trim() || !allowCreation || isCreating) return;

    setIsCreating(true);

    try {
      // Prepare the tag data
      const tagData = {
        name: inputValue.trim(),
        slug: inputValue.trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, ''),
      };

      // Use axios for tag creation to get JSON response
      try {
        // Make sure we're explicitly requesting JSON
        const response = await axios.post(createTagEndpoint, tagData, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        // Handle successful JSON response
        if (response.data && response.data.success) {
          const newTag = response.data.tag;

          // Call the onTagCreated callback if provided
          if (onTagCreated) {
            onTagCreated(newTag);
          }

          // Add the new tag to the selected list
          onChange([...selected, newTag.id.toString()]);

          // Clear the input
          setInputValue('');

          toast.success('Tag created successfully');
          setIsCreating(false);
          return;
        }
      } catch (axiosError) {
        // If axios request fails, fall back to Inertia
        console.log('Axios request failed, falling back to Inertia', axiosError);
      }

      // Fall back to Inertia if axios fails or doesn't return expected response
      router.post(createTagEndpoint, tagData, {
        preserveScroll: true,
        onSuccess: (page) => {
          // Extract the newly created tag from the response
          const newTag = page.props.flash?.tag || {
            id: Date.now(), // Fallback ID if not provided
            name: inputValue.trim()
          };

          // Call the onTagCreated callback if provided
          if (onTagCreated) {
            onTagCreated(newTag);
          }

          // Add the new tag to the selected list
          onChange([...selected, newTag.id.toString()]);

          // Clear the input
          setInputValue('');

          toast.success('Tag created successfully');
        },
        onError: (errors) => {
          if (errors.name) {
            toast.error(errors.name);
          } else {
            toast.error('Failed to create tag');
          }
        }
      });
    } catch (error) {
      toast.error('Failed to create tag');
      console.error('Error creating tag:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && isNewTag && !isCreating) {
      e.preventDefault();
      handleCreateTag();
    }
  };

  // Focus the input when the popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              error ? "border-destructive" : "",
              className
            )}
            disabled={disabled}
          >
            {selected.length > 0
              ? `${selected.length} tag${selected.length > 1 ? 's' : ''} selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command onKeyDown={handleKeyDown}>
            <CommandInput
              placeholder="Search or create a tag..."
              value={inputValue}
              onValueChange={setInputValue}
              ref={inputRef}
            />
            <CommandList>
              <CommandEmpty>
                {allowCreation && inputValue ? (
                  <div className="py-2 px-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleCreateTag}
                      disabled={isCreating}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create "{inputValue}"
                    </Button>
                  </div>
                ) : (
                  <p className="py-3 px-2 text-center text-sm">No tags found.</p>
                )}
              </CommandEmpty>
              {displayOptions.length > 0 && (
                <CommandGroup>
                  {displayOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {isNewTag && allowCreation && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleCreateTag}
                      disabled={isCreating}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create "{inputValue}"
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return (
              <Badge
                key={value}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                {option?.label || value}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleSelect(value)}
                />
              </Badge>
            );
          })}
        </div>
      )}

      {error && (
        <p className="text-destructive text-sm flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}
