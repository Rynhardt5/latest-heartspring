"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { type Product } from "../admin/products/_components/product-column";
import { useStore } from "@/store/useStore";

export default function Test({ product }: { product: Product }) {
  const store = useStore((state) => state);

  return (
    <>
      <Button
        size="sm"
        className="mt-2"
        onClick={() =>
          store.addToCart({
            name: product.name,
            price: product.price,
            image: product.images[0] ?? "/images/product-placeholder.png",
            priceId: product.priceId,
            quantity: 1,
          })
        }
      >
        Add to Cart
      </Button>
      {/* <Button onClick={() => store.subFromCart(product.priceId)}>
        Remove from cart
      </Button> */}
    </>
  );
}
