import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { router } from "@inertiajs/react";
import { useDataTable } from "@/components/data-table/data-table";
import { Page } from "@/types";
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
  const { setRowSelection } = useDataTable<Page>();

  const handleDelete = () => {
    setIsDeleting(true);
    router.post(route("admin.pages.bulk-destroy"), { ids: selectedIds }, {
      onSuccess: () => {
        toast.success(`${count} ${count === 1 ? 'page' : 'pages'} deleted successfully`);
        setRowSelection({});
        onClose();
      },
      onError: (errors) => {
        if (errors.message) {
          toast.error(errors.message);
        } else {
          toast.error(`Failed to delete ${count} ${count === 1 ? 'page' : 'pages'}`);
        }
      },
      onFinish: () => {
        setIsDeleting(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isDeleting && !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {count} {count === 1 ? 'page' : 'pages'}? This action cannot be undone.
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
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
