import { z, defineCollection } from 'astro:content';

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    icon: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
  }),
});

const faqCollection = defineCollection({
  type: 'content',
  schema: z.object({
    question: z.string(),
    category: z.string(),
    order: z.number(),
  }),
});

const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({}),
});

export const collections = {
  'services': servicesCollection,
  'faq': faqCollection,
  'legal': legalCollection,
};
