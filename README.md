### WhyRobotWhy Blog
- Markdown based structure for posts
- Integration with auth-astro for Google OAuth

## OpenAI Image Generation for Each Post

## OpenAI Text to Speech with Customizable Tone/Voice
Choose tone and voice to read the post. Splits the text into 3 parts, and loads each audio file concurrently.

## OpenAI Moderation Endpoint to Check User-Submitted Responses
Users can submit responses to each post. Integration with OpenAI [Moderation endpoint](https://platform.openai.com/docs/guides/moderation) helps prevent harmful content from being published. Additionally, using the Responses API to do additional vetting, such as, "Does the following text contain swear words?" and "Does the following text contain coherent thoughts?".
