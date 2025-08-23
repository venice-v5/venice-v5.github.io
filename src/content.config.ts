import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(),
    authorLink: z.string().url(),
    // Add more fields as needed
  }),
});

const docs = defineCollection({
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});


export const collections = { blog, docs };
