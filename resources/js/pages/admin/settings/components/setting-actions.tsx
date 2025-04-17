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
import { Setting } from "../types";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

interface SettingActionsProps {
  setting: Setting;
}

export function SettingActions({ setting }: SettingActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    router.visit(route("admin.settings.edit", setting.id));
  };

  const handleDelete = () => {
    router.delete(route("admin.settings.destroy", setting.id), {
      onSuccess: () => {
        toast.success("Setting deleted successfully");
        setDeleteDialogOpen(false);
      },
      onError: () => {
        toast.error("Failed to delete setting");
      },
    });
  };

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 rounded-full hover:bg-muted data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={handleEdit} className="py-2">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Setting
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive py-2"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Setting
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        setting={setting}
      />
    </div>
  );
}
