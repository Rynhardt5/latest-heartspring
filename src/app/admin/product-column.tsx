"use client";

// import ProductModal from "@/components/products/ProductModal";
// import { Button } from "@/components/ui/button";
// import { posts } from "@/server/db/schema";
import { type ColumnDef } from "@tanstack/react-table";
// import { MoreHorizontal } from "lucide-react";
// import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  price: number;
  // image: string;
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
  //           src={product.image}
  //           alt={product.name}
  //           className="h-full w-full object-scale-down p-2"
  //           fill
  //         />
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
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
