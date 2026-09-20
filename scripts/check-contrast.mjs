import fs from 'node:fs';

// Verifies the contrast the stylesheet claims in its comments. Colour chosen
// by eye is how a dark mode ends up unreadable.
const css = fs.readFileSync('src/styles/global.css', 'utf8');

function tokens(selector) {
  const start = css.indexOf(selector);
  const block = css.slice(start, css.indexOf('}', start));
  const out = {};
  for (const m of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) out[m[1]] = m[2];
  return out;
}

const channel = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const AA_BODY = 4.5;
let failed = false;

for (const [label, selector] of [
  ['light', ':root {'],
  ['dark', "[data-theme='dark'] {"],
]) {
  const t = tokens(selector);
  console.log(`\n${label}  bg ${t.bg}`);
  for (const key of ['text', 'text-muted', 'accent', 'heading']) {
    const r = ratio(t[key], t.bg);
    const ok = r >= AA_BODY;
    if (!ok) failed = true;
    console.log(`  ${key.padEnd(11)} ${t[key]}  ${r.toFixed(2)}:1  ${ok ? 'AA' : 'FAIL'}`);
  }
  // Text also has to hold up on the recessed surfaces, not just the page.
  for (const surface of ['surface', 'surface-2']) {
    const r = ratio(t.text, t[surface]);
    const ok = r >= AA_BODY;
    if (!ok) failed = true;
    console.log(`  text on ${surface.padEnd(9)} ${r.toFixed(2)}:1  ${ok ? 'AA' : 'FAIL'}`);
  }
}

console.log(failed ? '\nFAIL' : '\nOK - every pair clears WCAG AA');
process.exit(failed ? 1 : 0);
