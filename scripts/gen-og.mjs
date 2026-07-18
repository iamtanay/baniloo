// Generates branded 1200x630 Open Graph images for every route into public/og/.
// Run locally after adding/renaming journal entries:  node scripts/gen-og.mjs
// (Output PNGs are committed, so the Vercel build needs no image tooling.)

import sharp from 'sharp';
import { readFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PROJECTS } from '../src/data/site.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT = join(ROOT, 'src', 'content');
const OUT = join(ROOT, 'public', 'og');
const LOGO = join(ROOT, 'public', 'logo-512.png');

const W = 1200;
const H = 630;
const PAD = 80;
const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = '"Segoe UI", Arial, sans-serif';
const MONO = 'Consolas, "Courier New", monospace';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function wrap(text, maxChars, maxLines) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const cand = line ? line + ' ' + w : w;
    if (cand.length > maxChars && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines - 1) break;
    } else {
      line = cand;
    }
  }
  if (line) lines.push(line);
  if (lines.length === maxLines) {
    // append remaining words to last line, ellipsize if needed
    const used = lines.join(' ').split(/\s+/).length;
    const rest = words.slice(used);
    if (rest.length) {
      let last = lines[maxLines - 1];
      while (last.length > maxChars - 1) last = last.slice(0, -1);
      lines[maxLines - 1] = last + '…';
    }
  }
  return lines.slice(0, maxLines);
}

function cardSvg({ kicker, title, subtitle }) {
  const titleLines = wrap(title, 24, 3);
  const titleSize = titleLines.length >= 3 ? 58 : 68;
  const lineH = titleSize + 10;
  const titleTop = 300;
  const titleTspans = titleLines
    .map(
      (l, i) =>
        `<text x="${PAD}" y="${titleTop + i * lineH}" font-family='${SERIF}' font-size="${titleSize}" font-weight="700" fill="#EDEAE3">${esc(l)}</text>`
    )
    .join('');
  const subEl = subtitle
    ? `<text x="${PAD}" y="${titleTop + titleLines.length * lineH + 20}" font-family='${SANS}' font-size="26" fill="#918E85">${esc(subtitle)}</text>`
    : '';

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="glow" cx="82%" cy="8%" r="70%">
      <stop offset="0%" stop-color="#3B62F0" stop-opacity="0.38"/>
      <stop offset="45%" stop-color="#2A2ACC" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#0E0E0C" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#5B86FF"/>
      <stop offset="100%" stop-color="#8EB2FF"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#0E0E0C"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="0" y="0" width="${W}" height="6" fill="url(#rule)"/>
  <text x="172" y="118" font-family='${SERIF}' font-size="38" font-weight="700" fill="#EDEAE3">Baniloo</text>
  <text x="${PAD}" y="242" font-family='${MONO}' font-size="22" letter-spacing="3" fill="#8EB2FF">${esc(kicker)}</text>
  ${titleTspans}
  ${subEl}
  <text x="${PAD}" y="562" font-family='${MONO}' font-size="24" fill="#918E85">baniloo.com</text>
  <text x="${W - PAD}" y="562" text-anchor="end" font-family='${MONO}' font-size="22" fill="#6E6B63">built in the open</text>
</svg>`);
}

async function render(outPath, opts) {
  const svg = cardSvg(opts);
  const logo = await sharp(LOGO).resize(84, 84, { fit: 'contain' }).png().toBuffer();
  mkdirSync(dirname(outPath), { recursive: true });
  await sharp(svg)
    .composite([{ input: logo, left: PAD, top: 52 }])
    .png()
    .toFile(outPath);
  console.log('og:', outPath.replace(ROOT, '').replace(/\\/g, '/'));
}

function frontmatterTitle(file) {
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^---\s*([\s\S]*?)\s*---/);
  if (!m) return null;
  const t = m[1].match(/^\s*title:\s*(.+?)\s*$/m);
  if (!t) return null;
  return t[1].replace(/^["']|["']$/g, '');
}

const orgLabel = (org) => (org === 'labs' ? 'Baniloo Labs' : 'Solo project');

async function main() {
  mkdirSync(OUT, { recursive: true });

  // Home / default
  await render(join(ROOT, 'public', 'og-default.png'), {
    kicker: 'BUILT IN THE OPEN',
    title: 'Building things — some serious, some just fun.',
    subtitle: 'A public dev journal by Tanay Kashyap',
  });

  // Static pages
  await render(join(OUT, 'about.png'), {
    kicker: 'ABOUT',
    title: 'Tanay Kashyap',
    subtitle: 'AI-enabled software engineer · Master’s in AI & ML · building in public',
  });
  await render(join(OUT, 'ideas.png'), {
    kicker: 'IDEAS',
    title: 'Protocols, apps & research — built in the open',
    subtitle: 'Baniloo Labs and solo work',
  });

  for (const [key, p] of Object.entries(PROJECTS)) {
    // Project index
    await render(join(OUT, `${key}.png`), {
      kicker: orgLabel(p.org).toUpperCase(),
      title: p.name,
      subtitle: p.tagline,
    });

    // Entries + spec
    const dir = join(CONTENT, key);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir).filter((f) => /\.(mdx?|md)$/.test(f));
    for (const f of files) {
      const slug = f.replace(/\.(mdx?|md)$/, '');
      const title = frontmatterTitle(join(dir, f)) || p.name;
      const isSpec = slug === 'spec';
      await render(join(OUT, key, `${slug}.png`), {
        kicker: `${p.name.toUpperCase()}${isSpec ? ' · SPEC' : ' · JOURNAL'}`,
        title: isSpec ? `${p.name} Specification` : title,
        subtitle: isSpec ? p.tagline : undefined,
      });
    }
  }

  console.log('\nOG images generated into public/og/ + public/og-default.png');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
