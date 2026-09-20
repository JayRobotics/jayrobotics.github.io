import fs from 'node:fs';
import path from 'node:path';

// The migration is only done when the Astro build serves every URL the Jekyll
// build served. utterances keys comment threads on the pathname, so a moved
// post silently loses its comments.
const DIST = 'dist';

const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

const built = new Set();
for (const file of walk(DIST)) {
  const rel = path.relative(DIST, file).split(path.sep).join('/');
  if (rel.endsWith('index.html')) {
    built.add('/' + rel.slice(0, -'index.html'.length));
  } else {
    built.add('/' + rel);
  }
}

const expected = fs
  .readFileSync('url-manifest.txt', 'utf8')
  .trim()
  .split(/\r?\n/)
  .filter(Boolean);

const missing = expected.filter((u) => !built.has(u));
// Static assets are files the manifest never listed, not routes.
const ASSET = /^\/(_astro|assets)\/|\.(png|jpe?g|gif|svg|webp|ico|woff2?|css|js|map)$/;
const extra = [...built].filter((u) => !expected.includes(u) && !ASSET.test(u));

console.log(`expected ${expected.length} urls, built ${built.size}`);
console.log(`missing: ${missing.length}`);
for (const u of missing) console.log('  - ' + u);
console.log(`extra:   ${extra.length}`);
for (const u of extra.slice(0, 20)) console.log('  + ' + u);
if (extra.length > 20) console.log(`  ... and ${extra.length - 20} more`);

process.exit(missing.length ? 1 : 0);
