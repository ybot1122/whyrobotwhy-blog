import OpenAI from "openai";
const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";

// Given a response_id that is a generated image,
// prompt model for 3 prompts to iterate on the image
export const iterate_image = {
  iterate: defineAction({
    input: z.object({
      previous_response_id: z.string(),
    }),
    handler: async (input, ctx) => {
      const session = await getSession(ctx.request);

      if (!input.previous_response_id) {
        throw new Error("previous_response_id is required");
      }

      if (session?.user?.email !== "liutoby92@gmail.com") {
        throw new Error("error");
      }

      try {
        const response = await openai.responses.create({
          model: "gpt-4.1-mini",
          input:
            "You must suggest 6 prompts to iterate on this image. The response should be a JSON array of strings. Each prompt should be 20 chracters or less. Do not include any other text or markdown in the response. At least one prompt should be to add or remove humans from the picture (depending on if the picture has humans in it). Also at least one prompt should be to iterate on the style of the picture, making it more realistic or more photorealistic, or more artistic, depending on the current style.",
          previous_response_id: input.previous_response_id,
        });

        const message = response.output
          .filter((output) => output.type === "message")
          .map((output) =>
            output.content
              .filter((c) => "text" in c)
              .map((c) => (c as { text: string }).text)
              .join("")
          )
          .join("");

        console.log(message, input);

        const prompts = JSON.parse(message);

        return { prompts };
      } catch (e) {
        console.error(e);
        throw new Error("Failed to generate image");
      }
    },
  }),
};
