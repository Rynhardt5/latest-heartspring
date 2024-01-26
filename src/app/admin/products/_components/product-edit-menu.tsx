"use client";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { type Product } from "./product-column";

export default function ProductEditMenu({ product }: { product?: Product }) {
  const [deleting, setDeleting] = useState(false);
  const utils = api.useUtils();
  const deleteProductById = api.stripe.deleteProductById.useMutation({
    onSuccess: async () => {
      await utils.stripe.getAllProductsAndPrices.invalidate();
      setDeleting(false);
    },
  });

  console.log(product);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="float-end">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuLabel>Edit Product</DropdownMenuLabel> */}
          <DropdownMenuItem
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("edit", {
                  detail: {
                    product,
                  },
                }),
              )
            }
          >
            Edit Product
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            // onClick={() => {
            //   const util = api.useUtils();
            //   api.stripe.deleteProductById
            //     .useMutation({
            //       onSuccess: async () => {
            //         await util.stripe.getAllProductsAndPrices.invalidate();
            //       },
            //     })
            //     .mutate(row.original.id);
            // }}
            onClick={() => {
              setDeleting(true);
              deleteProductById.mutate(product!.id);
            }}
            className=" focus:text-red-500"
          >
            Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {deleting && <Loader fullScreen text="Deleting Product" />}
    </>
  );
}
