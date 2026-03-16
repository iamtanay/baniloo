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