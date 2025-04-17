import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { router } from "@inertiajs/react";
import { DataTableCustomFilterProps } from "./types";

export function DataTableCustomFilter({
  options,
  filterKey,
  currentValue = null,
  baseUrl,
  placeholder = "Select...",
  label = "Filter",
  emptyMessage = "No options found."
}: DataTableCustomFilterProps) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(currentValue);

  // Initialize selected value from props
  useEffect(() => {
    setSelectedValue(currentValue);
  }, [currentValue]);

  const handleSelect = (value: string) => {
    // If the same value is selected, clear the filter
    const newValue = selectedValue === value ? null : value;
    setSelectedValue(newValue);

    // Navigate to the filtered URL
    router.get(
      baseUrl || route(route().current()!),
      {
        [filterKey]: newValue,
        page: 1 // Reset to first page when filtering
      },
      {
        preserveState: true,
        preserveScroll: true,
        only: ['data', 'filters'] // Only refresh the data and filters
      }
    );

    setOpen(false);
  };

  const selectedOption = selectedValue
    ? options.find(option => option.id.toString() === selectedValue)?.name || placeholder
    : placeholder;

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[150px] justify-between"
          >
            {selectedOption}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => handleSelect("")}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    !selectedValue ? "opacity-100" : "opacity-0"
                  )}
                />
                All
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => handleSelect(option.id.toString())}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === option.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
