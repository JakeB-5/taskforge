"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// Table primitives
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// Sort direction type
type SortDirection = "asc" | "desc" | null;

// Column definition
export interface ColumnDef<TData> {
  id: string;
  header: string;
  accessorKey?: keyof TData;
  accessorFn?: (row: TData) => unknown;
  cell?: (value: unknown, row: TData) => React.ReactNode;
  enableSorting?: boolean;
  className?: string;
}

// DataTable props
interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pageSize?: number;
  pageSizeOptions?: number[];
  className?: string;
  emptyMessage?: string;
}

function getCellValue<TData>(row: TData, column: ColumnDef<TData>): unknown {
  if (column.accessorFn) return column.accessorFn(row);
  if (column.accessorKey) return row[column.accessorKey];
  return undefined;
}

function DataTable<TData>({
  columns,
  data,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 50],
  className,
  emptyMessage = "No results.",
}: DataTableProps<TData>) {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    const column = columns.find((c) => c.id === sortColumn);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aVal = getCellValue(a, column);
      const bVal = getCellValue(b, column);

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison =
        typeof aVal === "string" && typeof bVal === "string"
          ? aVal.localeCompare(bVal)
          : Number(aVal) - Number(bVal);

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection, columns]);

  const pageCount = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
    setPageIndex(0);
  };

  const SortIcon = ({ columnId }: { columnId: string }) => {
    if (sortColumn !== columnId)
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    if (sortDirection === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.className}>
                  {column.enableSorting !== false ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                      onClick={() => handleSort(column.id)}
                    >
                      {column.header}
                      <SortIcon columnId={column.id} />
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => {
                    const value = getCellValue(row, column);
                    return (
                      <TableCell key={column.id} className={column.className}>
                        {column.cell ? column.cell(value, row) : String(value ?? "")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {pageIndex + 1} of {pageCount || 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setPageIndex(0)}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPageIndex(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPageIndex(pageIndex + 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setPageIndex(pageCount - 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export {
  DataTable,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
