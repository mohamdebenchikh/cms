import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditGroupDialog } from "./edit-group-dialog";
import { DeleteGroupDialog } from "./delete-group-dialog";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface GroupHeaderActionsProps {
  group: string;
}

export function GroupHeaderActions({ group }: GroupHeaderActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditGroup = (newGroupName: string) => {
    return new Promise((resolve, reject) => {
      router.patch(route("admin.settings.update-group-name", group), {
        new_group_name: newGroupName,
      }, {
        onSuccess: () => {
          toast.success("Group name updated successfully");
          setEditDialogOpen(false);
          resolve(true);
        },
        onError: (errors) => {
          toast.error("Failed to update group name");
          reject(errors);
        },
      });
    });
  };

  const handleDeleteGroup = () => {
    router.delete(route("admin.settings.destroy-group", group), {
      onSuccess: () => {
        toast.success("Group deleted successfully");
        setDeleteDialogOpen(false);
      },
      onError: () => {
        toast.error("Failed to delete group");
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        type="button"
        className="h-9 px-3 text-sm font-medium"
        onClick={() => setEditDialogOpen(true)}
      >
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        type="button"
        className="h-9 px-3 text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive/50"
        onClick={() => setDeleteDialogOpen(true)}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>

      {/* Edit Group Dialog */}
      <EditGroupDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onConfirm={handleEditGroup}
        currentGroupName={group}
      />

      {/* Delete Group Dialog */}
      <DeleteGroupDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteGroup}
        group={group}
      />
    </div>
  );
}
