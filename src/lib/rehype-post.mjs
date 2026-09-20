import { visit } from 'unist-util-visit';

// alt text that describes nothing. Promoting these to a visible caption would
// add noise where the author simply had nothing to say about the image.
const GENERIC_ALT = new Set(['image', 'img', 'images', 'picture', 'photo', 'screenshot', 'preview image']);

/**
 * Two things a set of research notes needs and markdown does not give:
 *
 * 1. Figures. Every image in these posts already carries a real caption in its
 *    alt text ("그림 6.3 한 자릿수 정렬", "Reward"), but alt is only read aloud.
 *    Promoting it to a visible <figcaption> costs nothing and is how a figure
 *    is labelled in a paper. Images with an empty alt are decorative and are
 *    left alone.
 *
 * 2. A language on code blocks. Shiki records it as data-language on the <pre>
 *    but never shows it, and an absolutely positioned label inside a scrolling
 *    <pre> scrolls away with the code, so the block needs a wrapper.
 */
export function rehypePost() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === null) return;

      if (node.tagName === 'img') {
        const alt = node.properties?.alt;
        if (typeof alt !== 'string' || alt.trim() === '') return;
        if (GENERIC_ALT.has(alt.trim().toLowerCase())) return;
        // A <figure> already wrapping it means this ran, or the author wrote one.
        if (parent.type === 'element' && parent.tagName === 'figure') return;

        parent.children[index] = {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['figure'] },
          children: [
            node,
            {
              type: 'element',
              tagName: 'figcaption',
              properties: {},
              children: [{ type: 'text', value: alt }],
            },
          ],
        };
        return;
      }

      if (node.tagName === 'pre') {
        const language = node.properties?.dataLanguage;
        if (typeof language !== 'string' || language === '' || language === 'plaintext') return;
        if (parent.type === 'element' && parent.properties?.className?.includes?.('code-block')) {
          return;
        }

        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['code-block'] },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { className: ['code-lang'] },
              children: [{ type: 'text', value: language }],
            },
            node,
          ],
        };
      }
    });
  };
}
