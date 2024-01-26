import { z } from "zod";
import Stripe from "stripe";
import { del } from "@vercel/blob";

// this need to be accessed on the front end
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { productSchema } from "@/types";
// import { posts } from "@/server/db/schema";

async function createProductAndPrice({
  imageFile,
  // caption,
  description,
  name,
  price,
  productCode,
  gstIncluded,
  unitLabel,
}: z.infer<typeof productSchema>) {
  // Stripe tax code first one is tax included, second one is tax excluded
  const tax_code = gstIncluded ? "txcd_99999999" : "txcd_00000000";

  const product = await stripe.products.create({
    name: name,
    images: [imageFile as string],
    description,
    ...(unitLabel && { unit_label: unitLabel }),
    ...(productCode && {
      metadata: {
        productCode,
      },
    }),
    tax_code,
    default_price_data: {
      unit_amount: price * 100, // Stripe prices are in cents
      currency: "aud",
    },
  });

  return { product };
}

export const stripeRouter = createTRPCRouter({
  // getAllProducts: publicProcedure.query(async () => {
  //   const products = await stripe.products.list();
  //   return products.data;
  // }),
  checkoutCartUrl: publicProcedure.query(async () => {
    // const session = await stripe.checkout.sessions.create({
    //   success_url: "http://localhost:3000/shop/success",
    //   line_items: [
    //     {
    //       price: "price_1OceNRKfV33MZe1gGpGirj9w",
    //       quantity: 2,
    //     },
    //   ],
    //   mode: "subscription",
    //   // subscription_data: {},
    // });
    // console.log(session);
    // return session;
    return "";
  }),

  getAllProductsAndPrices: publicProcedure.query(async () => {
    // TODO Pagination
    const products = await stripe.products.list({
      limit: 100,
      active: true,
    });

    const productsWithPrices = products.data.map(async (product) => {
      const price = await stripe.prices.retrieve(
        product.default_price as string,
      );

      const priceValue = price.unit_amount ? price.unit_amount / 100 : 0;

      return {
        id: product.id,
        name: product.name,
        price: priceValue,
        priceId: price.id,
        images: product.images,
        productCode: product.metadata.productCode ?? "",
        description: product.description ?? "",
        unitLabel: product.unit_label ?? "",
        gstIncluded: product.tax_code === "txcd_99999999",
      };
    });

    const data = await Promise.all(productsWithPrices);

    return data;
  }),

  getProductAndPriceById: publicProcedure
    .input(z.string())
    .query(async ({ input: productId }) => {
      const product = await stripe.products.retrieve(productId);

      const priceData = await stripe.prices.retrieve(
        product.default_price as string,
      );

      let price = 0;
      if (priceData?.unit_amount != null) {
        price = priceData ? priceData.unit_amount / 100 : 0; // Stripe prices are in cents
      }

      return {
        id: product.id,
        name: product.name,
        price: price,
        images: product.images,
        productCode: product.metadata.productCode ?? "",
        description: product.description ?? "",
        unitLabel: product.unit_label ?? "",
        gstIncluded: product.tax_code === "txcd_99999999",
      };
    }),

  createProductAndPrice: publicProcedure
    .input(productSchema)
    .mutation(async ({ input }) => {
      await createProductAndPrice(input);
    }),

  updateProductAndPriceById: publicProcedure
    .input(productSchema.and(z.object({ id: z.string() })))
    .mutation(async ({ input }) => {
      // first need to find the product and see if it exists
      const productExists = await stripe.products.retrieve(input.id);

      if (!productExists) {
        throw new Error("Product does not exist");
      }

      // update the price first check if the price changed
      const price = await stripe.prices.retrieve(
        productExists.default_price as string,
      );

      const priceValue = price.unit_amount ? price.unit_amount / 100 : 0;
      let newPrice: Stripe.Response<Stripe.Price> | null = null;
      if (priceValue !== input.price) {
        // create a new price and set it as the default price
        newPrice = await stripe.prices.create({
          unit_amount: input.price * 100,
          currency: "aud",
          product: input.id,
          active: true,
        });
      }

      console.log("newPrice", newPrice);
      console.log("input", input);

      // update said products with new info
      const updatedProduct = await stripe.products.update(input.id, {
        name: input.name,
        description: input.description,
        images: [input.imageFile as string],
        unit_label: input.unitLabel,
        ...(newPrice && newPrice.id && { default_price: newPrice?.id }),
        metadata: {
          productCode: input.productCode!,
        },
        tax_code: input.gstIncluded ? "txcd_99999999" : "txcd_00000000",
      });

      console.log("updatedProduct", updatedProduct);

      return updatedProduct;
    }),

  deleteProductById: publicProcedure
    .input(z.string())
    .mutation(async ({ input: productId }) => {
      // first need to find the product image url
      const product = await stripe.products.retrieve(productId);

      console.log(product.images);

      // delete the product image
      if (
        product.images &&
        product.images.length > 0 &&
        product.images[0] &&
        !product.images[0].includes("stripe")
      ) {
        for (const imageUrl of product.images) {
          await del(imageUrl);
        }
      }

      // delete the product
      return await stripe.products.update(productId, { active: false });
    }),

  deleteAllProducts: publicProcedure.mutation(async () => {
    const products = await stripe.products.list({
      limit: 100,
      active: true,
    });

    // make all prices inactive
    for (const product of products.data) {
      const prices = await stripe.prices.list({
        product: product.id,
      });

      for (const price of prices.data) {
        await stripe.prices.update(price.id, {
          active: false,
        });
      }
    }

    for (const product of products.data) {
      await stripe.products.update(product.id, {
        active: false,
      });
    }

    return true;
  }),
});
