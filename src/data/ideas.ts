export type IdeaStatus = 'active' | 'shipped' | 'thinking' | 'dormant';
export type IdeaOrg = 'labs' | 'solo';

export interface Idea {
  title: string;
  description: string;
  href: string;
  status: IdeaStatus;
  date: string;
  org: IdeaOrg;
}

const ideasData: Idea[] = [
  {
    title: 'Postmortem',
    description:
      'AI-powered ops intelligence that lives in your terminal. It watches your deploys, git, and logs — and when something breaks, it correlates the events and tells you why, using whatever AI you already have. Local-first, no SaaS.',
    href: '/postmortem',
    status: 'active',
    date: '2026-06-24',
    org: 'labs',
  },
  {
    title: 'LooMed',
    description:
      'A protocol for patient-controlled medical records — portable, interoperable, and built without requiring hospitals to cooperate first.',
    href: '/loomed',
    status: 'active',
    date: '2026-02-28',
    org: 'labs',
  },
  {
    title: 'PulseSyn',
    description:
      'An open protocol for validating claims. A reputation-weighted validator network produces permanent, tamper-proof verdicts on falsifiable assertions — without storing content or owning the truth.',
    href: '/pulsesyn',
    status: 'active',
    date: '2026-03-16',
    org: 'labs',
  },
  {
    title: 'FedAcuity',
    description:
      'Master\'s dissertation in AI & ML. Federated learning for Long-Term Care facilities — predicting skilled nursing needs without ever moving patient data off-premises.',
    href: '/fedacuity',
    status: 'shipped',
    date: '2026-04-18',
    org: 'solo',
  },
  {
    title: 'Chakra',
    description:
      'A personal life management and task tracker. Kanban, calendar, a Today view that tracks momentum and drift, recurring tasks, multiuser Spaces, and Streams.',
    href: '/chakra',
    status: 'active',
    date: '2026-03-26',
    org: 'solo',
  },
  {
    title: 'Vigor',
    description:
      'A pay-per-use gym and fitness venue app. Walk in, scan a QR, train, scan out. No memberships. A full session lifecycle with wallet tokens, venue discovery, and a gym owner portal.',
    href: '/vigor',
    status: 'active',
    date: '2026-04-17',
    org: 'solo',
  },
  {
    title: 'theChant',
    description:
      'A real-time fan reaction app for FIFA World Cup 2026. Pick your team, react as the match unfolds, watch a live world map show where everyone is feeling it.',
    href: '/thechant',
    status: 'active',
    date: '2026-05-21',
    org: 'solo',
  },
  {
    title: 'Untitled Protocol',
    description:
      'Exploring how the world will move from video-based learning to AI-influenced learning maps.',
    href: '#',
    status: 'thinking',
    date: '2026-03-09',
    org: 'solo',
  },
];

const STATUS_ORDER: Record<IdeaStatus, number> = { active: 0, shipped: 1, thinking: 2, dormant: 3 };

const byStatusThenDate = (a: Idea, b: Idea): number => {
  const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  if (statusDiff !== 0) return statusDiff;
  return new Date(b.date).valueOf() - new Date(a.date).valueOf();
};

export const ideas: Idea[] = [...ideasData].sort(byStatusThenDate);

export interface IdeaGroup {
  key: IdeaOrg;
  label: string;
  tagline: string;
  ideas: Idea[];
}

export const ideaGroups: IdeaGroup[] = [
  {
    key: 'labs',
    label: 'Baniloo Labs',
    tagline: 'Open protocols and tools shipped under the Baniloo Labs org.',
    ideas: ideasData.filter((i) => i.org === 'labs').sort(byStatusThenDate),
  },
  {
    key: 'solo',
    label: 'Solo Projects',
    tagline: 'Research, apps, and experiments I build under my own name.',
    ideas: ideasData.filter((i) => i.org === 'solo').sort(byStatusThenDate),
  },
];
