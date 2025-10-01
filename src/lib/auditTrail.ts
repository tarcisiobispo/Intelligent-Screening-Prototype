export interface AuditEvent {
  id: string;
  documentId: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
  type: 'create' | 'update' | 'comment' | 'task' | 'process' | 'view';
}

export const auditEvents: AuditEvent[] = [
  {
    id: '1',
    documentId: 'doc_001',
    action: 'Documento criado via upload',
    user: 'Sistema',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    type: 'create',
  },
  {
    id: '2',
    documentId: 'doc_001',
    action: 'OCR processado',
    user: 'Sistema',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 + 30000).toISOString(),
    details: 'Confiança: 87%',
    type: 'process',
  },
  {
    id: '3',
    documentId: 'doc_001',
    action: 'Documento visualizado',
    user: 'João Silva',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    type: 'view',
  },
  {
    id: '4',
    documentId: 'doc_001',
    action: 'Comentário adicionado',
    user: 'Maria Santos',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    details: 'Mencionou @João Silva',
    type: 'comment',
  },
  {
    id: '5',
    documentId: 'doc_001',
    action: 'Tarefa criada',
    user: 'João Silva',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    details: 'Inspeção urgente - Alta prioridade',
    type: 'task',
  },
  {
    id: '6',
    documentId: 'doc_001',
    action: 'Campos atualizados',
    user: 'Pedro Costa',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    details: 'Temperatura corrigida: 125°C',
    type: 'update',
  },
];

export function getAuditTrail(documentId: string, filters?: {
  user?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}): AuditEvent[] {
  let events = auditEvents.filter(event => event.documentId === documentId);
  
  if (filters?.user && filters.user !== 'todos') {
    events = events.filter(event => event.user === filters.user);
  }
  
  if (filters?.action && filters.action !== 'todas') {
    events = events.filter(event => event.type === filters.action);
  }
  
  if (filters?.startDate) {
    events = events.filter(event => 
      new Date(event.timestamp) >= new Date(filters.startDate!)
    );
  }
  
  if (filters?.endDate) {
    events = events.filter(event => 
      new Date(event.timestamp) <= new Date(filters.endDate!)
    );
  }
  
  return events.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function addAuditEvent(event: Omit<AuditEvent, 'id'>): void {
  auditEvents.push({
    ...event,
    id: `audit_${Date.now()}`,
  });
}

export const actionTypes = [
  { value: 'todas', label: 'Todas as ações' },
  { value: 'create', label: 'Criação' },
  { value: 'update', label: 'Atualização' },
  { value: 'comment', label: 'Comentários' },
  { value: 'task', label: 'Tarefas' },
  { value: 'process', label: 'Processamento' },
  { value: 'view', label: 'Visualização' },
];

export const auditUsers = [
  'todos',
  'Sistema',
  'João Silva',
  'Maria Santos',
  'Pedro Costa',
  'Ana Oliveira',
];