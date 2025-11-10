### WhyRobotWhy Blog
- Markdown based structure for posts
- Integration with auth-astro for Google OAuth

## OpenAI Image Generation for Each Post
Select a post, the description of the post will be summarized and used to prompt OpenAI for an image.

![Screenshot 2025-06-23 144009](https://github.com/user-attachments/assets/94564c2e-64b3-45e6-b9e4-c51acae939aa)

After initial image generation, prompt OpenAI for suggestions to iterate on the image. Follow up prompts are customized to the image.

![Screenshot 2025-06-26 090133](https://github.com/user-attachments/assets/41603357-22ad-4d18-a2cd-f1d8e1fdaa1a)

## OpenAI Text to Speech with Customizable Tone/Voice
Choose tone and voice to read the post. Splits the text into 3 parts, and loads each audio file concurrently.
![Screenshot 2025-06-16 155626](https://github.com/user-attachments/assets/5b0bdb5a-9c38-45b1-9913-267c17e80055)

## OpenAI Moderation Endpoint to Check User-Submitted Responses
Users can submit responses to each post. Integration with OpenAI [Moderation endpoint](https://platform.openai.com/docs/guides/moderation) helps prevent harmful content from being published. Additionally, using the Responses API to do additional vetting, such as, "Does the following text contain swear words?" and "Does the following text contain coherent thoughts?".