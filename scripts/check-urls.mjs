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

// The sitemap is written by hand, so it can fall behind a new route. Every
// page except 404 should be in it.
const sitemapPath = path.join(DIST, 'sitemap.xml');
let sitemapProblems = [];
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  // Take the path through URL rather than a regex: the first slash in a <loc>
  // belongs to https://, not to the path.
  const listed = new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decodeURI(new URL(m[1]).pathname)),
  );
  const pages = [...built].filter((u) => u.endsWith('/'));
  sitemapProblems = pages.filter((u) => !listed.has(u));
  console.log(`sitemap: ${listed.size} of ${pages.length} pages`);
  for (const u of sitemapProblems) console.log('  not listed: ' + u);
}

// Replaces what htmlproofer did on the Jekyll workflow: every internal link
// has to land on something that was actually built.
const linkProblems = [];
for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const from = '/' + path.relative(DIST, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
    const target = decodeURI(m[1]);
    const onDisk = path.join(DIST, target.replace(/^\//, ''));
    const ok =
      built.has(target) ||
      (fs.existsSync(onDisk) &&
        (fs.statSync(onDisk).isFile() || fs.existsSync(path.join(onDisk, 'index.html'))));
    if (!ok) linkProblems.push(`${from} -> ${target}`);
  }
}

const uniqueLinkProblems = [...new Set(linkProblems)];
console.log(`internal links: ${uniqueLinkProblems.length} broken`);
for (const l of uniqueLinkProblems.slice(0, 20)) console.log('  ' + l);

process.exit(missing.length || sitemapProblems.length || uniqueLinkProblems.length ? 1 : 0);
