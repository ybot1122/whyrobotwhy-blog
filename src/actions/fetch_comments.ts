import { neon } from "@neondatabase/serverless";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getCollection } from "astro:content";

const sql = neon(import.meta.env.DATABASE_URL);

const pages = await getCollection("blog");
const valid_ids = pages.map((page) => page.data.id);

export const fetch_comments = {
  fetchComments: defineAction({
    input: z.object({
      article_id: z.string(),
    }),
    handler: async (input, ctx) => {
      const article_id = input.article_id;
      if (!valid_ids.includes(article_id)) {
        throw new Error("Invalid article_id");
      }
      const response =
        await sql`SELECT * FROM comments WHERE article_id = ${article_id}::uuid`;
      const data = response;
      return data;
    },
  }),
};
