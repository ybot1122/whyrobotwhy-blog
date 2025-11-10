import OpenAI from "openai";
const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getCollection } from "astro:content";

const toneInstructions = {
  serious: "Speak in a serious tone, but not overly strict or stern.",
  upbeat: "Speak in a cheerful and positive tone.",
  curious: "Speak in a wondrous and awe-struck tone.",
  dire: "Speak in a grave and dire tone. Very serious.",
  casual: "Speak as if we were chit chatting in the front lawn.",
};

export const tts = {
  tts: defineAction({
    input: z.object({
      part: z.number(),
      post_id: z.string(),
      voice: z.enum([
        "alloy",
        "ash",
        "ballad",
        "coral",
        "echo",
        "fable",
        "onyx",
        "nova",
        "sage",
        "shimmer",
        "verse",
      ]),
      tone: z.enum(["serious", "upbeat", "curious", "dire", "casual"]),
    }),
    handler: async (input) => {
      const post = (await getCollection("blog")).filter(
        (a) => a.id === input.post_id
      )[0];

      if (!post || !post.body) {
        return "error";
      }
      const incr = post.body.length / 8;
      const ranges = [
        [0, incr * 2],
        [incr * 2, incr * 4],
        [incr * 4, -1],
      ];

      const text = post.body.substring(
        ranges[input.part][0],
        ranges[input.part][1] === -1 ? post.body.length : ranges[input.part][1]
      );

      try {
        const mp3 = await openai.audio.speech.create({
          model: "gpt-4o-mini-tts",
          voice: input.voice,
          input: text,
          instructions: toneInstructions[input.tone],
          response_format: "wav",
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        const b64 = buffer.toString("base64");

        return b64;
      } catch (e) {
        console.error(e);
      }

      return "error";
    },
  }),
};
