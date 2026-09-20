import type { APIRoute } from 'astro';
import { getPosts, groupByCategory, groupByTag, POSTS_PER_PAGE } from '../lib/posts';
import { site } from '../data/site';

/*
  Hand-written rather than @astrojs/sitemap, because that integration emits
  sitemap-index.xml plus sitemap-0.xml and Jekyll served a single
  /sitemap.xml. The URL is in the manifest, so the filename is not ours to
  change.

  Every route is derived from the same helpers the pages use, so a new category
  or tag appears here without anyone remembering to add it.
*/
export const GET: APIRoute = async ({ site: base }) => {
  const origin = (base ?? new URL('https://jayrobotics.github.io')).origin;
  const posts = await getPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const paths = [
    '/',
    ...Array.from({ length: totalPages - 1 }, (_, i) => `/page${i + 2}/`),
    '/about/',
    '/archives/',
    '/categories/',
    '/tags/',
    ...groupByCategory(posts).map((c) => `/categories/${c.slug}/`),
    ...groupByTag(posts).map((t) => `/tags/${t.slug}/`),
  ];

  const entries = [
    ...paths.map((path) => ({ path, lastmod: undefined as Date | undefined })),
    ...posts.map((post) => ({ path: `/posts/${post.id}/`, lastmod: post.data.date })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ({ path, lastmod }) =>
      `<url><loc>${origin}${encodeURI(path)}</loc>${
        lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : ''
      }</url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

// Used by scripts/check-urls.mjs to confirm the sitemap covers every page.
export const prerender = true;
