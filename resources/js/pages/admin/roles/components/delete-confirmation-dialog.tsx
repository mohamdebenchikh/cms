import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { router } from "@inertiajs/react";
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

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  role,
}: DeleteConfirmationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    
    router.delete(route("admin.roles.destroy", role.id), {
      onSuccess: () => {
        toast.success("Role deleted successfully");
        setIsDeleting(false);
        onClose();
      },
      onError: () => {
        toast.error("Failed to delete role");
        setIsDeleting(false);
      },
      preserveScroll: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Role
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the role <strong>{role.name}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Users with this role will lose access to features that require this role.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
