import type { MarkdownHeading } from 'astro';

const FENCE = /^\s*(```|~~~)/;
const ATX = /^(#{2,5})\s+(.*?)\s*#*\s*$/;

/**
 * Heading text taken from the markdown source rather than the rendered HTML.
 *
 * `MarkdownHeading.text` is collected after rehype-katex has run, and KaTeX
 * emits the same expression three times over (MathML, the HTML rendering and
 * the LaTeX annotation). A heading like `**$P$ : Transition probability**`
 * therefore arrives as `PPP : Transition probability`.
 */
function sourceHeadings(body: string): { depth: number; text: string }[] {
  const out: { depth: number; text: string }[] = [];
  let fence: string | null = null;

  for (const line of body.split(/\r?\n/)) {
    const fenced = line.match(FENCE);
    if (fenced) {
      // A `#` inside a code block is a comment, not a heading.
      if (fence === null) fence = fenced[1];
      else if (fenced[1] === fence) fence = null;
      continue;
    }
    if (fence !== null) continue;

    const m = line.match(ATX);
    if (!m) continue;

    const text = m[2]
      .replace(/\$\$?([^$]*)\$\$?/g, '$1') // math delimiters, keep the content
      .replace(/<[^>]+>/g, '') // inline html such as <u>
      .replace(/\*\*|__|\*|`/g, '') // emphasis and inline code marks
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links
      .replace(/\s+/g, ' ')
      .trim();

    out.push({ depth: m[1].length, text });
  }

  return out;
}

/**
 * Pairs Astro's headings with the source text by position. Both lists are in
 * document order and filtered the same way, so index alignment holds; if it
 * ever does not, the rendered text is used unchanged rather than mislabelling
 * a heading.
 */
export function tocHeadings(headings: MarkdownHeading[], body: string | undefined) {
  const items = headings.filter((h) => h.depth >= 2 && h.depth <= 5);
  if (!body) return items;

  const source = sourceHeadings(body);
  if (source.length !== items.length) return items;
  if (source.some((s, i) => s.depth !== items[i].depth)) return items;

  return items.map((h, i) => ({ ...h, text: source[i].text || h.text }));
}
