import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Loader2 } from 'lucide-react';
import { debounce } from 'lodash';

interface ImageSearchInputProps {
  initialValue?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function ImageSearchInput({
  initialValue = '',
  onSearch,
  placeholder = 'Search images...',
  debounceMs = 500,
  className = '',
}: ImageSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create a debounced search function
  const debouncedSearch = useRef(
    debounce((value: string) => {
      onSearch(value);
      setIsSearching(false);
    }, debounceMs)
  ).current;

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    onSearch('');
    
    // Focus the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative flex-1 ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        className="pl-8 pr-8"
      />
      
      {isSearching ? (
        <div className="absolute right-2.5 top-2.5">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : searchQuery ? (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-9 px-2"
          onClick={clearSearch}
          type="button"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
