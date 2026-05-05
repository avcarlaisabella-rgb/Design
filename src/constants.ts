import { Plan } from './types';

export const PLANS: Plan[] = [
  {
    id: 'essencial',
    name: 'Essencial',
    arts_limit: 4,
    revisions_limit: 4,
    active_requests_limit: 1,
    priority: false,
    price: 299,
  },
  {
    id: 'profissional',
    name: 'Profissional',
    arts_limit: 8,
    revisions_limit: 10,
    active_requests_limit: 2,
    priority: false,
    price: 599,
  },
  {
    id: 'premium',
    name: 'Premium',
    arts_limit: 12,
    revisions_limit: 24,
    active_requests_limit: 3,
    priority: true,
    price: 999,
  },
  {
    id: 'elite',
    name: 'Elite',
    arts_limit: 12,
    revisions_limit: 24,
    active_requests_limit: 3,
    priority: true,
    price: 1499,
  },
];

export const STATUS_COLORS: Record<string, string> = {
  'solicitado': 'bg-blue-100 text-blue-700 border-blue-200',
  'em produção': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'revisão': 'bg-purple-100 text-purple-700 border-purple-200',
  'finalizado': 'bg-green-100 text-green-700 border-green-200',
};
