import { useState } from "react";
import { router } from "@inertiajs/react";
import { Pencil, Trash, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditGroupDialog } from "./edit-group-dialog";
import { DeleteGroupDialog } from "./delete-group-dialog";

interface GroupActionsProps {
  group: string;
}

export function GroupActions({ group }: GroupActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditGroup = (newGroupName: string) => {
    router.patch(route("admin.settings.update-group-name", group), {
      new_group_name: newGroupName,
    }, {
      onSuccess: () => {
        toast.success("Group name updated successfully");
        setEditDialogOpen(false);
      },
      onError: () => {
        toast.error("Failed to update group name");
      },
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
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-muted data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)} className="py-2">
            <Pencil className="mr-2 h-4 w-4" />
            Rename Group
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive py-2"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
