import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

// Create a global bypass flag to temporarily disable the warning
let bypassWarning = false;

// Function to temporarily bypass the warning (e.g., when intentionally submitting a form)
export function bypassUnsavedChangesWarning(callback: () => void) {
  bypassWarning = true;
  try {
    callback();
  } finally {
    // Reset after a short delay to ensure the navigation completes
    setTimeout(() => {
      bypassWarning = false;
    }, 100);
  }
}
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

interface UnsavedChangesWarningProps {
  isDirty: boolean;
  onSave?: () => void;
  onDiscard?: () => void;
}

export function UnsavedChangesWarning({ isDirty, onSave, onDiscard }: UnsavedChangesWarningProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  // Handle Inertia navigation events
  useEffect(() => {
    const handleBeforeNavigate = (event: { detail: { visit: { url: string } } }) => {
      // Skip the warning if the bypass flag is set or if there are no unsaved changes
      if (bypassWarning || !isDirty) {
        return;
      }

      // Prevent the navigation
      event.preventDefault();

      // Store the URL we were trying to navigate to
      setPendingUrl(event.detail.visit.url);

      // Show the confirmation dialog
      setShowDialog(true);
    };

    // Add event listener for Inertia navigation
    document.addEventListener('inertia:before', handleBeforeNavigate as any);

    return () => {
      document.removeEventListener('inertia:before', handleBeforeNavigate as any);
    };
  }, [isDirty]);

  // Handle browser's beforeunload event (for page refreshes, closing tabs, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        // Standard way to show a confirmation dialog when closing the browser
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // Handle dialog actions
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setShowDialog(false);
  };

  const handleDiscard = () => {
    if (onDiscard) {
      onDiscard();
    }
    setShowDialog(false);

    // Continue with the navigation if we have a pending URL
    if (pendingUrl) {
      router.visit(pendingUrl);
      setPendingUrl(null);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setPendingUrl(null);
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes that will be lost if you leave this page. What would you like to do?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDiscard} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Discard Changes
          </AlertDialogAction>
          <AlertDialogAction onClick={handleSave}>Save Changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
