"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, CreditCard, Droplet } from "lucide-react";
import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { autoCapitalize, getInitials } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { set } from "zod";
import LoginBox from "@/components/login-box";

// get profile data from session

export default function ProfileButton() {
  const { data: sessionData, status } = useSession();
  const [open, setOpen] = useState(false);

  const initals = sessionData?.user.name ? (
    getInitials(sessionData?.user.name)
  ) : (
    <Droplet className="h-[1.2rem] w-[1.2rem]" />
  );

  function openDialog() {
    setOpen(true);
  }

  function toggleLogin() {
    return status === "authenticated" ? signOut() : openDialog();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={sessionData?.user.image ?? ""} alt="@shadcn" />
            <AvatarFallback>{initals}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10} className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {autoCapitalize(sessionData?.user.name ?? "Guest User")}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {sessionData?.user.email ?? "Please sign in to your account"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          {/* <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem>Team</DropdownMenuItem> */}
          {/* <DropdownMenuItem>Subscription</DropdownMenuItem> */}
          {/* <DropdownMenuItem>Toggle Toolbar</DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => toggleLogin()}>
            {status === "authenticated" ? "Sign Out" : "Sign In"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Share</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to HeartSpring</DialogTitle>
            <DialogDescription>Pure water for pure living</DialogDescription>
          </DialogHeader>
          <LoginBox />
        </DialogContent>
      </Dialog>
    </>
  );
}
