import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ErrorState } from '../ui/error-state';
import { DashboardCardSkeleton, ChartSkeleton } from '../ui/loading-skeletons';
import { InteractiveChart } from '../ui/interactive-chart';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Upload,
  Eye,
  ArrowRight,
  Filter,
  Calendar,
  User,
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
import { getDashboardData, periodOptions, typeOptions, assigneeOptions, type DashboardFilters } from '../../lib/dashboardData';
import { toast } from 'sonner';

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    period: '30d',
    type: 'all',
    assignee: 'todos',
    startDate: '',
    endDate: ''
  });
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (stats) {
      const data = getDashboardData(filters);
      setDashboardData(data);
    }
  }, [filters, stats]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, chartsData] = await Promise.all([
        mockApi.getStats(),
        mockApi.getChartData(),
      ]);
      setStats(statsData);
      setChartData(chartsData);
      const data = getDashboardData(filters);
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Erro ao carregar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrillDown = (point: any) => {
    toast.success('Drill-down ativado', {
      description: `Explorando dados de: ${point.label}`
    });
  };

  const applyFilters = () => {
    if (stats) {
      const data = getDashboardData(filters);
      setDashboardData(data);
      toast.success('Filtros aplicados', {
        description: 'Dashboard atualizado com os novos filtros'
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1600px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1600px]">
        <ErrorState
          title="Erro no Dashboard"
          message={error}
          onRetry={loadData}
        />
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
      title: 'OCR Inexato',
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] mb-1">Central de Monitoramento</h1>
          <p className="text-sm text-[var(--muted)]">
            Visão executiva em tempo real com gráficos interativos e análise detalhada
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

      {/* Resumo Geral do Sistema */}
      <Card className="mb-6">
        <CardHeader className="px-4 pt-2 pb-0">
          <CardTitle className="text-base font-bold">Resumo Geral do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-2 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">
                {stats?.totalDocuments || 0}
              </div>
              <div className="text-sm text-[var(--muted)]">Total Documentos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">
                {(stats?.totalDocuments || 0) - (stats?.pendingReview || 0)}
              </div>
              <div className="text-sm text-[var(--muted)]">Processados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--warning)]">
                2.8min
              </div>
              <div className="text-sm text-[var(--muted)]">Tempo Médio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--success)]">
                94%
              </div>
              <div className="text-sm text-[var(--muted)]">Taxa de Sucesso</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Alert 
        className="border-l-4 border-l-[var(--danger)] bg-red-50 dark:bg-red-950/20 cursor-pointer hover:shadow-md transition-shadow mb-6"
        onClick={() => navigate('/documents/doc_001')}
      >
        <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
        <AlertDescription className="text-[var(--text)]">
          <strong>Atenção:</strong> Transformador T123 com temperatura 120°C (doc_001) — 
          Recomendado desligamento imediato. <span className="underline">Clique para ver detalhes</span>
        </AlertDescription>
      </Alert>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-28"
              onClick={() => {
                let path = '';
                if (kpi.title === 'Total de Documentos') path = '/documents';
                else if (kpi.title === 'Pendentes de Revisão') path = '/documents';
                else if (kpi.title === 'Alta Prioridade') path = '/tasks';
                else if (kpi.title === 'OCR Inexato') path = '/documents';

                if (path) navigate(path);
              }}
            >
              <CardContent className="p-3 h-full flex flex-col justify-between">
                {/* Subgrupo Principal */}
                <div className="flex items-center">
                  {/* Ícone Grande à Esquerda */}
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${kpi.color}15` }}
                  >
                    <Icon className="w-6 h-6 sm:w-6 sm:h-6" style={{ color: kpi.color }} />
                  </div>

                  {/* Conteúdo ao Lado */}
                  <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                    <h4 className="text-sm sm:text-sm font-medium text-[var(--muted)] leading-tight">
                      {kpi.title}
                    </h4>
                    <div className="flex justify-end">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] leading-none">
                        {kpi.value}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Linha Separadora + Rodapé */}
                {(kpi.trend || kpi.badge || kpi.action) && (
                  <>
                    <div className="border-t border-[var(--border)] mb-1"></div>
                    <div className="text-xs flex justify-center">
                      {kpi.trend && (
                        <div className="flex items-center gap-1 text-xs text-[var(--success)] font-medium">
                          <TrendingUp className="w-3 h-3" />
                          <span className="truncate">{kpi.trend} vs semana</span>
                        </div>
                      )}

                      {kpi.badge && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium w-fit"
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
                          className="p-0 h-auto text-xs text-[var(--primary)] hover:text-[var(--primary-700)] font-medium"
                        >
                          {kpi.action} <ArrowRight className="w-1.5 h-1.5 ml-1" />
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>



      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Filter className="w-5 h-5" />
            Filtros do Dashboard
          </CardTitle>
          <p className="text-sm text-[var(--muted)]">
            Use os filtros abaixo para personalizar os gráficos interativos. Clique em "Aplicar" para atualizar os dados.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1 w-36">
              <label className="text-xs font-medium text-[var(--muted)]">Período</label>
              <Select value={filters.period} onValueChange={(value: string) => setFilters({...filters, period: value})}>
                <SelectTrigger size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 w-36">
              <label className="text-xs font-medium text-[var(--muted)]">Tipo</label>
              <Select value={filters.type} onValueChange={(value: string) => setFilters({...filters, type: value})}>
                <SelectTrigger size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 w-36">
              <label className="text-xs font-medium text-[var(--muted)]">Responsável</label>
              <div className="relative">
                <Input
                  value={filters.assignee === 'todos' ? '' : filters.assignee}
                  onChange={(e) => setFilters({...filters, assignee: e.target.value || 'todos'})}
                  placeholder="Nome do responsável"
                  className="h-8 pl-8 text-sm"
                />
                <User className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
              </div>
            </div>

            <div className="space-y-1 w-24">
              <label className="text-xs font-medium text-[var(--muted)]">&nbsp;</label>
              <Button onClick={applyFilters} size="sm" className="gap-2 h-8 w-full">
                <Filter className="w-4 h-4" />
                Aplicar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Interativos */}
      {dashboardData && (
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Documentos por Tipo - Interativo */}
          <InteractiveChart
            title="Documentos por Tipo"
            description="Quantidade de cada tipo de documento processado. Clique nas barras para ver detalhes por score."
            data={dashboardData.documentsByType}
            type="bar"
            onDrillDown={handleDrillDown}
          />

          {/* Tarefas por Status - Interativo */}
          <InteractiveChart
            title="Tarefas por Status"
            description="Distribuição das tarefas por situação atual. Clique nas fatias para ver por responsável."
            data={dashboardData.tasksByStatus}
            type="pie"
            onDrillDown={handleDrillDown}
          />
        </div>
      )}

      {/* Tendência de Processamento - Linha */}
      {dashboardData && (
        <div className="mb-6">
          <InteractiveChart
            title="Volume de Documentos Processados"
            description="Evolução da quantidade de documentos processados ao longo do tempo. Linha crescente indica maior produtividade."
            data={dashboardData.processingTrend}
            type="line"
            onDrillDown={handleDrillDown}
            height={250}
          />
        </div>
      )}


    </div>
  );
}