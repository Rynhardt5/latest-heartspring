"use client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

export default function AdminNav() {
  const { data: sessionData, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return null;
  }

  // if (sessionData?.user.role !== "admin") {
  //   return null;
  // }

  const links = [
    {
      title: "Products",
      href: "/admin/products",
      current: pathname === "/admin/products",
    },
    {
      title: "Deliveries",
      href: "/admin/deliveries",
      current: pathname === "/admin/deliveries",
    },
    {
      title: "Drivers",
      href: "/admin/drivers",
      current: pathname === "/admin/drivers",
    },
  ];

  return (
    <div className="border-t bg-foreground/[0.02] py-1 shadow-[inset_0_0px_2px_0_rgba(0,0,0,0.09)] ">
      <div className="container  flex items-center justify-between ">
        <div>Admin Toolbar</div>
        <NavigationMenu>
          <NavigationMenuList>
            {links.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn({ "bg-foreground/5": link.current })}
                >
                  <Link href={link.href}>
                    {/* <NavigationMenuLink className={navigationMenuTriggerStyle()} > */}
                    {link.title}
                    {/* </NavigationMenuLink> */}
                  </Link>
                </Button>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
