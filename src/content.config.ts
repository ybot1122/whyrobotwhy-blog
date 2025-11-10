import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    author: z.string().default("Toby"),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    spotifyUrl: z.string().optional(),
  }),
});

export const collections = { blog };
