// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import auth from "auth-astro";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), sitemap(), auth()],
  adapter: vercel(),
});
