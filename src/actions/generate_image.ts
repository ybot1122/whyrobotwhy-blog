import OpenAI from "openai";
const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getCollection } from "astro:content";
import { getSession } from "auth-astro/server";

export const generate_image = {
  generateImage: defineAction({
    input: z.object({
      post_id: z.string().optional(),
      follow_up_prompt: z.string().optional(),
      previous_response_id: z.string().optional(),
    }),
    handler: async (input, ctx) => {
      const session = await getSession(ctx.request);

      if (
        !input.post_id &&
        !input.follow_up_prompt &&
        !input.previous_response_id
      ) {
        throw new Error(
          "post_id or follow_up_id+previous_response_id is required"
        );
      }

      if (session?.user?.email !== "liutoby92@gmail.com") {
        throw new Error("error");
      }

      let prompt = "";

      if (input.post_id) {
        const post = (await getCollection("blog")).filter(
          (a) => a.id === input.post_id
        )[0];
        prompt = `Create an image that fits this blog post description: ${post.data.description}`;
      } else {
        prompt = `Now make it ${input.follow_up_prompt}`;
      }

      console.log(prompt, input);

      try {
        const response = await openai.responses.create({
          model: "gpt-4.1-mini",
          instructions:
            "You are a graphic designer for my blog. Image must not contain text. Image must be 400px wide and 300px tall.",
          input: prompt,
          previous_response_id: input.previous_response_id,
          tools: [
            {
              type: "image_generation",
              quality: "low",
              output_format: "jpeg",
              output_compression: 100,
            },
          ],
        });

        const imageData = response.output
          .filter((output) => output.type === "image_generation_call")
          .map((output) => output.result);

        if (imageData.length > 0) {
          const imageBase64 = imageData[0];

          return { imageBase64, reponse_id: response.id };
        }
      } catch (e) {
        console.error(e);
        throw new Error("Failed to generate image");
      }
    },
  }),
};
