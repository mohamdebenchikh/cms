import { useEffect } from 'react';
import { UnsavedChangesWarning, bypassUnsavedChangesWarning } from '@/components/unsaved-changes-warning';
import { usePostForm } from './post-form-context';

interface PostFormUnsavedChangesWarningProps {
  onSave?: () => void;
  onExpose?: (resetFn: () => void) => void;
}

export function PostFormUnsavedChangesWarning({ onSave, onExpose }: PostFormUnsavedChangesWarningProps) {
  const { isDirty, handleSubmit, resetDirtyState } = usePostForm();

  // Expose the resetDirtyState function to the parent component
  useEffect(() => {
    if (onExpose) {
      onExpose(resetDirtyState);
    }
  }, [resetDirtyState, onExpose]);

  const handleSaveChanges = () => {
    // Use the bypass function to prevent the warning from showing again
    bypassUnsavedChangesWarning(() => {
      // First, use the provided onSave function if available
      if (onSave) {
        onSave();
      } else {
        // Otherwise, use the default form submission handler
        // We need to create a synthetic event that has preventDefault
        const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
        handleSubmit(syntheticEvent);
      }
    });

    // Note: We don't reset the dirty state here because the form submission is asynchronous
    // The resetDirtyState will be called by the parent component after successful submission
  };

  return (
    <UnsavedChangesWarning
      isDirty={isDirty}
      onSave={handleSaveChanges}
      onDiscard={resetDirtyState}
    />
  );
}
