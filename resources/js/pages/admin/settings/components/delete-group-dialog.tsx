import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  group: string;
}

export function DeleteGroupDialog({
  isOpen,
  onClose,
  onConfirm,
  group,
}: DeleteGroupDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isDeleting && !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <div className="bg-destructive/10 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-xl text-center mb-2">
            Delete Settings Group
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete the <strong className="capitalize">{group}</strong> settings group?
            This will delete all settings in this group. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 px-1">
          <div className="bg-muted/30 p-4 rounded-md border border-muted">
            <p className="text-sm text-muted-foreground">
              All settings in this group will be permanently deleted. Any functionality that depends on these settings may stop working.
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isDeleting} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 sm:flex-none"
          >
            {isDeleting ? "Deleting..." : "Delete Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
