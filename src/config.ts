// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const testimonials = defineCollection({
  schema: z.object({
    clientName: z.string(),
    serviceType: z.string(),
    beforeImage: z.string(),
    afterImage: z.string(),
    // z.coerce.date() intercepta a string com aspas e a transforma em um objeto Date
    date: z.coerce.date().optional(),
  }),
});

export const collections = { testimonials };