import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_NAME, SITE_DESCRIPTION } from '../data/site.js';

const COLLECTIONS = [
  'postmortem',
  'loomed',
  'pulsesyn',
  'fedacuity',
  'chakra',
  'vigor',
  'thechant',
];

export async function GET(context) {
  const items = [];
  for (const collection of COLLECTIONS) {
    const entries = await getCollection(collection);
    for (const entry of entries) {
      if (entry.slug === 'spec') continue;
      items.push({
        title: entry.data.title,
        description: entry.data.description ?? '',
        pubDate: entry.data.date,
        link: `/${collection}/${entry.slug}`,
        categories: [collection],
      });
    }
  }

  items.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: `${SITE_NAME} — journal`,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
    customData: `<language>en</language>`,
  });
}
