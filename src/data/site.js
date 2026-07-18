// Central site metadata + structured-data helpers.
// Imported by Astro pages/layout AND the OG-image generator script,
// so it must stay plain JS with no Astro-only imports.

export const SITE_URL = 'https://baniloo.com';
export const SITE_NAME = 'Baniloo';
export const SITE_TAGLINE = 'Building things — some serious, some just fun.';
export const SITE_DESCRIPTION =
  'A public dev journal by Tanay Kashyap — protocols, apps, and research, built in the open.';

export const AUTHOR = {
  name: 'Tanay Kashyap',
  jobTitle: 'AI-enabled Software Engineer',
  email: 'tanaykashyap.dev@gmail.com',
};

// Identity graph for the Person entity. Add LinkedIn / X / npm etc. here
// as those profiles go live — each strengthens the "Tanay Kashyap" entity.
export const SAME_AS = [
  'https://github.com/iamtanay',
  'https://github.com/Baniloo-Labs',
];

export const PROJECTS = {
  postmortem: {
    name: 'Postmortem',
    org: 'labs',
    type: 'software',
    repo: 'https://github.com/Baniloo-Labs/postmortem',
    tagline: 'AI-powered ops intelligence that lives in your terminal.',
  },
  loomed: {
    name: 'LooMed',
    org: 'labs',
    type: 'protocol',
    repo: 'https://github.com/Baniloo-Labs/loomed',
    tagline: 'A protocol for patient-controlled medical records.',
  },
  pulsesyn: {
    name: 'PulseSyn',
    org: 'labs',
    type: 'protocol',
    repo: 'https://github.com/Baniloo-Labs/pulsesyn',
    tagline: 'An open protocol for validating claims.',
  },
  fedacuity: {
    name: 'FedAcuity',
    org: 'solo',
    type: 'research',
    repo: 'https://github.com/iamtanay/fedacuity',
    tagline: 'Federated learning for Long-Term Care facilities.',
  },
  chakra: {
    name: 'Chakra',
    org: 'solo',
    type: 'software',
    tagline: 'A personal life-management and task tracker.',
  },
  vigor: {
    name: 'Vigor',
    org: 'solo',
    type: 'software',
    tagline: 'A pay-per-use gym and fitness venue app.',
  },
  thechant: {
    name: 'theChant',
    org: 'solo',
    type: 'software',
    tagline: 'A real-time fan reaction app for the World Cup.',
  },
};

/** Absolute URL for a site-relative path. */
export function abs(path) {
  return new URL(path, SITE_URL).href;
}

/** Map a route to its pre-generated OG image path. Home uses the default. */
export function ogImagePath(currentPath) {
  if (!currentPath || currentPath === '/') return '/og-default.png';
  return '/og' + currentPath.replace(/\/+$/, '') + '.png';
}

function isoDate(d) {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d);
}

// ---- JSON-LD builders --------------------------------------------------

export function personLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR.name,
    url: SITE_URL,
    jobTitle: AUTHOR.jobTitle,
    email: 'mailto:' + AUTHOR.email,
    sameAs: SAME_AS,
  };
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    publisher: { '@type': 'Person', name: AUTHOR.name, url: SITE_URL },
  };
}

export function blogPostingLd({ title, description, date, path, section }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: isoDate(date),
    dateModified: isoDate(date),
    author: { '@type': 'Person', name: AUTHOR.name, url: SITE_URL },
    publisher: { '@type': 'Person', name: AUTHOR.name, url: SITE_URL },
    mainEntityOfPage: abs(path),
    url: abs(path),
    image: abs(ogImagePath(path)),
    ...(section ? { articleSection: section } : {}),
  };
}

export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

/** Schema for a project index page. Type adapts to what the project is. */
export function projectLd(key, path, description) {
  const p = PROJECTS[key];
  const base = {
    '@context': 'https://schema.org',
    name: p.name,
    description: description || p.tagline,
    url: abs(path),
    author: { '@type': 'Person', name: AUTHOR.name, url: SITE_URL },
    ...(p.repo ? { codeRepository: p.repo, sameAs: [p.repo] } : {}),
  };
  if (p.type === 'software') {
    return {
      ...base,
      '@type': 'SoftwareApplication',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
    };
  }
  if (p.type === 'protocol') {
    return { ...base, '@type': 'TechArticle' };
  }
  return { ...base, '@type': 'ScholarlyArticle' };
}
