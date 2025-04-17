import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { router } from "@inertiajs/react";
import { useDataTable } from "@/components/data-table/data-table";
import { Post } from "@/types";
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
  const { setRowSelection } = useDataTable<Post>();

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      onClose();
      return;
    }

    setIsDeleting(true);

    router.post(route('admin.posts.bulk-destroy'), {
      ids: selectedIds
    }, {
      onSuccess: () => {
        // Clear row selection after successful deletion
        setRowSelection({});
        onClose();

        // Show success toast message
        toast.success(`${count} ${count === 1 ? 'post' : 'posts'} deleted successfully`);

      },
      onError: (errors) => {
        console.error('Bulk delete error:', errors);
        setIsDeleting(false);

        // Type guard to check if errors is an object with a message property
        if (errors && typeof errors === 'object' && 'message' in errors && typeof errors.message === 'string') {
          toast.error(errors.message);
        } else {
          toast.error('Failed to delete posts');
        }
      },
      onFinish: () => {
        setIsDeleting(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete {count} {count === 1 ? 'post' : 'posts'}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {count} {count === 1 ? 'post' : 'posts'}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

