import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { router } from "@inertiajs/react";
import { useDataTable } from "@/components/data-table/data-table";
import { Tag } from "@/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BulkDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: number[];
}

export function BulkDeleteDialog({
  isOpen,
  onClose,
  selectedIds,
}: BulkDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const count = selectedIds.length;
  const { setRowSelection } = useDataTable<Tag>();

  const handleConfirm = () => {
    setIsDeleting(true);

    router.post(route('admin.tags.bulk-destroy'), {
      ids: selectedIds
    }, {
      onSuccess: () => {
        // Clear row selection after successful deletion
        setRowSelection({});
        onClose();

        // Show success toast message
        toast.success(`${count} ${count === 1 ? 'tag' : 'tags'} deleted successfully`);

        // Reload the page to show updated data
        window.location.reload();
      },
      onError: (errors) => {
        console.error('Bulk delete error:', errors);
        setIsDeleting(false);

        // Type guard to check if errors is an object with a message property
        if (errors && typeof errors === 'object' && 'message' in errors && typeof errors.message === 'string') {
          toast.error(errors.message);
        } else {
          toast.error('Failed to delete tags');
        }
      },
      onFinish: () => {
        setIsDeleting(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle>Delete {count} {count === 1 ? 'Tag' : 'Tags'}</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete {count} {count === 1 ? 'tag' : 'tags'}?
            <p className="mt-2 text-amber-500 font-medium">Note: Posts associated with these tags will be updated to no longer use these tags.</p>
            <p className="mt-2">This action cannot be undone.</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : `Delete ${count} ${count === 1 ? 'Tag' : 'Tags'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
