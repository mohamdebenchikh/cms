import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDataTable } from "./data-table-context"
import { DataTableColumnHeaderProps } from "./types"

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
    sortable = true,
}: DataTableColumnHeaderProps<TData, TValue>) {
    const { filters, handleSort } = useDataTable();
    const sortField = filters.sort_field;
    const sortDirection = filters.sort_direction;

    // Return a simple header if sorting is disabled for this column or sortable is false
    if (!column.getCanSort() || sortable === false) {
        return <div className={cn("whitespace-nowrap py-2 text-sm font-medium", className)}>{title}</div>
    }

    // Check if this column is currently being sorted
    const isCurrentSort = sortField === column.id


    return (
        <div className={cn("flex items-center space-x-1", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 whitespace-nowrap text-sm font-medium data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {isCurrentSort ? (
                            sortDirection === "desc" ? (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            ) : (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            )
                        ) : (
                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        onClick={() => handleSort(column.id, 'asc')}
                        className={cn("cursor-pointer", {
                            'bg-accent/50': isCurrentSort && sortDirection === 'asc'
                        })}
                    >
                        <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleSort(column.id, 'desc')}
                        className={cn("cursor-pointer", {
                            'bg-accent/50': isCurrentSort && sortDirection === 'desc'
                        })}
                    >
                        <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
