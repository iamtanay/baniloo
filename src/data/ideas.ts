export type IdeaStatus = 'active' | 'thinking' | 'dormant';

export interface Idea {
  title: string;
  description: string;
  href: string;
  status: IdeaStatus;
  date: string;
}

const ideasData: Idea[] = [
  {
    title: 'LooMed',
    description:
      'A protocol for patient-controlled medical records — portable, interoperable, and built without requiring hospitals to cooperate first.',
    href: '/loomed',
    status: 'active',
    date: '2026-02-28',
  },
  {
    title: 'PulseSyn',
    description:
      'An open protocol for validating claims. A reputation-weighted validator network produces permanent, tamper-proof verdicts on falsifiable assertions — without storing content or owning the truth.',
    href: '/pulsesyn',
    status: 'active',
    date: '2026-03-16',
  },
  {
    title: 'FedAcuity',
    description:
      'M.TECH dissertation. Federated learning for Long-Term Care facilities — predicting skilled nursing needs without ever moving patient data off-premises.',
    href: '/fedacuity',
    status: 'active',
    date: '2026-04-18',
  },
  {
    title: 'Chakra',
    description:
      'A personal life management and task tracker. Kanban, calendar, a Today view that tracks momentum and drift, recurring tasks, multiuser Spaces, and Streams.',
    href: '/chakra',
    status: 'active',
    date: '2026-03-26',
  },
  {
    title: 'Vigor',
    description:
      'A pay-per-use gym and fitness venue app. Walk in, scan a QR, train, scan out. No memberships. A full session lifecycle with wallet tokens, venue discovery, and a gym owner portal.',
    href: '/vigor',
    status: 'active',
    date: '2026-04-17',
  },
  {
    title: 'theChant',
    description:
      'A real-time fan reaction app for FIFA World Cup 2026. Pick your team, react as the match unfolds, watch a live world map show where everyone is feeling it.',
    href: '/thechant',
    status: 'active',
    date: '2026-05-21',
  },
  {
    title: 'Untitled Protocol',
    description:
      'Exploring how the world will move from video-based learning to AI-influenced learning maps.',
    href: '#',
    status: 'thinking',
    date: '2026-03-09',
  },
];

const STATUS_ORDER: Record<IdeaStatus, number> = { active: 0, thinking: 1, dormant: 2 };

export const ideas: Idea[] = ideasData.sort((a, b) => {
  const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  if (statusDiff !== 0) return statusDiff;
  return new Date(b.date).valueOf() - new Date(a.date).valueOf();
});
