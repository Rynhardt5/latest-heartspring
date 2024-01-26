"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { type CartProduct, useStore } from "@/store/useStore";
import Image from "next/image";
import Link from "next/link";
import { AUDollar } from "@/lib/utils";
import { api } from "@/trpc/react";

export default function CartButton() {
  const store = useStore((state) => state);

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" className="rounded-full" size="icon">
          <div className="relative">
            {store.cart.length !== 0 && (
              <div className="absolute -right-5 -top-5 rounded-full border-2 border-background bg-accent px-[5px] py-[1px] text-xs">
                {store.cart.reduce((acc: number, item: CartProduct) => {
                  return acc + item.quantity;
                }, 0)}
              </div>
            )}
            <ShoppingCart className="h-5 w-5" />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>

          <div className="flex h-[91vh] flex-col justify-between">
            <div>
              {store.cart.length === 0 && (
                <div className="flex h-32 items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-semibold">
                      Your cart is empty
                    </div>
                    <div className="text-sm text-gray-500">
                      Add some items to see them here.
                    </div>
                  </div>
                </div>
              )}

              {store.cart.length > 0 && (
                <ul>
                  {store.cart.map((item) => (
                    <li
                      key={item.priceId}
                      className="flex w-full flex-col border-b "
                    >
                      <div className="relative flex w-full flex-row justify-between px-1 py-4">
                        <Link href="#" className="z-30 flex flex-row space-x-4">
                          <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border bg-slate-50 hover:bg-foreground/5 dark:bg-slate-200">
                            <Image
                              // width={64}
                              // height={64}
                              alt="test"
                              src={item.image}
                              fill
                              className="object-contain p-1 mix-blend-multiply"
                            />
                          </div>

                          <div className="flex flex-1 flex-col text-base">
                            <span className="leading-tight">{item.name}</span>
                            <div className="text-sm text-foreground/60">
                              {AUDollar.format(item.price)}
                            </div>
                          </div>
                        </Link>
                        <div className="-mt-0.5 flex h-16 flex-col items-end justify-between">
                          <div className="">
                            {AUDollar.format(item.price * item.quantity)}
                          </div>
                          <div className="ml-auto flex h-9 flex-row items-center rounded-full border ">
                            <Button
                              variant="outline"
                              size="icon"
                              className="ml-1 h-7 w-7 rounded-full border-none p-0"
                              onClick={() => store.subFromCart(item.priceId)}
                            >
                              -
                            </Button>
                            <p className="w-6 text-center">
                              <span className="w-full text-sm">
                                {item.quantity}
                              </span>
                            </p>
                            <Button
                              variant="outline"
                              size="icon"
                              className="mr-1 h-7 w-7 rounded-full border-none p-0"
                              onClick={() => store.addToCart(item)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <div className="py-4">
                {/* <div className="mb-3 flex items-center justify-between border-b  pb-1 pt-1 ">
                  <p>Shipping</p>
                  <p className="text-right">Calculated at checkout</p>
                </div> */}
                <div className="mb-3 flex items-center justify-between border-b pb-1 pt-1 text-lg">
                  <p>Total</p>
                  <p className="font-semibold">
                    {AUDollar.format(
                      store.cart.reduce((acc, item) => {
                        return acc + item.price * item.quantity;
                      }, 0),
                    )}
                  </p>
                </div>
              </div>
              <Button className="w-full">Proceed to Checkout</Button>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
