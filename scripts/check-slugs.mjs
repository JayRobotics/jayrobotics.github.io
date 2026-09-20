import fs from 'node:fs';

// Jekyll's default slugify: downcase, then every run of characters that is not
// a Unicode letter, mark or number collapses to one hyphen; trim the ends.
// Korean survives because Hangul syllables are \p{L}.
export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

const walk = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(`${d}/${e.name}`) : [`${d}/${e.name}`]));

const src = { tags: new Set(), categories: new Set() };
for (const f of walk('_posts').filter((f) => f.endsWith('.md'))) {
  const text = fs.readFileSync(f, 'utf8');
  for (const key of ['tags', 'categories']) {
    const m = text.match(new RegExp('^' + key + ':\\s*\\[(.*?)\\]\\s*$', 'm'));
    if (!m) continue;
    for (const v of m[1].split(',').map((x) => x.trim()).filter(Boolean)) {
      src[key].add(v);
    }
  }
}

const man = fs.readFileSync('url-manifest.txt', 'utf8').trim().split(/\r?\n/);
const pick = (prefix) =>
  new Set(
    man.filter((u) => u.startsWith(prefix) && u !== prefix).map((u) => u.slice(prefix.length, -1)),
  );

let failed = false;
for (const [label, values, want] of [
  ['tag', src.tags, pick('/tags/')],
  ['category', src.categories, pick('/categories/')],
]) {
  const got = new Set([...values].map(slugify));
  const missing = [...want].filter((x) => !got.has(x));
  const extra = [...got].filter((x) => !want.has(x));
  console.log(`${label}: ${values.size} source -> ${got.size} slugs, jekyll had ${want.size}`);
  if (missing.length) {
    console.log('  MISSING:', missing);
    failed = true;
  }
  if (extra.length) {
    console.log('  EXTRA  :', extra);
    failed = true;
  }
}
console.log(failed ? 'FAIL' : 'OK - slugify reproduces every Jekyll tag and category URL');
process.exit(failed ? 1 : 0);
