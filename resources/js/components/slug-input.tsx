import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface SlugInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  sourceValue: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  helpText?: string;
  generateButtonText?: string;
  onBlur?: () => void;
}

export function SlugInput({
  name,
  value,
  onChange,
  sourceValue,
  disabled = false,
  error,
  label = 'Slug',
  helpText = 'The slug is used in the URL. It should be unique and contain only letters, numbers, and hyphens.',
  generateButtonText = 'Generate from name',
  onBlur
}: SlugInputProps) {
  const generateSlug = () => {
    if (!sourceValue) return;
    
    // Convert to lowercase, replace spaces with hyphens, remove special characters
    const slug = sourceValue
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    onChange(slug);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="font-medium">{label}</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={generateSlug}
          disabled={!sourceValue || disabled}
          className="h-7 text-xs"
        >
          {generateButtonText}
        </Button>
      </div>
      <Input
        id={name}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder="enter-slug-here"
        className={error ? "border-destructive" : ""}
      />
      {error && (
        <p className="text-destructive text-sm flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
      {helpText && (
        <p className="text-xs text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}
