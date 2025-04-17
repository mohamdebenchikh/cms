import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Category, Post, Tag } from '@/types';
import { UseFormReturn } from '@inertiajs/react';

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string; // Single category ID
  category_ids: string[]; // Keep for backward compatibility
  tags: number[];
  status: string;
  featured_image: string | null;
  is_featured: boolean;
  seo_title: string;
  seo_keywords: string;
  seo_description: string;
  [key: string]: string | number | number[] | string[] | null | undefined | boolean;
}

interface PostFormContextType {
  form: UseFormReturn<PostFormData>;
  post?: Post;
  categories: Category[];
  tags: Tag[];
  mode: 'create' | 'edit';
  errors: Record<string, string>;
  handleSubmit: (e: React.FormEvent) => void;
  onDelete?: (id: number) => void;
  isDirty: boolean;
  resetDirtyState: () => void;
}

const PostFormContext = createContext<PostFormContextType | undefined>(undefined);

export function usePostForm() {
  const context = useContext(PostFormContext);
  if (!context) {
    throw new Error('usePostForm must be used within a PostFormProvider');
  }
  return context;
}

interface PostFormProviderProps {
  children: ReactNode;
  form: UseFormReturn<PostFormData>;
  post?: Post;
  categories: Category[];
  tags: Tag[];
  mode: 'create' | 'edit';
  errors: Record<string, string>;
  onSubmit: (data: PostFormData) => void;
  onDelete?: (id: number) => void;
}

export function PostFormProvider({
  children,
  form,
  post,
  categories,
  tags,
  mode,
  errors,
  onSubmit,
  onDelete,
}: PostFormProviderProps) {
  const { data, setData } = form;

  // Track if the form has unsaved changes
  const [isDirty, setIsDirty] = useState(false);
  const [initialData, setInitialData] = useState(JSON.stringify(data));

  // Reset the dirty state (e.g., after saving)
  const resetDirtyState = () => {
    setInitialData(JSON.stringify(data));
    setIsDirty(false);
  };

  // Check for changes whenever form data changes
  useEffect(() => {
    const currentData = JSON.stringify(data);
    setIsDirty(currentData !== initialData);
  }, [data, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare the form data
    const formData = { ...data };

    // Ensure category_id is properly formatted
    if (formData.category_id === 'none') {
      formData.category_id = ''; // Convert 'none' to empty string for the backend
    }

    // Ensure category_ids is consistent with category_id for backward compatibility
    formData.category_ids = formData.category_id ? [formData.category_id] : [];

    onSubmit(formData);
  };

  // Slug generation is now handled by the SlugInput component

  return (
    <PostFormContext.Provider
      value={{
        form,
        post,
        categories,
        tags,
        mode,
        errors,
        handleSubmit,
        onDelete,
        isDirty,
        resetDirtyState,
      }}
    >
      {children}
    </PostFormContext.Provider>
  );
}
