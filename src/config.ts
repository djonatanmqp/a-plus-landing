// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const testimonials = defineCollection({
  schema: z.object({
    clientName: z.string(),
    serviceType: z.string(),
    beforeImage: z.string(), // Caminho da imagem
    afterImage: z.string(),  // Caminho da imagem
    date: z.date().optional(),
  }),
});

export const collections = { testimonials };