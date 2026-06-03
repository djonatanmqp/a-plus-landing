import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    clientName: z.string(),
    serviceType: z.string(),
    beforeImage: z.string(),
    afterImage: z.string(),
    date: z.date().optional(),
  }),
});

export const collections = { testimonials };
