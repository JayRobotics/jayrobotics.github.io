// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://jayrobotics.github.io',

  // Jekyll served every page with a trailing slash. Keeping that is not a
  // style choice: utterances keys each comment thread on the pathname.
  trailingSlash: 'always',

  markdown: {
    // Astro 7 defaults to Sätteri, which parses `$...$` but ships no renderer.
    // The unified pipeline is what remark-math and rehype-katex plug into.
    processor: unified({
      remarkPlugins: [remarkMath],
      // One post writes Korean inside math (`$이동 거리 = (m-1)-i$`), which
      // MathJax rendered without complaint. KaTeX still renders it; `strict`
      // only decides whether it warns. Verify how it looks before changing the
      // post itself.
      rehypePlugins: [[rehypeKatex, { strict: false }]],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
