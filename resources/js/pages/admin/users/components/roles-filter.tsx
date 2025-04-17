import { useEffect, useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { Role } from "@/types";
import { router } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

// Define a custom type for the "no role" option
interface NoRoleOption {
    id: 'no_role';
    name: string;
    guard_name?: string;
    created_at?: string;
    updated_at?: string;
}

// Union type for Role or NoRoleOption
type RoleOrNoRole = Role | NoRoleOption;

// Helper to check if a role is the "no role" option
const isNoRoleOption = (role: RoleOrNoRole): role is NoRoleOption => {
    return role.id === 'no_role';
};

export interface RolesFilterProps {
    roles: Role[];
    selectedRoleIds: (number | string)[] | null;
    baseUrl: string;
}

export function RolesFilter({
    roles,
    selectedRoleIds,
    baseUrl,
}: RolesFilterProps) {
    const [open, setOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<RoleOrNoRole[]>([]);

    // Initialize selected roles from props
    useEffect(() => {
        if (selectedRoleIds && selectedRoleIds.length > 0) {
            // Handle the special "no_role" case
            if (selectedRoleIds.includes('no_role')) {
                const noRoleOption: NoRoleOption = { id: 'no_role', name: 'No role' };
                const regularRoles = roles.filter(role =>
                    selectedRoleIds.includes(role.id) || selectedRoleIds.includes(role.id.toString())
                );
                setSelectedRoles([...regularRoles, noRoleOption]);
            } else {
                const selected = roles.filter(role =>
                    selectedRoleIds.includes(role.id) || selectedRoleIds.includes(role.id.toString())
                );
                setSelectedRoles(selected);
            }
        } else {
            setSelectedRoles([]);
        }
    }, [selectedRoleIds, roles]);

    const handleSelect = (role: Role | null) => {
        // Check if the role is already selected
        const isSelected = role === null
            ? selectedRoles.some(r => r.id === 'no_role')
            : selectedRoles.some(r => r.id === role.id);

        // Toggle the role selection
        let newSelectedRoles: RoleOrNoRole[];
        if (isSelected) {
            newSelectedRoles = selectedRoles.filter(r =>
                role === null ? r.id !== 'no_role' : r.id !== role.id
            );
        } else {
            newSelectedRoles = [...selectedRoles];
            if (role === null) {
                const noRoleOption: NoRoleOption = { id: 'no_role', name: 'No role' };
                newSelectedRoles.push(noRoleOption);
            } else {
                newSelectedRoles.push(role);
            }
        }

        setSelectedRoles(newSelectedRoles);
    };

    const handleApplyFilter = () => {
        // Get the role IDs
        const roleIds = selectedRoles.map(role => isNoRoleOption(role) ? role.id : role.id.toString());

        // Navigate to the filtered URL
        router.get(
            baseUrl,
            {
                role_ids: roleIds.length > 0 ? roleIds : null,
                page: 1 // Reset to first page when filtering
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['users', 'filters']
            }
        );

        setOpen(false);
    };

    const handleClearFilter = () => {
        setSelectedRoles([]);

        // Navigate to the URL without role filter
        router.get(
            baseUrl,
            {
                role_ids: null,
                page: 1
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['users', 'filters']
            }
        );

        setOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 rounded-md flex items-center gap-1 bg-background border-input border-dashed hover:bg-accent hover:text-accent-foreground"
                    >
                        <PlusCircle className="size-4 mr-1.5"/>
                        {selectedRoles.length > 0 ? (
                            <>Roles ({selectedRoles.length})</>
                        ) : (
                            <>Roles</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search roles..." />
                        <CommandList>
                            <CommandEmpty>No roles found.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => handleSelect(null)}
                                    className="flex items-center gap-2"
                                >
                                    <Checkbox
                                        checked={selectedRoles.some(r => r.id === 'no_role')}
                                        className={cn(
                                            "mr-2",
                                            selectedRoles.some(r => r.id === 'no_role') ? "opacity-100" : "opacity-70"
                                        )}
                                    />
                                    <span>No role</span>
                                </CommandItem>
                                {roles.map((role) => {
                                    const isSelected = selectedRoles.some(r => r.id === role.id);
                                    return (
                                        <CommandItem
                                            key={role.id}
                                            onSelect={() => handleSelect(role)}
                                            className="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                className={cn(
                                                    "mr-2",
                                                    isSelected ? "opacity-100" : "opacity-70"
                                                )}
                                            />
                                            <span>{role.name}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup>
                                <div className="flex items-center justify-between p-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleClearFilter}
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleApplyFilter}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Display selected roles as badges */}
            {selectedRoles.length > 0 && (
                <div className="flex flex-wrap gap-1 ml-2">
                    {selectedRoles.map(role => (
                        <Badge
                            key={role.id}
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-0.5 h-6 bg-muted/50 text-muted-foreground hover:bg-muted"
                        >
                            <span className="text-xs">{role.name}</span>
                            <span
                                role="button"
                                tabIndex={0}
                                className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground hover:bg-transparent cursor-pointer flex items-center justify-center"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const newSelectedRoles = selectedRoles.filter(r => r.id !== role.id);
                                    setSelectedRoles(newSelectedRoles);

                                    // Apply the filter with the updated selection
                                    const roleIds = newSelectedRoles.map(r => isNoRoleOption(r) ? r.id : r.id.toString());
                                    router.get(
                                        baseUrl,
                                        {
                                            role_ids: roleIds.length > 0 ? roleIds : null,
                                            page: 1
                                        },
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                            only: ['users', 'filters']
                                        }
                                    );
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const newSelectedRoles = selectedRoles.filter(r => r.id !== role.id);
                                        setSelectedRoles(newSelectedRoles);

                                        // Apply the filter with the updated selection
                                        const roleIds = newSelectedRoles.map(r => isNoRoleOption(r) ? r.id : r.id.toString());
                                        router.get(
                                            baseUrl,
                                            {
                                                role_ids: roleIds.length > 0 ? roleIds : null,
                                                page: 1
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                                only: ['users', 'filters']
                                            }
                                        );
                                    }
                                }}
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove {role.name}</span>
                            </span>
                        </Badge>
                    ))}
                    {selectedRoles.length > 1 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs px-2 text-muted-foreground hover:text-foreground"
                            onClick={handleClearFilter}
                        >
                            Clear all
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
