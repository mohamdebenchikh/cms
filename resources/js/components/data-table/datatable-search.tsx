import { Input } from "../ui/input"
import { Search, Loader2 } from "lucide-react"
import { useDataTable } from "./data-table-context"
import { useState, useEffect } from "react"
import { DataTableSearchProps } from "./types"
import { handleSearchChange as handleSearchChangeUtil } from "./utils"

export function DataTableSearch({
    placeholder = "Search for...",
}: DataTableSearchProps) {
    const { filters, handleSearch } = useDataTable();
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);

    // Update local state when filters change (e.g., when navigating or initial load)
    useEffect(() => {
        setSearchValue(filters.search ?? '');
    }, [filters.search]);

    const handleSearchChange = (value: string) => {
        handleSearchChangeUtil(value, setSearchValue, setIsSearching, handleSearch);
    };

    return (
        <div className="relative w-full max-w-sm flex-1">
            {isSearching ? (
                <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            )}
            <Input
                placeholder={placeholder}
                value={searchValue}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="h-9 w-full pl-8 text-sm md:h-10"
            />
        </div>
    )
}
