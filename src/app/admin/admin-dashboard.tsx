"use client";
import React from "react";
import ProductPanel from "./products/product-panel";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/components/common/loader";

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const { data, status } = useSession();
  const tab = searchParams.get("tab");

  if (status === "loading") {
    return <Loader fullScreen />;
  }

  if (data?.user.role !== "admin") {
    // TODO: redirect to home page
    return null;
  }

  if (tab === "products") {
    return <ProductPanel />;
  }

  return <div>admin page {tab}</div>;
}
