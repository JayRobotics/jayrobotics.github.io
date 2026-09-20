import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

const posts = defineCollection({
  // The Jekyll posts stay where they are. Nothing is copied, so there is only
  // ever one source of truth for a post.
  loader: glob({
    pattern: '**/*.md',
    base: './_posts',

    // Jekyll built the URL from the filename with its case intact
    // (2026-06-14-OSSRL-01.md -> /posts/OSSRL-01/). The default id lowercases
    // and keeps the date, which would move every post and orphan its
    // utterances thread.
    generateId: ({ entry }) =>
      entry.split('/').pop().replace(/\.md$/, '').replace(DATE_PREFIX, ''),
  }),

  schema: z.object({
    title: z.string(),
    // The loader hands YAML dates over as strings. `2026-08-10 14:39:00 +0900`
    // parses correctly, offset included, so the stored instant is right;
    // anything rendered has to be formatted in Asia/Seoul to match.
    date: z.coerce.date(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    comments: z.boolean().default(true),
    math: z.boolean().default(false),
    toc: z.boolean().default(true),
    pin: z.boolean().default(false),
    image: z
      .object({
        path: z.string(),
        alt: z.string().optional(),
      })
      .optional(),
  }),
});

// The About page keeps living in _tabs/about.md so there is one copy of it.
const tabs = defineCollection({
  loader: glob({
    pattern: 'about.md',
    base: './_tabs',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z
    .object({
      title: z.string().optional(),
      order: z.number().optional(),
      icon: z.string().optional(),
    })
    .passthrough(),
});

export const collections = { posts, tabs };
