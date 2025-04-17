import { useState, useEffect } from "react";
import { Role, User } from "@/types";
import { router } from "@inertiajs/react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BadgeRole } from "./badge-role";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserRoleManagerProps {
  user: User;
  availableRoles: Role[];
  onClose: () => void;
}

export function RoleManager({ user, availableRoles, onClose }: UserRoleManagerProps) {
  const [open, setOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(user.roles || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleToggle = (role: Role) => {
    setSelectedRoles((current) => {
      // Check if the role is already selected
      const isSelected = current.some((r) => r.id === role.id);

      if (isSelected) {
        // Remove the role
        return current.filter((r) => r.id !== role.id);
      } else {
        // Add the role
        return [...current, role];
      }
    });
  };

  // Reset error when selection changes
  useEffect(() => {
    setError(null);
  }, [selectedRoles]);

  const handleSubmit = () => {
    // Validate that at least one role is selected
    if (selectedRoles.length === 0) {
      setError("Please select at least one role for the user");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Get the role IDs
    const roleIds = selectedRoles.map((role) => role.id);

    // Submit the form
    router.post(
      route("admin.users.roles.update", { user: user.id }),
      { roles: roleIds },
      {
        onSuccess: () => {
          toast.success("User roles updated successfully");
          setIsSubmitting(false);
          onClose(); // Close the dialog on success
        },
        onError: (errors) => {
          if (errors.roles) {
            setError(Array.isArray(errors.roles) ? errors.roles[0] : errors.roles);
          } else {
            setError("Failed to update user roles");
          }
          toast.error("Failed to update user roles");
          setIsSubmitting(false);
        },
        preserveScroll: true,
      }
    );
  };

  return (
    <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage User Roles</DialogTitle>
          <DialogDescription>
            Assign or remove roles for {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-sm font-medium">Current roles:</span>
            {selectedRoles.length > 0 ? (
              selectedRoles.map((role) => (
                <BadgeRole key={role.id} role={role} />
              ))
            ) : (
              <span className="text-muted-foreground text-xs">No roles assigned</span>
            )}
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                aria-invalid={error ? true : undefined}
              >
                Select roles to assign
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search role..." />
                <CommandEmpty>No role found.</CommandEmpty>
                <CommandGroup>
                  {availableRoles.map((role) => {
                    const isSelected = selectedRoles.some((r) => r.id === role.id);

                    return (
                      <CommandItem
                        key={role.id}
                        value={role.name}
                        onSelect={() => handleRoleToggle(role)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {role.name}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter className="flex justify-end gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => {
              // Reset selected roles to original state
              setSelectedRoles(user.roles || []);
              setError(null);
              onClose(); // Close the dialog
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
  );
}
