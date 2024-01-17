// "use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";
// import { DataTable } from "../../test-data-table";
import { type Product, columns } from "../../product-column";
import { api } from "@/trpc/server";
import { DataTable } from "../../test-data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";

export default async function ProductPanel() {
  const products = await api.stripe.getAllProductsAndPrices.query();

  return (
    <div>
      <div className="my-6 flex justify-between">
        <h1 className="mb-0 text-2xl font-semibold">Products</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Input
              className="w-[300px] pl-10"
              placeholder="Search..."
              // onChange={(e) => setSearch(e.target.value)}
            />
            <SearchIcon className="absolute left-2 top-2 h-6 w-6 text-foreground/60" />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new product</DialogTitle>
                {/* <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription> */}
                <ProductForm />
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* <NewProductModal /> */}
        </div>
      </div>
      <DataTable columns={columns} data={products} />
    </div>
  );
}

// "use client";
// import ProductList from "@/components/products/ProductList";
// import NewProductModal from "@/components/products/ProductModal";
// import { trpc } from "@/lib/trpc/client";
// import { DataTable } from "./DataTable";
// import { columns } from "./columns";
// import { DataTableDemo } from "./test";
// import { Input } from "@/components/ui/input";
// import { SearchIcon } from "lucide-react";
// import { useState } from "react";
// import fuzzy from "@/lib/utils";

// export default function ProductSection() {
//   const { data, isLoading } = trpc.products.getProducts.useQuery();
//   const [search, setSearch] = useState("");

//   const filteredProducts =
//     search === ""
//       ? data?.products
//       : fuzzy(data?.products!, search, {
//           keys: ["name", "description", "price"],
//         }).flatMap((result) => result.item);

//   console.log(data?.products);

//   console.log(filteredProducts);

//   return (
//     <div className="p-4 pr-0">
//       <div className="flex justify-between">
//         <h1 className="mb-6 text-2xl font-semibold">Products</h1>
//         <div className="flex w-[500px] justify-between">
//           <div className="relative">
//             <Input
//               className="w-[300px] pl-10"
//               placeholder="Search..."
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <SearchIcon className="absolute left-2 top-2 h-6 w-6 text-foreground/60" />
//           </div>
//           <NewProductModal />
//         </div>
//       </div>
//       {isLoading ? (
//         <div>Loading...</div>
//       ) : (
//         filteredProducts && (
//           <>
//             {/* <ProductList products={products.products} /> */}
//             <DataTable
//               pagination
//               pageSize={5}
//               columns={columns}
//               data={filteredProducts}
//             />
//             {/* <DataTableDemo /> */}
//           </>
//         )
//       )}
//     </div>
//   );
// }
