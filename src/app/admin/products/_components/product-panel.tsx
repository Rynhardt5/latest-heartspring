"use client";
import React from "react";
import { columns } from "./product-column";
import { api } from "@/trpc/react";
import { DataTable } from "./product-data-table";
import Loader from "@/components/common/loader";
// import { useEvent } from "react-use";

export default function ProductPanel() {
  // const utils = api.useUtils();
  const { data: products, status } =
    api.stripe.getAllProductsAndPrices.useQuery();
  // const deleteAllProducts = api.stripe.deleteAllProducts.useMutation({
  //   onSuccess: async () => {
  //     await utils.stripe.getAllProductsAndPrices.invalidate();
  //   },
  // });
  // const uploadPhoto = api.file.uploadFile.mutate({ filename: "test.png", file: })
  // console.log(status);
  // console.log(products);

  return (
    <div>
      <div className="my-4 mb-0 flex justify-between">
        <h1 className="mb-0 text-2xl font-semibold">Products</h1>

        {/* <div className="flex gap-2">
          <ProductForm />
          {process.env.NODE_ENV === "development" && (
            <Button
              variant="destructive"
              onClick={() => deleteAllProducts.mutate()}
            >
              Delete All Products
            </Button>
          )}

        </div> */}
      </div>
      {status === "loading" ? (
        <Loader fullScreen />
      ) : (
        products && <DataTable columns={columns} data={products} />
      )}
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
