import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { router } from "@inertiajs/react";
import { useDataTable } from "@/components/data-table/data-table";
import { Role } from "@/types";
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
  const { setRowSelection } = useDataTable<Role>();

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await router.post(route('admin.roles.bulk-destroy'), {
        ids: selectedIds
      }, {
        onSuccess: (response) => {
          // Clear row selection after successful deletion
          setRowSelection({});
          onClose();

          // Show success message
          if (response?.message) {
            toast.success(response.message);
          } else {
            toast.success(`${count} ${count === 1 ? 'role' : 'roles'} deleted successfully`);
          }
        },
        onError: (errors) => {
          toast.error(errors.message || 'Failed to delete roles');
        },
        preserveScroll: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle>Delete {count} {count === 1 ? 'Role' : 'Roles'}</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete {count} {count === 1 ? 'role' : 'roles'}? This action cannot be undone.
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
            {isDeleting ? "Deleting..." : `Delete ${count} ${count === 1 ? 'Role' : 'Roles'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
