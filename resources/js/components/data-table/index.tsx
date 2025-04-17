import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { DataTablePagination } from "./datatable-pagination";
import { DataTableFilters } from "./datatable-filters";
import { DataTableProvider, useDataTable } from "./data-table-context";
import { DataTableProps } from "./types";
import { ReactNode } from "react";

export interface DataTableExtendedProps<TData, TValue> extends DataTableProps<TData, TValue> {
    filterComponent?: ReactNode;
    searchPlaceholder?: string;
    meta?: Record<string, any>;
}

export function DataTable<TData, TValue>({
    columns,
    mobileColumns,
    data,
    filters,
    links,
    per_page,
    baseUrl,
    total,
    from,
    to,
    current_page,
    filterComponent,
    searchPlaceholder = "Search...",
    meta
}: DataTableExtendedProps<TData, TValue>) {
    return (
        <DataTableProvider
            columns={columns}
            mobileColumns={mobileColumns}
            data={data}
            filters={filters}
            links={links}
            per_page={per_page}
            baseUrl={baseUrl}
            total={total}
            from={from}
            to={to}
            current_page={current_page}
            meta={{
                filterComponent,
                searchPlaceholder,
                ...(meta || {})
            }}
        >
            <DataTableContent />
        </DataTableProvider>
    );
}

function DataTableContent() {
    const { table } = useDataTable();
    const { filterComponent, searchPlaceholder } = table.options.meta || {};

    return (
        <div className="space-y-4">
            <DataTableFilters searchPlaceholder={searchPlaceholder as string}>
                {filterComponent}
            </DataTableFilters>
            <div className="overflow-hidden rounded-md border shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="whitespace-nowrap">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <DataTablePagination />
        </div>
    )
}
