"use client";

import { Button } from "@/components/ui/button";

// import ProductModal from "@/components/products/ProductModal";
// import { Button } from "@/components/ui/button";
// import { posts } from "@/server/db/schema";
import { type ColumnDef } from "@tanstack/react-table";
import ProductEditMenu from "./product-edit-menu";
import { ArrowUpDown } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  priceId: string;
  images: string[];
  productCode?: string;
  description: string;
  unitLabel?: string;
  gstIncluded: boolean;
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string
//   amount: number
//   status: 'pending' | 'processing' | 'success' | 'failed'
//   email: string
// }

export const columns: ColumnDef<Product>[] = [
  // {
  //   accessorKey: "image",
  //   header: "Image",
  //   cell: ({ row }) => {
  //     const product = row.original;

  //     return (
  //       <div className="relative flex h-16 w-16 items-center overflow-hidden rounded-md border ">
  //         <Image
  //           src={product.images[0] ?? "/images/product-placeholder.png"}
  //           alt={product.name}
  //           className="h-full w-full object-scale-down p-2"
  //           fill
  //         />
  //       </div>
  //       // <div>test</div>
  //     );
  //   },
  // },
  {
    accessorKey: "productCode",
    // header: "Product Code",
    cell: ({ row }) => {
      const product = row.original;

      // console.log(row.original);

      return <div className="font-medium">{product.productCode}</div>;
    },
    header: ({ column }) => {
      return (
        <Button
          className="-ml-2 px-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    // header: "Name",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;

      return <div className="px-4 font-medium">{product.name}</div>;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;

      return <div className="px-4 font-medium">{product.description}</div>;
    },
  },
  {
    accessorKey: "gstIncluded",
    header: "GST",
    cell: ({ row }) => {
      const product = row.original;

      // console.log(row.original);

      return (
        <div className="font-medium">
          {product.gstIncluded ? "incl." : "free"}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="float-end"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
      }).format(amount);

      return <div className="px-4 text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "unitLabel",
    header: () => <div className="text-right">Unit Label</div>,
    cell: ({ row }) => {
      const product = row.original;

      return <div className="text-right font-medium">{product.unitLabel}</div>;
    },
  },
  // {
  //   accessorKey: "images",
  //   header: () => <div className="text-right">Images</div>,
  //   cell: ({ row }) => {
  //     const product = row.original;

  //     return (
  //       <div className="text-right font-medium">
  //         {product.images.map((image) => (
  //           <div key={image}>{image}</div>
  //         ))}
  //       </div>
  //     );
  //   },
  // },
  {
    id: "actions",
    // accessorKey: "id",

    enableHiding: false,
    cell: ({ row }) => {
      return <ProductEditMenu product={row.original} />;
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const product = row.original;

  //     return (
  //       <div className="float-right">
  //         <ProductModal product={product} />
  //       </div>
  //       // <DropdownMenu>
  //       //   <DropdownMenuTrigger asChild>
  //       //     <Button variant="ghost" className="h-8 w-8 p-0 float-right">
  //       //       <span className="sr-only">Open menu</span>
  //       //       <MoreHorizontal className="h-4 w-4" />
  //       //     </Button>
  //       //   </DropdownMenuTrigger>
  //       //   <DropdownMenuContent align="end">
  //       //     <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //       //     <DropdownMenuItem
  //       //     // onClick={() => navigator.clipboard.writeText(payment.id)}
  //       //     >
  //       //       Copy payment ID
  //       //     </DropdownMenuItem>
  //       //     <DropdownMenuSeparator />
  //       //     <DropdownMenuItem>View customer</DropdownMenuItem>
  //       //     <DropdownMenuItem>View payment details</DropdownMenuItem>
  //       //   </DropdownMenuContent>
  //       // </DropdownMenu>
  //     );
  //   },
  // },
];
