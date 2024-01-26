import { AUDollar } from "@/lib/utils";
import { api } from "@/trpc/server";
import React from "react";
import Image from "next/image";
import Test from "./Test";

// list of products

export default async function page() {
  const products = await api.stripe.getAllProductsAndPrices.query();

  return (
    <div className="">
      <h1 className="mb-6 text-4xl font-bold">Shop</h1>
      <div className="grid grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.id}>
            <div className="group relative mb-2 overflow-hidden rounded-md border bg-slate-50 p-4 dark:bg-slate-200">
              <div className="relative aspect-square bg-slate-50 dark:bg-slate-200">
                <Image
                  src={product.images[0]!}
                  alt={product.name}
                  fill
                  className="object-contain mix-blend-multiply"
                />
              </div>
              <div className="absolute inset-0 hidden items-end justify-center bg-black/5 p-4 group-hover:flex dark:bg-black/25 ">
                <Test product={product} />
              </div>
            </div>
            <div>{product.name}</div>
            <div>{AUDollar.format(product.price)}</div>
            {/* <Button size="sm">Add to Cart</Button> */}
          </div>
        ))}
      </div>
    </div>
  );
}
