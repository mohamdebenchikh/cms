import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newGroupName: string) => void;
  currentGroupName: string;
}

export function EditGroupDialog({
  isOpen,
  onClose,
  onConfirm,
  currentGroupName,
}: EditGroupDialogProps) {
  const [newGroupName, setNewGroupName] = useState(currentGroupName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Reset error state
    setError(null);

    // Validate input
    if (!newGroupName.trim()) {
      setError("Group name cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(newGroupName);
    } catch (err: any) {
      // Handle validation errors from the server
      if (err.errors && err.errors.new_group_name) {
        setError(err.errors.new_group_name[0]);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Rename Settings Group</DialogTitle>
          <DialogDescription className="pt-2">
            Change the name of the <span className="font-medium capitalize">"{currentGroupName}"</span> settings group.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="space-y-3">
            <Label htmlFor="group-name" className="text-base">New Group Name</Label>
            <Input
              id="group-name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              disabled={isSubmitting}
              className={cn("h-10", error && "border-destructive focus-visible:ring-destructive")}
              autoFocus
            />
            {error && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {error}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="px-4">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !newGroupName.trim()}
            className="px-4"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
