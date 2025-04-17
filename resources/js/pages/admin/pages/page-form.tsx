import { Page } from '@/types';
import {
  PageFormProvider,
  PageFormToolbar,
  PageFormTitle,
  PageFormContent,
  PageFormSlug,
  PageFormStatus,
  PageFormData
} from './components/form';

interface PageFormProps {
  page?: Page;
  mode: 'create' | 'edit';
  onSubmit: (data: PageFormData) => void;
  errors?: Record<string, string>;
}

export default function PageForm({ page, mode, onSubmit, errors = {} }: PageFormProps) {
  return (
    <PageFormProvider
      page={page}
      mode={mode}
      onSubmit={onSubmit}
      errors={errors}
    >
      <div className="flex flex-col h-full w-full">
        {/* Top Toolbar - Fixed at the top */}
        <div className="sticky top-0 z-50 w-full">
          <PageFormToolbar />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden h-full">
          {/* Content Column */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* Title Input */}
            <PageFormTitle />

            {/* Slug Input */}
            <PageFormSlug />

            {/* Status Dropdown */}
            <PageFormStatus />

            {/* Content Editor */}
            <PageFormContent />
          </div>
        </div>
      </div>
    </PageFormProvider>
  );
}
