import { neon } from "@neondatabase/serverless";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getCollection } from "astro:content";
import OpenAI from "openai";
import { check } from "@astrojs/mdx/server.js";

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const sql = neon(import.meta.env.DATABASE_URL);

const pages = await getCollection("blog");
const valid_ids = pages.map((page) => page.data.id);

const check_questions = [
  {
    q: 'Reply "Yes" or "No". Does the following text contain swear words? Text: "',
    t: "author",
  },
  {
    q: 'Reply "Yes" or "No". Does the following text contain swear words? Text: "',
    t: "comment",
  },
  {
    q: 'Reply "Yes" or "No". Does the following text seem like a person\'s name? Text: "',
    t: "author",
  },
  {
    q: 'Reply "Yes" or "No". Does the following text contain coherent thoughts? Text: "',
    t: "comment",
  },
  {
    q: 'Reply "Yes" or "No". Is the following text appropriate for a family-friendly website? Text: "',
    t: "author",
  },
  {
    q: 'Reply "Yes" or "No". Is the following text appropriate for a family-friendly website? Text: "',
    t: "comment",
  },
];

const check_answers = ["no", "no", "yes", "yes", "yes", "yes"];

export const post_comment = {
  postComment: defineAction({
    input: z.object({
      article_id: z.string(),
      comment: z.string(),
      author: z.string(),
      token: z.string(),
    }),
    handler: async (input, ctx) => {
      try {
        const article_id = input.article_id;
        if (!valid_ids.includes(article_id)) {
          return false;
        }

        // Validate the token with Google reCAPTCHA API
        const recaptchaRes = await fetch(
          "https://www.google.com/recaptcha/api/siteverify",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              secret: import.meta.env.RECAPTCHA_SECRET_KEY,
              response: input.token,
            }),
          }
        );
        const recaptchaData = await recaptchaRes.json();
        if (!recaptchaData.success) {
          return false;
        }

        // Pass Author Name and Comment Content through OpenAI Moderation API
        const moderationResponse = await openai.moderations.create({
          input: [input.author, input.comment],
        });
        const [authorResult, commentResult] = moderationResponse.results;
        if (authorResult.flagged || commentResult.flagged) {
          return false;
        }

        // Pass Author Name and Content Through OpenAI Safety Check
        const spotChecks = await Promise.all(
          check_questions.map(({ q, t }: { q: string; t: string }) =>
            openai.responses.create({
              model: "gpt-5",
              input: `${q}${input[t as keyof typeof input]}"`,
            })
          )
        );

        for (let i = 0; i < spotChecks.length; i++) {
          console.log(spotChecks[i].output_text.toLowerCase());
          if (spotChecks[i].output_text.toLowerCase() !== check_answers[i]) {
            return false;
          }
        }

        // Insert the new comment
        await sql`
          INSERT INTO comments (article_id, content, author)
          VALUES (${article_id}::uuid, ${input.comment}, ${input.author})
        `;

        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
  }),
};
