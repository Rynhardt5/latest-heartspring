import { z } from "zod";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
// import { posts } from "@/server/db/schema";

async function createProductAndPrice({
  imageUrl,
  // caption,
  name,
  price,
}: {
  imageUrl: string;
  // caption: string;
  name: string;
  price: number;
}) {
  // Create the product
  const product = await stripe.products.create({
    name: name,
    images: [imageUrl],
    // caption: caption,
  });

  // Create the price
  const priceObject = await stripe.prices.create({
    unit_amount: price * 100, // Stripe prices are in cents
    currency: "aud",
    product: product.id,
  });

  return { product, price: priceObject };
}

export const stripeRouter = createTRPCRouter({
  getAllProducts: publicProcedure.query(async () => {
    const products = await stripe.products.list();
    return products.data;
  }),

  getAllProductsAndPrices: publicProcedure.query(async () => {
    const products = await stripe.products.list();
    const prices = await stripe.prices.list();

    const productsWithPrices = products.data.map((product) => {
      let price = 0;
      const priceData = prices.data.find(
        (price) => price.product === product.id,
      );
      if (priceData?.unit_amount != null) {
        price = priceData ? priceData.unit_amount / 100 : 0; // Stripe prices are in cents
      }

      return {
        id: product.id,
        name: product.name,
        images: product.images,
        price: price,
      };
    });

    return productsWithPrices;
  }),

  // createProductAndPrice: publicProcedure.input({}).mutation(async () => {
  //   createProductAndPrice();
  //   return "";
  // }),
});
