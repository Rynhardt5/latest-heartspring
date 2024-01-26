"use client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { type ChangeEvent, useRef, useState, useEffect } from "react";
import { api } from "@/trpc/react";
import Loader from "@/components/common/loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { productSchema } from "@/types";
import { type PutBlobResult } from "@vercel/blob";
import { type Product } from "./product-column";
import Select from "react-select";
import MultiSelect from "@/components/multi-select";
// import { Product } from "./product-column";
// import { api } from "@/trpc/server";

// export const productSchema = z.object({
//   imageFile: z
//     .instanceof(File)
//     .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 4MB.`)
//     .refine(
//       (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
//       "Only .jpg, .jpeg, .png and .webp formats are supported.",
//     )
//     .nullable(),
//   name: z.string().min(2, {
//     message: "The product name must be at least 2 characters.",
//   }),
//   productCode: z.string().optional(),
//   price: z.coerce.number().min(0, {
//     message: "Price must be a positive number.",
//   }),
//   gstIncluded: z.boolean(),
//   description: z.string().min(10, {
//     message: "Description must be at least 10 characters.",
//   }),
//   unitLabel: z.string().optional(),
// });

const options = [
  { label: "Weekly", value: "weekly" },
  {
    label: "Fortnightly",
    value: "fortnightly",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
];

export function ProductForm({
  product: productData,
}: {
  product?: Product | null;
}) {
  const imageInput = useRef<HTMLInputElement>(null);
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mode = productData ? "edit" : "create";

  const createProduct = api.stripe.createProductAndPrice.useMutation({
    onSuccess: async (data) => {
      console.log(data);
      await utils.stripe.getAllProductsAndPrices.invalidate();
      setOpen(false);
      setLoading(false);
    },
  });

  const updateProduct = api.stripe.updateProductAndPriceById.useMutation({
    onSuccess: async (data) => {
      console.log(data);
      await utils.stripe.getAllProductsAndPrices.invalidate();
      setOpen(false);
      setLoading(false);
    },
  });

  useEffect(() => {
    if (productData?.images && productData.images.length > 0) {
      setImage(productData.images[0] ?? null);
    }

    if (productData) {
      Object.entries(productData).forEach(([key, value]) => {
        if (typeof key === "string" && key !== "id" && key !== "imageFile") {
          form.setValue(key as Keys, value as string | number | boolean | null);
        }
        if (key === "imageFile" && value) {
          form.setValue(key as Keys, null);
        }
      });
    }

    setOpen(!!productData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData]);

  // This is for the form to work
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // const { id: _id, images: _images, ...rest } = productData ?? {};

  // console.log(rest);
  // 1. Define your form.
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      imageFile: null,
      name: "",
      productCode: "",
      price: 0,
      description: "",
      gstIncluded: true,
      unitLabel: "",
      recurring: false,
      recurringInterval: [],
    },
  });

  // type KeysOfValue<T, TCondition> = {
  //   [K in keyof T]: T[K] extends TCondition ? K : never;
  // }[keyof T];

  // type Entries<T> = {
  //   [K in keyof T]: [K, T[K]];
  // }[keyof T][];
  type Keys = keyof typeof productSchema.shape;

  async function uploadPhotoToVercelBlob(file: File) {
    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      const { url } = (await response.json()) as PutBlobResult;
      return url;
    } catch (error) {
      console.error(error);
    }
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof productSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      if (mode === "create") {
        setLoading(true);

        // upload file to vercel blob storage
        const url = await uploadPhotoToVercelBlob(values.imageFile as File);

        createProduct.mutate({
          ...values,
          imageFile: url as unknown as string,
        });
      }

      if (mode === "edit" && productData) {
        setLoading(true);
        console.log(productData?.images);

        console.log(values.imageFile);

        let imageUrl = "";
        if (values.imageFile) {
          // upload  file to vercel blob storage
          const url = await uploadPhotoToVercelBlob(values.imageFile as File);
          imageUrl = url as unknown as string;
        }

        // TODO edit product mutation
        updateProduct.mutate({
          id: productData.id,
          ...values,
          imageFile: imageUrl,
        });
        //
        console.log(values);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  function clearVals() {
    window.dispatchEvent(new CustomEvent("clear"));
    form.reset({
      imageFile: null,
      name: "",
      productCode: "",
      price: 0,
      description: "",
      gstIncluded: true,
      unitLabel: "",
      recurring: false,
      recurringInterval: [],
    });
    setImage(null);
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          console.log(val);
          if (!val) {
            clearVals();
          }
          setOpen(val);
        }}
      >
        <DialogTrigger asChild>
          <Button onClick={() => clearVals()}>Add Product</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[800px] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {`${mode === "create" ? "Create" : "Edit"} Product`}
            </DialogTitle>
            {/* <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription> */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* <Button
          onClick={async () => {
            const blob = await api.file.uploadFile.mutate({
              filename: "test.png",
              file: form.getValues("images") as File,
            });

            alert(blob);
          }}
        >
          Test upload of photo
        </Button> */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="imageFile"
                      render={({
                        field: { onChange, value: _value, ...field },
                      }) => (
                        <FormItem>
                          <FormControl className="grid w-full items-center gap-1.5">
                            <>
                              <FormLabel htmlFor="picture">Picture</FormLabel>
                              {/* <div>{field.value}</div> */}
                              <div
                                className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-md border"
                                onClick={() => imageInput.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  if (e.dataTransfer.files?.length) {
                                    const url = URL.createObjectURL(
                                      e.dataTransfer.files[0]!,
                                    );
                                    setImage(url);
                                  }

                                  onChange(
                                    e.dataTransfer.files
                                      ? e.dataTransfer.files[0]
                                      : null,
                                  );
                                }}
                              >
                                {/* if no image is selected show info */}
                                {!image && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                      Click to <br /> select an image
                                    </div>
                                  </div>
                                )}
                                {image && (
                                  <Image
                                    src={image}
                                    alt="Selected"
                                    className="h-full w-full object-contain"
                                    fill
                                  />
                                )}
                                <Input
                                  id="picture"
                                  type="file"
                                  placeholder=""
                                  className="hidden"
                                  accept="image/*"
                                  {...field}
                                  ref={imageInput}
                                  onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                  ) => {
                                    if (
                                      e.target.files &&
                                      e.target.files.length > 0 &&
                                      e.target.files[0]
                                    ) {
                                      console.log(e.target.value);
                                      console.log(e.target.files[0]);
                                      const url = URL.createObjectURL(
                                        e.target.files[0],
                                      );
                                      setImage(url);

                                      onChange(
                                        e.target.files
                                          ? e.target.files[0]
                                          : null,
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </>
                          </FormControl>
                          {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1 space-y-[22.5px]">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="productCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Code</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="" {...field} />
                          </FormControl>
                          {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gstIncluded"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              GST Included
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="unitLabel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Unit Label (each or box quantity)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="recurring"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Recurring
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="recurringInterval"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              {/* <Select
                                className="w-full"
                                options={[
                                  { label: "Weekly", value: "weekly" },
                                  {
                                    label: "Fortnightly",
                                    value: "fortnightly",
                                  },
                                  {
                                    label: "Monthly",
                                    value: "monthly",
                                  },
                                ]}
                                isMulti={true}
                                {...field}
                              /> */}
                              {/* <MultiSelect2 options={options} {...field} /> */}
                              {/* <MultiSelect options={options} {...field} /> */}
                              <MultiSelect
                                options={[
                                  { label: "Weekly", value: "weekly" },
                                  {
                                    label: "Fortnightly",
                                    value: "fortnightly",
                                  },
                                  {
                                    label: "Monthly",
                                    value: "monthly",
                                  },
                                ]}
                                {...field}
                                // selected={field.value}
                              />
                            </FormControl>
                            {/* <FormLabel className="text-sm font-normal">
                              Recurring
                            </FormLabel> */}
                          </FormItem>
                        );
                      }}
                    />

                    {/* <MultiSelect2
                      selected={[]}
                      onChange={(val) => console.log(val)}
                      options={[
                        { label: "Test", value: "test" },
                        { label: "Test2", value: "test2" },
                      ]}
                    /> */}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} />
                      </FormControl>
                      {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {`${mode === "create" ? "Add" : "Update"} Product`}
                </Button>
              </form>
            </Form>
            {loading && (
              <Loader
                fullScreen
                text={`${mode === "create" ? "Creating" : "Updating"} Product`}
                column
                size="large"
              />
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* {isFetching && <Loader fullScreen />} */}
    </>
  );
}
