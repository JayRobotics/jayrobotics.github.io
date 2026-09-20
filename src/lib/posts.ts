import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/**
 * Jekyll's default slugify, which produced every category and tag URL this
 * site already serves: downcase, collapse each run of characters that is not a
 * Unicode letter, mark or number into one hyphen, then trim the ends. Korean
 * survives because Hangul syllables are letters.
 *
 * scripts/check-slugs.mjs asserts this against the recorded URLs.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/** Posts newest first, with pinned ones lifted to the top as Chirpy did. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => {
    if (a.data.pin !== b.data.pin) return a.data.pin ? -1 : 1;
    return b.data.date.valueOf() - a.data.date.valueOf();
  });
}

/** Strictly by date, for archives and feeds where pinning would mislead. */
export async function getPostsByDate(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export interface Group {
  name: string;
  slug: string;
  posts: Post[];
}

function group(posts: Post[], field: 'categories' | 'tags'): Group[] {
  const byName = new Map<string, Post[]>();
  for (const post of posts) {
    for (const name of post.data[field]) {
      const list = byName.get(name);
      if (list) list.push(post);
      else byName.set(name, [post]);
    }
  }
  return [...byName.entries()]
    .map(([name, list]) => ({ name, slug: slugify(name), posts: list }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
}

export const groupByCategory = (posts: Post[]) => group(posts, 'categories');
export const groupByTag = (posts: Post[]) => group(posts, 'tags');

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * The stored instant is UTC. Formatting in any other zone would shift posts
 * written near midnight onto the wrong day.
 */
export const formatDate = (d: Date) => dateFormat.format(d);

/** The bracketed series prefix is redundant next to a category badge. */
export const stripSeriesPrefix = (title: string) => title.split('] ').at(-1) ?? title;

export const POSTS_PER_PAGE = 5;
