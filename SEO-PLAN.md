# Baniloo SEO Plan

Goal: make **baniloo.com** rank at the top for **`Tanay Kashyap`**, **`building in public`**
(long tail), and project-specific terms — and become the canonical entity page for
Tanay Kashyap on the web.

This plan is written to be **executed the moment the site moves to `baniloo.com`**. Phase 0
can start now; everything else keys off the domain switch.

---

## 0. Current state — audit findings

What already exists (good foundation):

- Static Astro build → fast, crawlable HTML. 38 pages.
- `@astrojs/sitemap` generates `sitemap-index.xml`.
- `robots.txt` allows all + points to `https://baniloo.com/sitemap-index.xml`.
- `Layout.astro` sets `<title>`, meta description, canonical, Open Graph + Twitter tags.
- Journal entries set unique title/description from MDX frontmatter.

Gaps found during the audit (each becomes a task below):

| # | Issue | Impact | Fix in phase |
|---|-------|--------|--------------|
| A | `astro.config.mjs` `site` is `https://baniloo.vercel.app` | Sitemap + canonical URLs generate with the **wrong domain**; mismatches robots.txt | Phase 1 |
| B | **Canonical bug:** journal entry pages pass `currentPath="/pulsesyn"` (section), not the entry slug | Every entry canonicalizes to the section index → entries get **de-indexed/deduped** by Google | Phase 2 (highest priority) |
| C | `og-default.png` referenced but **missing** from `public/` | Social/OG cards 404 → poor CTR when shared, weaker "building in public" distribution | Phase 2 |
| D | No structured data (JSON-LD) anywhere | No Person/Organization/Article entity signals; no rich results; no knowledge-panel path | Phase 2 |
| E | No RSS feed | Weaker freshness/distribution signal; readers can't subscribe | Phase 3 |
| F | `fedacuity-architecture.png` is ~1.4 MB, unoptimized | Core Web Vitals (LCP) hit on that page | Phase 3 |
| G | Images lack explicit `width`/`height` in places | Cumulative Layout Shift (CLS) | Phase 3 |

---

## Phase 0 — Do now (domain-independent)

1. **Write the About page as the canonical Tanay Kashyap bio.** This is the page that
   should rank for `Tanay Kashyap`. Ensure it contains, in prose: full name (exact, repeated
   naturally), role ("AI-enabled software engineer"), "Master's in AI & ML", the projects,
   and the phrase "building in public". Add a crisp `<title>` = `Tanay Kashyap — Baniloo`
   and a description that leads with the name.
2. **Collect the `sameAs` identity set** (needed for Person JSON-LD in Phase 2): personal
   GitHub (`github.com/iamtanay`), Baniloo Labs org, LinkedIn, X/Twitter, npm
   (`@postmortem-cli`), Google Scholar / ORCID if the FedAcuity paper is published, dev.to /
   Hashnode. Create any missing profiles and use the **exact** name "Tanay Kashyap" on each.
3. **Decide analytics**: Plausible or Umami (privacy-friendly, no cookie banner) — recommended
   over GA4 for a personal site. Get the script ready to drop into `Layout.astro`.
4. **Pick primary keyword per page** (see keyword map §7) and confirm each page's H1 +
   title + first paragraph reflect it.

---

## Phase 1 — Domain switch day (`baniloo.com`)

Do these **in order** the day DNS points at `baniloo.com`:

1. **Fix `astro.config.mjs`**: `site: 'https://baniloo.com'`. Rebuild. This corrects every
   generated sitemap URL and the canonical base. (Fixes audit item A.)
2. **301 redirect** `baniloo.vercel.app` → `baniloo.com` (Vercel: set `baniloo.com` as the
   primary domain; Vercel auto-301s the others). Preserves any existing link equity.
3. **Force a single canonical host**: pick `https://baniloo.com` (no `www`) and 301 the other.
   Keep it consistent with `Layout.astro`'s `siteUrl`.
4. **Google Search Console**: add `baniloo.com` as a domain property, verify via DNS TXT,
   submit `https://baniloo.com/sitemap-index.xml`. Use "Change of Address" if the vercel.app
   property was verified.
5. **Bing Webmaster Tools**: add + verify + submit sitemap (can import from GSC).
6. **IndexNow**: add an IndexNow key file to `public/` and ping on deploy so Bing/Yandex
   index new journal entries within minutes.
7. Confirm `robots.txt` sitemap line matches the live domain (already `baniloo.com`).

---

## Phase 2 — On-page SEO & structured data (highest ranking leverage)

**2.1 Fix the canonical bug (item B) — do this first.**
Pass the real per-entry path to `Layout`. In every `src/pages/<project>/[slug].astro`:

```astro
currentPath={`/${project}/${entry.slug}`}
```

`Layout.astro` already builds `canonicalUrl` from `currentPath`, so this alone gives each
entry a correct self-referential canonical and lets Google index them individually.

**2.2 Create OG images (item C).**
- Add a branded `public/og-default.png` (1200×630): logo + "Baniloo — built in the open".
- Best: generate **per-page OG images** at build time (title + project on the brand
  background) via `@vercel/og` / `satori`, or a small script mirroring the logo pipeline.
  Wire the output path into `Layout.astro`'s `ogImage` prop per page.

**2.3 Add JSON-LD structured data (item D).** Inject via `Layout.astro` (site-wide) + per
page type:

- **Person** (site-wide, or on About) — the entity for `Tanay Kashyap`:
  ```json
  { "@type": "Person", "name": "Tanay Kashyap",
    "jobTitle": "AI-enabled Software Engineer",
    "url": "https://baniloo.com",
    "sameAs": ["https://github.com/iamtanay", "https://github.com/Baniloo-Labs", "...LinkedIn", "...X"] }
  ```
- **WebSite** (site-wide) with `name: "Baniloo"` and `publisher` → Person.
- **Organization** for Baniloo Labs (on labs project pages / footer scope).
- **BlogPosting / TechArticle** for each journal entry: `headline`, `datePublished`
  (from frontmatter `date`), `author` → Person, `image` → the entry OG image, `mainEntityOfPage`.
- **SoftwareApplication** or **SoftwareSourceCode** for each project index page (LooMed,
  PulseSyn, Postmortem…) linking `codeRepository` to GitHub.
- **BreadcrumbList** on entry pages: Home → Project → Entry.

**2.4 Meta hygiene.** Audit that every page has a unique `<title>` (≤60 chars) and
description (≤155 chars) that front-loads its target keyword. Add `<meta name="author"
content="Tanay Kashyap">`. Ensure exactly one `<h1>` per page (already true).

**2.5 Semantic + internal linking.** Use `<article>`, `<time datetime>`, `<nav>` landmarks.
Cross-link projects to each other and to journal entries; link every project page to its
GitHub repo and back.

---

## Phase 3 — Content & keyword strategy

Ranking for competitive terms comes from **depth + freshness + internal linking**.

1. **Journal cadence = freshness engine.** Keep shipping `YYYY-MM-DD.mdx` entries after dev
   sessions (already the workflow). Each entry is a new indexable, keyword-rich URL.
2. **Add an RSS feed** (`@astrojs/rss` → `/rss.xml`) and link it in `<head>` and footer.
   Freshness signal + lets aggregators (and the "building in public" community) subscribe.
3. **Pillar pages for head terms.** Give `building in public` a real home: a short evergreen
   page/section explaining how Baniloo is built in the open, linking all journal streams.
   This is what ranks for the phrase, supported by the badge already on the homepage.
4. **Project pages as keyword pillars.** Each project index targets its niche long-tail (see
   §7) with a real description, the problem it solves, and links to its entries + repo.
5. **Optimize the heavy image** (item F): compress `fedacuity-architecture.png` (WebP/AVIF,
   resize to display size) and add explicit `width`/`height` everywhere (item G) to protect
   LCP/CLS.
6. **Cross-post for backlinks** (see Phase 4) with `rel=canonical` back to baniloo.com.

---

## Phase 4 — Off-page, entity building & backlinks

Ranking for `Tanay Kashyap` = making Google confident baniloo.com **is** Tanay Kashyap.

1. **Consistent identity (`sameAs`) everywhere.** Same name, same avatar (the new logo or a
   headshot), same bio, each profile linking back to baniloo.com. This is the strongest
   knowledge-panel signal.
2. **GitHub cross-linking.** Set the website field on the personal profile and the Baniloo
   Labs org to `baniloo.com`. Add baniloo.com to each project repo's About + README. Pin the
   repos. GitHub profile pages rank fast and pass authority.
3. **Dev-community cross-posts** (dev.to, Hashnode, Medium) of select journal entries, each
   with a canonical URL pointing to the baniloo.com original → referral traffic + backlinks
   without duplicate-content penalty.
4. **Show HN / Reddit / Lobsters** for launch-worthy entries (Postmortem, protocols) → high
   authority backlinks + spikes that Google notices.
5. **npm / package pages** (`@postmortem-cli/mort`) link to baniloo.com.
6. **Optional entity anchors**: a personal LinkedIn "Featured" link, and — if the FedAcuity
   paper publishes — ORCID / Google Scholar / arXiv, all pointing back. Consider a Wikidata
   item once there's enough independent coverage.

---

## Phase 5 — Measurement & iteration

- **Search Console** weekly: track impressions/clicks/position for `Tanay Kashyap`,
  `building in public`, and each project term. Watch Coverage for the entry pages getting
  indexed (validates the Phase-2 canonical fix).
- **Core Web Vitals** (GSC + PageSpeed Insights): keep LCP < 2.5s, CLS < 0.1, INP < 200ms.
- **Analytics** (Plausible/Umami): top pages, referrers, which journal entries pull traffic —
  feed that back into what to write next.
- **Re-crawl trigger**: ping IndexNow + resubmit sitemap on each deploy with new entries.

---

## 6. Priority order (what actually moves the needle)

1. **Fix the canonical bug (2.1)** — without it, journal content can't rank. Highest ROI.
2. **`astro.config` site + 301s + Search Console (Phase 1)** — foundation.
3. **Person/WebSite/BlogPosting JSON-LD (2.3)** — the `Tanay Kashyap` entity play.
4. **OG images (2.2)** + **RSS (3.2)** — distribution.
5. **Off-page identity consistency (Phase 4)** — the long game for the name term.
6. **Content cadence (Phase 3)** — compounding.

---

## 7. Target keyword map

| Page | Primary term | Secondary / long-tail |
|------|--------------|-----------------------|
| Home | Baniloo · Tanay Kashyap | building in public, dev journal |
| About | **Tanay Kashyap** | AI-enabled software engineer, Master's in AI & ML |
| /ideas | Tanay Kashyap projects | building in public portfolio |
| Postmortem | AI ops in the terminal | local-first incident/postmortem CLI, deploy watcher |
| LooMed | patient-controlled medical records protocol | portable interoperable health records |
| PulseSyn | decentralized claim validation protocol | reputation-weighted validator network |
| FedAcuity | federated learning long-term care | skilled nursing prediction, privacy-preserving ML |
| Chakra | personal task tracker / life management app | kanban momentum tracker |
| Vigor | pay-per-use gym app | no-membership fitness, QR check-in |
| theChant | World Cup fan reaction app | real-time football fan map |

---

## 8. Execution checklist (tick when done)

Phase 1 (domain day):
- [ ] `astro.config.mjs` site → `https://baniloo.com`
- [ ] 301 vercel.app → baniloo.com; single canonical host
- [ ] GSC property verified + sitemap submitted (+ Change of Address)
- [ ] Bing Webmaster + IndexNow key

Phase 2:
- [ ] Per-entry canonical fix in all `[slug].astro`
- [ ] `og-default.png` + per-page OG images
- [ ] Person + WebSite JSON-LD site-wide
- [ ] BlogPosting + BreadcrumbList on entries; SoftwareApplication on project pages
- [ ] Unique title/description audit; `meta author`

Phase 3+:
- [ ] RSS feed at `/rss.xml`, linked in head + footer
- [ ] "Building in public" pillar page/section
- [ ] Compress `fedacuity-architecture.png`; add width/height on images
- [ ] Analytics installed
- [ ] GitHub profiles/repos link to baniloo.com; dev.to cross-posts with canonical
```
