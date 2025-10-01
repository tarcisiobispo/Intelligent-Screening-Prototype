export interface FilterConfig {
  id: string;
  name: string;
  dateRange?: {
    start: string;
    end: string;
  };
  assignee?: string;
  status?: string;
  priority?: string;
  score?: {
    min: number;
    max: number;
  };
}

export const defaultFilters: FilterConfig[] = [
  {
    id: 'all',
    name: 'Todos os documentos',
  },
  {
    id: 'high-risk',
    name: 'Alto risco',
    score: { min: 70, max: 100 },
  },
  {
    id: 'recent',
    name: 'Últimos 7 dias',
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
  },
  {
    id: 'pending-tasks',
    name: 'Tarefas pendentes',
    status: 'pending',
  },
];

export function saveCustomFilter(filter: FilterConfig) {
  const saved = JSON.parse(localStorage.getItem('customFilters') || '[]');
  const updated = saved.filter((f: FilterConfig) => f.id !== filter.id);
  updated.push(filter);
  localStorage.setItem('customFilters', JSON.stringify(updated));
}

export function getCustomFilters(): FilterConfig[] {
  return JSON.parse(localStorage.getItem('customFilters') || '[]');
}

export function deleteCustomFilter(id: string) {
  const saved = JSON.parse(localStorage.getItem('customFilters') || '[]');
  const updated = saved.filter((f: FilterConfig) => f.id !== id);
  localStorage.setItem('customFilters', JSON.stringify(updated));
}