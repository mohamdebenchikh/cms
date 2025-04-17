import { createContext, useContext, ReactNode } from 'react';
import { useForm } from '@inertiajs/react';
import { PageFormData } from '../../types';
import { Page } from '@/types';

// Create context for the form
interface PageFormContextType {
  data: PageFormData;
  setData: unknown; // Using any to avoid type issues with Inertia's setData
  errors: Record<string, string>;
  processing: boolean;
  mode: 'create' | 'edit';
  page?: Page;
}

const PageFormContext = createContext<PageFormContextType | undefined>(undefined);

// Provider component
interface PageFormProviderProps {
  children: ReactNode;
  page?: Page;
  mode: 'create' | 'edit';
  errors?: Record<string, string>;
  onSubmit: (data: PageFormData) => void;
}

export function PageFormProvider({
  children,
  page,
  mode,
  errors: serverErrors = {},
  onSubmit,
}: PageFormProviderProps) {
  const { data, setData, processing } = useForm<PageFormData>({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    status: page?.status || 'draft',
  });

  const contextValue: PageFormContextType = {
    data,
    setData,
    errors: serverErrors,
    processing,
    mode,
    page,
  };

  return (
    <PageFormContext.Provider value={contextValue}>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(data);
      }}>
        {children}
      </form>
    </PageFormContext.Provider>
  );
}

// Hook to use the form context
export function usePageForm() {
  const context = useContext(PageFormContext);
  if (context === undefined) {
    throw new Error('usePageForm must be used within a PageFormProvider');
  }
  return context;
}

// Generate slug helper function
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Export all form components
export { PageFormToolbar } from './page-form-toolbar';
export { PageFormTitle } from './page-form-title';
export { PageFormContent } from './page-form-content';
export { PageFormSlug } from './page-form-slug';
export { PageFormStatus } from './page-form-status';
export type { PageFormData };
