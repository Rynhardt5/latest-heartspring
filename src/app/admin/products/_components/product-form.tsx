"use client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Description } from "@radix-ui/react-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  images: z
    .any()
    .refine(
      (file) => (file as File)?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`,
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes((file as File)?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export function ProductForm() {
  const imageInput = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);

  // useEffect(() => {
  //   if (imageInput.current?.files?.length) {
  //     console.log(imageInput.current.files[0]);
  //     const url = URL.createObjectURL(imageInput.current.files[0]);
  //     setImage(url);

  //     // Clean up on unmount
  //     return () => URL.revokeObjectURL(url);
  //   }
  // }, [imageInput.current?.files]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
      name: "",
      price: 0,
      description: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="images"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormControl className="grid w-full items-center gap-1.5">
                    <>
                      <FormLabel htmlFor="picture">Picture</FormLabel>
                      {/* <div>{field.value}</div> */}
                      <div
                        className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-md border"
                        onClick={() => imageInput.current?.click()}
                      >
                        {/* if no image is selected show info */}
                        {!image && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-foreground/60">
                              Click to select an image
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
                          // value={value?.fileName}
                          {...field}
                          ref={imageInput}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files?.length && e.target.files[0]) {
                              const url = URL.createObjectURL(
                                e.target.files[0],
                              );
                              setImage(url);
                            }

                            onChange(e.target.files ? e.target.files[0] : null);
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
          <div className="flex-1">
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
