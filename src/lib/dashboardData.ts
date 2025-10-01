export interface DashboardFilters {
  period: string;
  type: string;
  assignee: string;
  startDate: string;
  endDate: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
  drillDown?: ChartDataPoint[];
  metadata?: any;
}

// Cores consistentes para categorias específicas
const getColorForCategory = (name: string): string => {
  const colorMap: { [key: string]: string } = {
    'Pendente': '#FF8042',
    'Em Andamento': '#FFBB28', 
    'Concluído': '#00C49F',
    'Concluídas': '#00C49F',
    'Cancelado': '#FF6B6B',
    'Alta': '#FF4444',
    'Média': '#FFA500',
    'Baixa': '#00C49F',
    'Crítica': '#8B0000',
    'João Silva': '#0088FE',
    'Maria Santos': '#00C49F',
    'Pedro Costa': '#FFBB28',
    'Ana Oliveira': '#FF8042',
    'Carlos Lima': '#8884D8',
    'Relatório': '#0088FE',
    'Laudo': '#00C49F',
    'Nota Fiscal': '#FFBB28',
    'Comunicação': '#FF8042',
    'Documentos': '#0088FE',
    'Tarefas': '#00C49F',
    'Relatórios': '#FFBB28',
    'Análises': '#FF8042',
    'Pendentes': '#FF8042',
    'Alta Prioridade': '#FF4444',
    'Média Prioridade': '#FFA500',
    'Baixa Prioridade': '#00C49F',
    'Processados': '#00C49F',
    'Com Erro': '#FF4444',
    'Alto Score (>70%)': '#00C49F',
    'Médio Score (30-70%)': '#FFBB28',
    'Baixo Score (<30%)': '#FF8042'
  };
  
  return colorMap[name] || `hsl(${Math.abs(name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 360}, 70%, 50%)`;
};

// Dados base para diferentes períodos
const generateDocumentsByType = (period: string) => {
  const baseData = {
    'Relatório': { base: 45 },
    'Laudo': { base: 32 },
    'Nota Fiscal': { base: 28 },
    'Comunicação': { base: 15 }
  };

  const multiplier = period === '7d' ? 0.3 : period === '30d' ? 1 : period === '90d' ? 2.5 : 4;

  return Object.entries(baseData).map(([type, config]) => ({
    label: type,
    value: Math.round(config.base * multiplier),
    color: getColorForCategory(type),
    drillDown: [
      { label: 'Alto Score (>70%)', value: Math.round(config.base * multiplier * 0.4), color: getColorForCategory('Alto Score (>70%)') },
      { label: 'Médio Score (30-70%)', value: Math.round(config.base * multiplier * 0.45), color: getColorForCategory('Médio Score (30-70%)') },
      { label: 'Baixo Score (<30%)', value: Math.round(config.base * multiplier * 0.15), color: getColorForCategory('Baixo Score (<30%)') }
    ]
  }));
};

const generateTasksByStatus = (period: string) => {
  const multiplier = period === '7d' ? 0.4 : period === '30d' ? 1 : period === '90d' ? 2.2 : 3.8;
  
  return [
    {
      label: 'Concluídas',
      value: Math.round(25 * multiplier),
      color: getColorForCategory('Concluídas'),
      drillDown: [
        { label: 'João Silva', value: Math.round(8 * multiplier), color: getColorForCategory('João Silva') },
        { label: 'Maria Santos', value: Math.round(7 * multiplier), color: getColorForCategory('Maria Santos') },
        { label: 'Pedro Costa', value: Math.round(6 * multiplier), color: getColorForCategory('Pedro Costa') },
        { label: 'Ana Oliveira', value: Math.round(4 * multiplier), color: getColorForCategory('Ana Oliveira') }
      ]
    },
    {
      label: 'Em Andamento',
      value: Math.round(18 * multiplier),
      color: getColorForCategory('Em Andamento'),
      drillDown: [
        { label: 'João Silva', value: Math.round(5 * multiplier), color: getColorForCategory('João Silva') },
        { label: 'Maria Santos', value: Math.round(6 * multiplier), color: getColorForCategory('Maria Santos') },
        { label: 'Pedro Costa', value: Math.round(4 * multiplier), color: getColorForCategory('Pedro Costa') },
        { label: 'Ana Oliveira', value: Math.round(3 * multiplier), color: getColorForCategory('Ana Oliveira') }
      ]
    },
    {
      label: 'Pendentes',
      value: Math.round(12 * multiplier),
      color: getColorForCategory('Pendentes'),
      drillDown: [
        { label: 'Alta Prioridade', value: Math.round(4 * multiplier), color: getColorForCategory('Alta Prioridade') },
        { label: 'Média Prioridade', value: Math.round(5 * multiplier), color: getColorForCategory('Média Prioridade') },
        { label: 'Baixa Prioridade', value: Math.round(3 * multiplier), color: getColorForCategory('Baixa Prioridade') }
      ]
    }
  ];
};

const generateProcessingTrend = (period: string) => {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const data = [];
  
  for (let i = 0; i < Math.min(days, 12); i++) {
    const baseValue = 15 + Math.sin(i * 0.5) * 5 + Math.random() * 3;
    const label = period === '7d' ? `Dia ${i + 1}` : 
                  period === '30d' ? `Sem ${Math.floor(i / 7) + 1}` :
                  `Mês ${i + 1}`;
    
    data.push({
      label,
      value: Math.round(baseValue),
      color: getColorForCategory(label),
      drillDown: [
        { label: 'Processados', value: Math.round(baseValue * 0.8), color: getColorForCategory('Processados') },
        { label: 'Com Erro', value: Math.round(baseValue * 0.15), color: getColorForCategory('Com Erro') },
        { label: 'Pendentes', value: Math.round(baseValue * 0.05), color: getColorForCategory('Pendentes') }
      ]
    });
  }
  
  return data;
};

export const getDashboardData = (filters: DashboardFilters) => {
  // Aplicar filtros aos dados
  let documentsByType = generateDocumentsByType(filters.period);
  let tasksByStatus = generateTasksByStatus(filters.period);
  let processingTrend = generateProcessingTrend(filters.period);

  // Filtrar por tipo se especificado
  if (filters.type && filters.type !== 'all') {
    documentsByType = documentsByType.filter(item => 
      item.label.toLowerCase().includes(filters.type.toLowerCase())
    );
  }

  // Filtrar por responsável se especificado
  if (filters.assignee && filters.assignee !== 'todos') {
    tasksByStatus = tasksByStatus.map(status => ({
      ...status,
      drillDown: status.drillDown?.filter(item => 
        item.label.toLowerCase().includes(filters.assignee.toLowerCase())
      ) || []
    }));
  }

  return {
    documentsByType,
    tasksByStatus,
    processingTrend,
    summary: {
      totalDocuments: documentsByType.reduce((sum, item) => sum + item.value, 0),
      totalTasks: tasksByStatus.reduce((sum, item) => sum + item.value, 0),
      avgProcessingTime: Math.round(2.5 + Math.random() * 1.5),
      successRate: Math.round(85 + Math.random() * 10)
    }
  };
};

export const periodOptions = [
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
  { value: '1y', label: 'Último ano' }
];

export const typeOptions = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'relatorio', label: 'Relatórios' },
  { value: 'laudo', label: 'Laudos' },
  { value: 'nota', label: 'Notas Fiscais' },
  { value: 'comunicacao', label: 'Comunicações' }
];

export const assigneeOptions = [
  { value: 'todos', label: 'Todos os responsáveis' },
  { value: 'joao', label: 'João Silva' },
  { value: 'maria', label: 'Maria Santos' },
  { value: 'pedro', label: 'Pedro Costa' },
  { value: 'ana', label: 'Ana Oliveira' }
];