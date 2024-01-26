import { z } from "zod";

const MAX_FILE_SIZE = 4000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 4MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported.",
  )
  .nullable();

export const productSchema = z.object({
  imageFile: z.string().or(
    z
      .instanceof(File)
      .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 4MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported.",
      )
      .nullable(),
  ),
  name: z.string().min(2, {
    message: "The product name must be at least 2 characters.",
  }),
  productCode: z.string().optional(),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  gstIncluded: z.boolean(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  unitLabel: z.string().optional(),
  recurring: z.boolean().optional(),
  recurringInterval: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .nullable(),
});
