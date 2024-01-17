"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function PortalButton() {
  const { data: sessionData } = useSession();
  return (
    <>
      {sessionData?.user.role === "admin" && (
        <Button asChild variant="outline">
          <Link href="/admin?tab=products">Admin</Link>
        </Button>
      )}
    </>
  );
}
