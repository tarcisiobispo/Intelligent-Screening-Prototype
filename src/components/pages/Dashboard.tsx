import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Upload,
  Eye,
  ArrowRight,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { mockApi } from '../../lib/mockApi';
import { Alert, AlertDescription } from '../ui/alert';
import { navigate } from '../../lib/navigation';

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, chartsData] = await Promise.all([
        mockApi.getStats(),
        mockApi.getChartData(),
      ]);
      setStats(statsData);
      setChartData(chartsData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <div className="h-4 bg-[var(--bg)] rounded animate-pulse" />
                <div className="h-8 bg-[var(--bg)] rounded animate-pulse" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total de Documentos',
      value: stats?.totalDocuments,
      icon: FileText,
      color: 'blue-700',
      trend: stats?.weeklyTrend,
    },
    {
      title: 'Pendentes de Revisão',
      value: stats?.pendingReview,
      icon: Clock,
      color: 'yellow-500',
      badge: 'Requer atenção',
    },
    {
      title: 'Alta Prioridade',
      value: stats?.highPriority,
      icon: AlertTriangle,
      color: 'red-600',
      badge: 'Crítico',
    },
    {
      title: 'Baixa Confiança OCR',
      value: stats?.lowConfidence,
      icon: Eye,
      color: 'orange-500',
      action: 'Reprocessar',
    },
  ];

  const COLORS = ['#005B8F', '#4FA3D9', '#FF8A00', '#2ECC71', '#F6C85F'];

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] mb-1">Dashboard</h1>
          <p className="text-sm text-[var(--muted)]">
            Visão geral do sistema de triagem inteligente
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={() => navigate('/upload')}
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </Button>
          <Button 
            size="sm"
            className="gap-2 bg-[var(--primary)] hover:bg-[var(--primary-700)]"
            onClick={() => navigate('/documents')}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Ver Documentos</span>
          </Button>
        </div>
      </div>

      {/* Alerts */}
      <Alert 
        className="border-l-4 border-l-[var(--danger)] bg-red-50 dark:bg-red-950/20 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => navigate('/documents/doc_001')}
      >
        <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
        <AlertDescription className="text-[var(--text)]">
          <strong>Atenção:</strong> Transformador T123 com temperatura 120°C (doc_001) — 
          Recomendado desligamento imediato. <span className="underline">Clique para ver detalhes</span>
        </AlertDescription>
      </Alert>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => {
                let path = '';
                if (kpi.title === 'Total de Documentos') path = '/documents';
                else if (kpi.title === 'Pendentes de Revisão') path = '/documents';
                else if (kpi.title === 'Alta Prioridade') path = '/tasks';
                else if (kpi.title === 'Baixa Confiança OCR') path = '/documents';

                if (path) navigate(path);
              }}
            >
              <CardContent className="p-6">
                {/* Container principal para Título/Valor/Rodapé (Esquerda) e Ícone (Direita) */}
                <div className="flex items-start justify-between">

                  <div className="flex-1 flex flex-col justify-start">

                    {/* Título Flowbite: Compacto com mb-2 (8px) para o valor */}
                    <h4 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                      {kpi.title}
                    </h4>

                    {/* Valor Principal: Alinhado abaixo do título */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-extrabold text-[var(--text)]">
                        {kpi.value}
                      </span>
                    </div>

                    {/* Métrica de Rodapé: Separada por mt-4 (16px) ou mt-2 (8px) */}
                    {kpi.trend && (
                      <div className="flex items-center gap-1 text-xs text-[var(--success)] font-medium mt-4">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{kpi.trend} vs semana passada</span>
                      </div>
                    )}

                    {kpi.badge && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium mt-2"
                        style={{
                          backgroundColor: `${kpi.color}15`,
                          color: kpi.color,
                          border: 'none'
                        }}
                      >
                        {kpi.badge}
                      </Badge>
                    )}

                    {kpi.action && (
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-2 p-0 h-auto text-xs text-[var(--primary)] hover:text-[var(--primary-700)] font-medium"
                      >
                        {kpi.action} <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>

                  {/* Coluna 2: Ícone, alinhado ao topo (items-start do flex container) */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${kpi.color}10` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: kpi.color }} />
                  </div>

                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents by Day */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-[var(--text)]">Documentos por Dia</CardTitle>
            <p className="text-xs text-[var(--muted)] mt-1">Últimos 7 dias</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.documentsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  stroke="var(--muted)"
                  tick={{ fill: 'var(--muted)' }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis stroke="var(--muted)" tick={{ fill: 'var(--muted)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--primary)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Pie Chart Example */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-[var(--text)]">Distribuição por Categoria</CardTitle>
            <p className="text-xs text-[var(--muted)] mt-1">Últimos 7 dias</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.categories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="var(--primary)"
                  label
                >
                  {chartData.categories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stats Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">
                {stats.documentsToday}
              </div>
              <div className="text-sm text-[var(--muted)]">Docs hoje</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">
                {stats.avgProcessingTime}
              </div>
              <div className="text-sm text-[var(--muted)]">Tempo médio OCR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">96.5%</div>
              <div className="text-sm text-[var(--muted)]">Taxa de sucesso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">
                {stats.tasksOpen}
              </div>
              <div className="text-sm text-[var(--muted)]">Tarefas ativas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}