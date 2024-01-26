"use client";

import {
  type ColumnDef,
  flexRender,
  type SortingState,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ProductForm } from "./product-form";
import { useEvent } from "react-use";
import { type Product } from "./product-column";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [product, setProduct] = useState<Product | null>(null);
  const [filterBy, setFilterBy] = useState<string>("name");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const idMap: Record<string, string> = {
    name: "Name",
    price: "Price",
    description: "Description",
    gstIncluded: "GST",
    unitLabel: "Unit Label",
    productCode: "Product Code",
  };

  useEvent("edit", (e: CustomEvent<{ product: Product }>) => {
    console.log(e.detail.product);
    // setProductId(e.detail.id);
    setProduct(e.detail.product);
  });

  useEvent("clear", () => {
    console.log("clear");
    setProduct(null);
  });

  // console.log(productId);

  return (
    <div>
      <div className="flex items-center gap-4 py-4">
        <Label>Filter by</Label>
        <Select onValueChange={setFilterBy} value={filterBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select to filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {table
                .getAllColumns()
                .filter(
                  (item) =>
                    item.id.includes("name") ||
                    // item.id.includes("price") ||
                    item.id.includes("productCode"),
                )
                .map((column) => {
                  return (
                    <SelectItem
                      key={column.id}
                      value={column.id}
                      // selected={column.getIsVisible()}
                    >
                      {idMap[column.id]}
                    </SelectItem>
                  );
                })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          placeholder={`Filter...`}
          value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterBy)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {idMap[column.id]}
                  </DropdownMenuCheckboxItem>
                );
              })}
            {/* <Label> */}
            <DropdownMenuCheckboxItem
              className="capitalize"
              checked={table.getIsAllColumnsVisible()}
              onCheckedChange={table.getToggleAllColumnsVisibilityHandler()}
            >
              Toggle All
            </DropdownMenuCheckboxItem>
            {/* <Input
                {...{
                  type: "checkbox",
                  checked: table.getIsAllColumnsVisible(),
                  onChange: table.getToggleAllColumnsVisibilityHandler(),
                }}
              />{" "}
              Toggle All
            </Label> */}
          </DropdownMenuContent>
        </DropdownMenu>
        <ProductForm product={product} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
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
                    <TableCell className="px-4 py-1" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
