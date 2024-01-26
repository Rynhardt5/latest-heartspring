import React from "react";

export default function ShopProduct({ params }: { params: { id: string } }) {
  return <div>ShopProduct {params.id}</div>;
}
