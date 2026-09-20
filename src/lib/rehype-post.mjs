import { visit } from 'unist-util-visit';

// alt text that describes nothing. Promoting these to a visible caption would
// add noise where the author simply had nothing to say about the image.
const GENERIC_ALT = new Set(['image', 'img', 'images', 'picture', 'photo', 'screenshot', 'preview image']);

// Caption rule: a number is written by hand, and only when it points at
// something outside the post. The algorithm posts cite the figure numbers of
// the textbook they study from; the lecture captures in the RL posts point at
// nothing, so they stay unnumbered rather than carrying a count for the sake
// of looking formal. Same for tables: the sentence above them already says
// what they are.
//
// A caption that opens with its own label, e.g. "그림 6.3 한 자릿수 정렬" or
// "표 2. 시프트 테이블". The number is never generated here: the algorithm
// posts carry the figure numbers of the textbook they are studying from, and
// renumbering them 1, 2, 3 would break the reference back to the book. The
// label is only pulled out so it can be set apart from the description.
const CAPTION_LABEL = /^((?:그림|표|Fig\.?|Figure|Table)\s*[\d.]*[\d])\.?\s+(.+)$/;

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
function captionNode(alt) {
  const m = alt.match(CAPTION_LABEL);
  const children = m
    ? [
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['figure-label'] },
          children: [{ type: 'text', value: m[1] }],
        },
        { type: 'text', value: ' ' + m[2] },
      ]
    : [{ type: 'text', value: alt }];

  return { type: 'element', tagName: 'figcaption', properties: {}, children };
}

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
            captionNode(alt),
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
