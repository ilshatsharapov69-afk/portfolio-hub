import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    tagline: z.string(),
    stack: z.array(z.string()),
    result: z.string(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    embedPath: z.string().optional(),
    status: z.enum(['live', 'in-progress', 'archived']).default('live'),
  }),
});

export const collections = { cases };
