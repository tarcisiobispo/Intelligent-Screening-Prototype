import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ErrorState } from '../ui/error-state';
import { EnhancedErrorState } from '../ui/enhanced-error-state';
import { DashboardCardSkeleton, ChartSkeleton } from '../ui/loading-skeletons';
import { errorMessages, getErrorMessage } from '../../lib/error-messages';
import { AccessibleChart } from '../ui/accessible-chart';
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
  Settings,
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
import { globalProgress } from '../ui/global-progress';
import { StatusIndicator } from '../ui/status-indicator';
import { DashboardCustomizer } from '../ui/dashboard-customizer';
import { dashboardCustomization, type DashboardLayout } from '../../lib/dashboard-customization';
import { ContextualHelp } from '../ui/contextual-help';
import { HelpTooltip } from '../ui/tooltip';

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
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [layout, setLayout] = useState<DashboardLayout>(dashboardCustomization.getLayout());

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
    globalProgress.show('Carregando dashboard...');
    
    try {
      globalProgress.setProgress(30, 'Buscando estatísticas...');
      const [statsData, chartsData] = await Promise.all([
        mockApi.getStats(),
        mockApi.getChartData(),
      ]);
      
      globalProgress.setProgress(80, 'Processando gráficos...');
      setStats(statsData);
      setChartData(chartsData);
      const data = getDashboardData(filters);
      setDashboardData(data);
      
      globalProgress.setProgress(100, 'Dashboard atualizado!');
      setTimeout(() => globalProgress.hide(), 500);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('NETWORK_ERROR');
      globalProgress.hide();
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
        <EnhancedErrorState
          error={getErrorMessage(error)}
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
          <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Central de Monitoramento</h1>
          <div className="flex items-center gap-3">
            <p className="text-sm text-[var(--muted)]">
              Visão executiva em tempo real com gráficos interativos e análise detalhada
            </p>
            {loading && (
              <StatusIndicator status="loading" message="Atualizando..." size="sm" />
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <ContextualHelp topic="dashboard" />
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={() => setShowCustomizer(true)}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Personalizar</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={() => navigate('/upload')}
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Envio</span>
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
        className="border-l-4 border-l-[var(--danger)] bg-red-50 dark:bg-red-950/20 cursor-pointer hover:shadow-md transition-shadow mb-6"
        onClick={() => navigate('/documents/doc_001')}
      >
        <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
        <AlertDescription className="text-[var(--text)]">
          <strong>Ação Necessária:</strong> Transformador T123 com temperatura crítica de 120°C — 
          Desligamento urgente recomendado. <span className="underline">Ver documento</span>
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
                          <span className="truncate">{kpi.trend} esta semana</span>
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
                          {kpi.action} <ArrowRight className="w-3 h-3 ml-1" />
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
        <CardHeader className="p-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Filter className="w-5 h-5" />
            Personalizar Visualização
            <HelpTooltip content="Use os filtros para focar nos dados mais importantes. Deixe campos vazios para mostrar todos os resultados." />
          </CardTitle>
          <p className="text-sm text-[var(--muted)]">
            Ajuste os filtros para focar nos dados que mais importam para você
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-2">
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
          <AccessibleChart
            title="Documentos por Tipo"
            description="Quantidade de cada tipo processado. Clique nas barras para mais detalhes."
            data={dashboardData.documentsByType}
            type="bar"
            onDrillDown={handleDrillDown}
          />

          {/* Tarefas por Status - Interativo */}
          <AccessibleChart
            title="Tarefas por Status"
            description="Situação atual das tarefas. Clique nas fatias para ver detalhes."
            data={dashboardData.tasksByStatus}
            type="pie"
            onDrillDown={handleDrillDown}
          />
        </div>
      )}

      {/* Tendência de Processamento - Linha */}
      {dashboardData && (
        <div className="mb-6">
          <AccessibleChart
            title="Volume de Processamento"
            description="Evolução do volume processado ao longo do tempo. Linha crescente = maior produtividade."
            data={dashboardData.processingTrend}
            type="line"
            onDrillDown={handleDrillDown}
            height={250}
          />
        </div>
      )}

      {/* Dashboard Customizer */}
      <DashboardCustomizer
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
        onLayoutChange={setLayout}
      />
    </div>
  );
}