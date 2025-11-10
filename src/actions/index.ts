import { fetch_comments } from "./fetch_comments";
import { generate_image } from "./generate_image";
import { iterate_image } from "./iterate_image";
import { post_comment } from "./post_comment";
import { tts } from "./tts";

export const server = {
  generate_image,
  tts,
  iterate_image,
  fetch_comments,
  post_comment,
};
