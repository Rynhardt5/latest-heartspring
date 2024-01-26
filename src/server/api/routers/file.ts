import { z } from "zod";
import { put } from "@vercel/blob";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const fileRouter = createTRPCRouter({
  uploadFile: publicProcedure
    .input(z.object({ filename: z.string(), file: z.any() }))
    .mutation(async ({ input }) => {
      console.log(input);
      const blob = await put(input.filename, input.file as File, {
        access: "public",
        multipart: true,
      });

      console.log(blob);

      return blob;
    }),
});
