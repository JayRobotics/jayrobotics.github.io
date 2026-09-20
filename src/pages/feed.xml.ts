import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPostsByDate, stripSeriesPrefix } from '../lib/posts';
import { site } from '../data/site';

/*
  The URL stays /feed.xml, which is what a subscriber's reader has stored.
  The format changes: jekyll-feed served Atom and this serves RSS 2.0. Readers
  handle both, and the subscription is the address rather than the dialect.

  Pinned posts are ignored here. A feed is a record of what was published when,
  and reordering it would push an old post back to the top of every reader.
*/
export const GET: APIRoute = async (context) => {
  const posts = await getPostsByDate();

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? 'https://jayrobotics.github.io',
    trailingSlash: true,
    items: posts.map((post) => ({
      title: stripSeriesPrefix(post.data.title),
      pubDate: post.data.date,
      link: `/posts/${post.id}/`,
      categories: [...post.data.categories, ...post.data.tags],
    })),
    customData: `<language>${site.lang}</language>`,
  });
};
