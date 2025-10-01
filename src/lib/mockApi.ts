// Mock API for Triagem Inteligente

export interface Document {
  id: string;
  title: string;
  type: string;
  ocr_confidence: number;
  score: number;
  summary: string;
  entities: Record<string, string>;
  uploadedAt: string;
  status: 'pending' | 'reviewed' | 'archived';
  content?: string;
  highlights?: Array<{
    text: string;
    type: 'risk' | 'equipment' | 'date' | 'value';
    position: { start: number; end: number };
  }>;
  auditTrail?: Array<{
    action: string;
    user: string;
    timestamp: string;
  }>;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  documentId: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
  createdAt: string;
}

const mockDocuments: Document[] = [
  {
    id: 'doc_001',
    title: 'Inspeção transformador T123',
    type: 'Relatório',
    ocr_confidence: 0.82,
    score: 0.95,
    summary: 'Temperatura 120°C no transformador T123. Recomendado desligamento.',
    entities: {
      equipment: 'T123',
      temperature: '120°C',
      date: '2025-09-20',
    },
    uploadedAt: '2025-09-29T10:30:00Z',
    status: 'pending',
    content: `RELATÓRIO DE INSPEÇÃO TERMOGRÁFICA
    
Data: 20 de setembro de 2025
Equipamento: Transformador T123
Responsável: João Silva

RESUMO EXECUTIVO
Durante inspeção termográfica de rotina, foi detectada temperatura anômala de 120°C no transformador T123, significativamente acima do limite operacional de 90°C.

DETALHAMENTO
O transformador T123, localizado na subestação principal, apresentou aquecimento excessivo no enrolamento primário. A temperatura registrada foi de 120°C, com delta de 30°C em relação à temperatura ambiente.

RECOMENDAÇÕES
1. URGENTE: Realizar desligamento programado do transformador
2. Inspeção detalhada dos enrolamentos
3. Análise de óleo isolante
4. Verificação do sistema de ventilação

CRITICIDADE: ALTA
Status: Requer ação imediata`,
    highlights: [
      { text: 'temperatura anômala de 120°C', type: 'risk', position: { start: 0, end: 0 } },
      { text: 'transformador T123', type: 'equipment', position: { start: 0, end: 0 } },
      { text: '20 de setembro de 2025', type: 'date', position: { start: 0, end: 0 } },
      { text: 'desligamento programado', type: 'risk', position: { start: 0, end: 0 } },
    ],
    auditTrail: [
      { action: 'Documento criado', user: 'Sistema', timestamp: '2025-09-29T10:30:00Z' },
      { action: 'OCR processado', user: 'Sistema', timestamp: '2025-09-29T10:30:15Z' },
      { action: 'Score calculado (0.95)', user: 'IA', timestamp: '2025-09-29T10:30:20Z' },
    ],
  },
  {
    id: 'doc_002',
    title: 'Laudo vibração bomba B-45',
    type: 'Laudo',
    ocr_confidence: 0.88,
    score: 0.72,
    summary: 'Vibração 2.5 mm/s; possível desalinhamento.',
    entities: {
      equipment: 'B-45',
      vibration: '2.5 mm/s',
    },
    uploadedAt: '2025-09-28T14:20:00Z',
    status: 'pending',
    content: `LAUDO TÉCNICO - ANÁLISE DE VIBRAÇÃO

Equipamento: Bomba Centrífuga B-45
Data: 28/09/2025

MEDIÇÕES REALIZADAS
Vibração radial: 2.5 mm/s
Frequência dominante: 1800 RPM
Temperatura: 68°C

DIAGNÓSTICO
A análise indica possível desalinhamento entre motor e bomba. Níveis de vibração acima do recomendado (limite: 1.8 mm/s).

AÇÕES SUGERIDAS
- Realizar alinhamento a laser
- Verificar acoplamento
- Reapertar fundação`,
    highlights: [
      { text: 'Bomba Centrífuga B-45', type: 'equipment', position: { start: 0, end: 0 } },
      { text: '2.5 mm/s', type: 'value', position: { start: 0, end: 0 } },
      { text: 'possível desalinhamento', type: 'risk', position: { start: 0, end: 0 } },
    ],
    auditTrail: [
      { action: 'Documento criado', user: 'Sistema', timestamp: '2025-09-28T14:20:00Z' },
      { action: 'OCR processado', user: 'Sistema', timestamp: '2025-09-28T14:20:12Z' },
    ],
  },
  {
    id: 'doc_003',
    title: 'NF-2025-0045',
    type: 'Nota Fiscal',
    ocr_confidence: 0.95,
    score: 0.15,
    summary: 'NF valor R$14.500',
    entities: {
      value: '14500',
      supplier: 'ABC',
    },
    uploadedAt: '2025-09-27T09:15:00Z',
    status: 'reviewed',
    content: `NOTA FISCAL ELETRÔNICA Nº 2025-0045

Fornecedor: ABC Equipamentos Ltda
Data: 27/09/2025

DISCRIMINAÇÃO
- Parafusos M16 (100 unid): R$ 5.500,00
- Porcas M16 (100 unid): R$ 3.000,00
- Arruelas (200 unid): R$ 2.000,00
- Frete: R$ 4.000,00

VALOR TOTAL: R$ 14.500,00`,
    highlights: [
      { text: 'R$ 14.500,00', type: 'value', position: { start: 0, end: 0 } },
      { text: '27/09/2025', type: 'date', position: { start: 0, end: 0 } },
    ],
    auditTrail: [
      { action: 'Documento criado', user: 'Sistema', timestamp: '2025-09-27T09:15:00Z' },
      { action: 'Revisado', user: 'Maria Santos', timestamp: '2025-09-27T11:30:00Z' },
    ],
  },
  {
    id: 'doc_004',
    title: 'Foto painel - baixa qualidade',
    type: 'Comunicação',
    ocr_confidence: 0.32,
    score: 0.50,
    summary: 'Imagem com pouco contraste; OCR baixa confiança',
    entities: {},
    uploadedAt: '2025-09-26T16:45:00Z',
    status: 'pending',
    content: `[Imagem com baixa qualidade - texto parcialmente legível]

Painel... elétrico...
...fusíveis... 220V...
...manutenção...

[Qualidade insuficiente para OCR completo]`,
    highlights: [],
    auditTrail: [
      { action: 'Documento criado', user: 'Sistema', timestamp: '2025-09-26T16:45:00Z' },
      { action: 'OCR com baixa confiança', user: 'Sistema', timestamp: '2025-09-26T16:45:08Z' },
      { action: 'Marcado para reprocessamento', user: 'Sistema', timestamp: '2025-09-26T16:45:10Z' },
    ],
  },
];

const mockTasks: Task[] = [
  {
    id: 'task_001',
    title: 'Investigar T123 — alta temperatura',
    description: 'Temperatura 120°C no transformador T123. Recomendado desligamento.',
    documentId: 'doc_001',
    assignee: 'João Silva',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2025-10-01',
    createdAt: '2025-09-29T11:00:00Z',
  },
  {
    id: 'task_002',
    title: 'Alinhar bomba B-45',
    description: 'Realizar alinhamento a laser na bomba B-45.',
    documentId: 'doc_002',
    assignee: 'Pedro Costa',
    priority: 'medium',
    status: 'todo',
    dueDate: '2025-10-05',
    createdAt: '2025-09-28T15:00:00Z',
  },
  {
    id: 'task_003',
    title: 'Reprocessar imagem painel',
    description: 'OCR com baixa confiança (32%). Solicitar nova foto ou reprocessar.',
    documentId: 'doc_004',
    assignee: 'Ana Lima',
    priority: 'low',
    status: 'todo',
    dueDate: '2025-10-08',
    createdAt: '2025-09-26T17:00:00Z',
  },
  {
    id: 'task_004',
    title: 'Verificar fornecedor ABC',
    description: 'Validar dados do fornecedor ABC Equipamentos na NF-2025-0045.',
    documentId: 'doc_003',
    assignee: 'Carlos Mendes',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2025-10-03',
    createdAt: '2025-09-27T10:00:00Z',
  },
  {
    id: 'task_005',
    title: 'Análise vibração concluída',
    description: 'Relatório de vibração da bomba B-30 aprovado e arquivado.',
    documentId: 'doc_002',
    assignee: 'Pedro Costa',
    priority: 'low',
    status: 'done',
    dueDate: '2025-09-25',
    createdAt: '2025-09-20T14:00:00Z',
  },
];

// Simulate network delay
const delay = (min: number, max: number) =>
  new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));

export const mockApi = {
  // Upload documents
  uploadDocuments: async (files: File[]): Promise<Document[]> => {
    const uploads = files.map(async (file) => {
      await delay(500, 1000);
      const confidence = 0.7 + Math.random() * 0.3;
      return {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: file.name,
        type: 'Relatório',
        ocr_confidence: confidence,
        score: Math.random(),
        summary: `Documento ${file.name} processado com sucesso`,
        entities: {},
        uploadedAt: new Date().toISOString(),
        status: 'pending' as const,
      };
    });
    return Promise.all(uploads);
  },

  // Get all documents
  getDocuments: async (filters?: {
    search?: string;
    type?: string;
    minScore?: number;
  }): Promise<Document[]> => {
    await delay(200, 400);
    let filtered = [...mockDocuments];

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(search) ||
          doc.summary.toLowerCase().includes(search)
      );
    }

    if (filters?.type) {
      filtered = filtered.filter((doc) => doc.type === filters.type);
    }

    if (filters?.minScore !== undefined) {
      filtered = filtered.filter((doc) => doc.score >= filters.minScore);
    }

    // Sort by score (high to low)
    filtered.sort((a, b) => b.score - a.score);

    return filtered;
  },

  // Get single document
  getDocument: async (id: string): Promise<Document | null> => {
    await delay(150, 300);
    return mockDocuments.find((doc) => doc.id === id) || null;
  },

  // Reprocess document
  reprocessDocument: async (id: string): Promise<Document> => {
    await delay(1500, 3000);
    const doc = mockDocuments.find((d) => d.id === id);
    if (!doc) throw new Error('Document not found');

    return {
      ...doc,
      ocr_confidence: Math.min(0.95, doc.ocr_confidence + 0.1),
      auditTrail: [
        ...(doc.auditTrail || []),
        {
          action: 'Reprocessado',
          user: 'Sistema',
          timestamp: new Date().toISOString(),
        },
      ],
    };
  },

  // Create task
  createTask: async (
    task: Omit<Task, 'id' | 'createdAt' | 'status'>
  ): Promise<Task> => {
    await delay(300, 600);
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      status: 'todo',
      createdAt: new Date().toISOString(),
    };
    mockTasks.push(newTask);
    return newTask;
  },

  // Get tasks
  getTasks: async (): Promise<Task[]> => {
    await delay(200, 400);
    return [...mockTasks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // Submit feedback
  submitFeedback: async (
    documentId: string,
    feedback: { rating: number; comment: string }
  ): Promise<void> => {
    await delay(200, 400);
    console.log('Feedback submitted:', { documentId, feedback });
  },

  // Get stats for dashboard
  getStats: async () => {
    await delay(300, 500);
    return {
      totalDocuments: mockDocuments.length,
      pendingReview: mockDocuments.filter((d) => d.status === 'pending').length,
      highPriority: mockDocuments.filter((d) => d.score > 0.7).length,
      lowConfidence: mockDocuments.filter((d) => d.ocr_confidence < 0.7).length,
      tasksOpen: mockTasks.filter((t) => t.status !== 'done').length,
      avgProcessingTime: '2.3s',
      documentsToday: 12,
      weeklyTrend: '+15%',
    };
  },

  // Get chart data
    getChartData: async () => {
      await delay(200, 300);
      return {
        documentsByDay: [
          { date: '2025-09-24', count: 8 },
          { date: '2025-09-25', count: 12 },
          { date: '2025-09-26', count: 15 },
          { date: '2025-09-27', count: 10 },
          { date: '2025-09-28', count: 14 },
          { date: '2025-09-29', count: 18 },
          { date: '2025-09-30', count: 12 },
        ],
        documentsByType: [
          { type: 'Relatório', count: 45 },
          { type: 'Laudo', count: 32 },
          { type: 'Nota Fiscal', count: 28 },
          { type: 'Comunicação', count: 15 },
        ],
        scoreDistribution: [
          { range: '0-0.2', count: 12 },
          { range: '0.2-0.4', count: 8 },
          { range: '0.4-0.6', count: 15 },
          { range: '0.6-0.8', count: 25 },
          { range: '0.8-1.0', count: 40 },
        ],
        categories: [
          { name: 'Relatório', value: 45 },
          { name: 'Laudo', value: 32 },
          { name: 'Nota Fiscal', value: 28 },
          { name: 'Comunicação', value: 15 },
        ],
      };
    },

  // Login
  login: async (email: string, password: string) => {
    await delay(500, 1000);
    
    // Demo credentials
    const validCredentials = [
      { email: 'admin@triagem.com', password: 'demo123', name: 'João Silva', role: 'Admin' },
      { email: 'user@triagem.com', password: 'demo123', name: 'Maria Santos', role: 'User' },
    ];

    const user = validCredentials.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    return {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: '',
      },
      token: `mock_token_${Date.now()}`,
    };
  },
};