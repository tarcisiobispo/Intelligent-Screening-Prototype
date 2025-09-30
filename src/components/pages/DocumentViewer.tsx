import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  ArrowLeft,
  Save,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Info,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Brain,
  Target,
  Zap,
  Shield,
  FileText,
  Activity,
  AlertCircle,
  Download,
  Share2,
  MoreVertical,
} from 'lucide-react';
import { mockApi, type Document } from '../../lib/mockApi';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../ui/alert';
import { motion } from 'motion/react';

interface DocumentViewerProps {
  documentId: string;
}

interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'critical';
  title: string;
  description: string;
  confidence: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function DocumentViewer({ documentId }: DocumentViewerProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [editedFields, setEditedFields] = useState<Record<string, string>>({});
  const [showTaskSheet, setShowTaskSheet] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignee: 'João Silva',
    priority: 'high' as 'high' | 'medium' | 'low',
    dueDate: '',
  });
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Custom navigation handler to work with App.tsx's router
  const handleNavigate = (path: string) => {
    const BASE = (import.meta as any).env?.BASE_URL || '/';
    const toAbsolute = (p: string) => new URL(p.replace(/^\//, ''), window.location.origin + BASE).pathname;
    
    window.history.pushState({}, '', toAbsolute(path));
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    try {
      const doc = await mockApi.getDocument(documentId);
      if (doc) {
        setDocument(doc);
        setEditedFields(doc.entities);
        
        // Pre-fill task form
        setTaskForm({
          title: `Investigar ${doc.entities.equipment || 'equipamento'} — ${doc.summary.split('.')[0]}`,
          description: doc.summary,
          assignee: 'João Silva',
          priority: doc.score > 0.7 ? 'high' : doc.score > 0.4 ? 'medium' : 'low',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        });

        // Generate AI insights
        generateAIInsights(doc);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = (doc: Document) => {
    const insights: AIInsight[] = [];

    // Critical risk insight
    if (doc.score > 0.8) {
      insights.push({
        id: '1',
        type: 'critical',
        title: 'Risco Crítico Identificado',
        description: `Score de ${(doc.score * 100).toFixed(0)}% indica necessidade de ação imediata. O sistema detectou palavras-chave de alta criticidade e recomenda intervenção urgente.`,
        confidence: 0.95,
        action: {
          label: 'Criar Tarefa Urgente',
          onClick: () => setShowTaskSheet(true),
        },
      });
    }

    // Equipment pattern insight
    if (doc.entities.equipment) {
      insights.push({
        id: '2',
        type: 'info',
        title: 'Equipamento Identificado',
        description: `O equipamento "${doc.entities.equipment}" foi detectado automaticamente. Histórico mostra 3 ocorrências similares nos últimos 6 meses.`,
        confidence: 0.88,
        action: {
          label: 'Ver Histórico',
          onClick: () => toast.info('Abrindo histórico do equipamento...'),
        },
      });
    }

    // Temperature/value anomaly
    if (doc.entities.temperature) {
      const temp = parseInt(doc.entities.temperature);
      if (temp > 100) {
        insights.push({
          id: '3',
          type: 'warning',
          title: 'Anomalia de Temperatura Detectada',
          description: `Temperatura de ${doc.entities.temperature} está 33% acima do limite operacional padrão (90°C). Recomenda-se inspeção física imediata.`,
          confidence: 0.92,
        });
      }
    }

    // OCR confidence insight
    if (doc.ocr_confidence < 0.85) {
      insights.push({
        id: '4',
        type: 'warning',
        title: 'Confiança OCR Moderada',
        description: `A confiança do OCR está em ${(doc.ocr_confidence * 100).toFixed(0)}%. Recomenda-se revisão manual dos campos extraídos para garantir precisão.`,
        confidence: 0.75,
        action: {
          label: 'Revisar Campos',
          onClick: () => setSelectedTab('fields'),
        },
      });
    }

    // Urgency prediction
    if (doc.score > 0.6) {
      insights.push({
        id: '5',
        type: 'info',
        title: 'Predição de Urgência',
        description: `Baseado em padrões históricos, documentos similares requerem resposta em até 24 horas. Tempo médio de resolução: 18 horas.`,
        confidence: 0.82,
      });
    }

    // Classification insight
    insights.push({
      id: '6',
      type: 'success',
      title: 'Classificação Automática',
      description: `Documento classificado como "${doc.type}" com ${((doc.ocr_confidence + doc.score) / 2 * 100).toFixed(0)}% de confiança. A IA identificou padrões correspondentes a relatórios técnicos de manutenção.`,
      confidence: 0.87,
    });

    setAiInsights(insights);
  };

  const handleSaveFields = () => {
    toast.success('Campos atualizados', {
      description: 'As alterações foram salvas com sucesso',
      action: {
        label: 'Desfazer',
        onClick: () => {
          setEditedFields(document?.entities || {});
          toast.info('Alterações desfeitas');
        },
      },
    });
  };

  const handleFieldChange = (key: string, value: string) => {
    setEditedFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateTask = async () => {
    try {
      const task = await mockApi.createTask({
        ...taskForm,
        documentId: documentId,
      });

      setShowTaskSheet(false);

      toast.success('Tarefa criada: ' + task.title, {
        description: 'A tarefa foi atribuída e aparecerá na lista de tarefas',
        action: {
          label: 'Ver Tarefa',
          onClick: () => handleNavigate('/tasks'),
        },
        duration: 5000,
      });
    } catch (error) {
      toast.error('Erro ao criar tarefa');
    }
  };

  const handleFeedback = async (rating: number) => {
    await mockApi.submitFeedback(documentId, {
      rating,
      comment: 'Feedback do usuário',
    });
    toast.success('Obrigado pelo feedback!', {
      description: rating === 1 
        ? 'Sua avaliação positiva ajuda a melhorar o sistema.' 
        : 'Sua avaliação ajudará a melhorar a precisão da IA.',
    });
  };

  const handleDownload = () => {
    toast.success('Download iniciado', {
      description: 'O documento está sendo preparado para download...',
    });
  };

  const handleShare = () => {
    toast.info('Compartilhar documento', {
      description: 'Link de compartilhamento copiado para a área de transferência',
    });
    navigator.clipboard.writeText(window.location.href);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'var(--danger)';
    if (score >= 0.3) return 'var(--warning)';
    return 'var(--success)';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'var(--danger)';
      case 'warning':
        return 'var(--warning)';
      case 'success':
        return 'var(--success)';
      default:
        return 'var(--primary)';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-[var(--bg)] rounded animate-pulse" />
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-[var(--bg)] rounded animate-pulse" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-[var(--bg)] rounded animate-pulse" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-[var(--muted)] mx-auto mb-4" />
        <h2 className="mb-2">Documento não encontrado</h2>
        <p className="text-[var(--muted)] mb-4">
          O documento que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => handleNavigate('/documents')}>
          Voltar para Inbox
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigate('/documents')}
            aria-label="Voltar para documentos"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="mb-1">{document.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="secondary">{document.type}</Badge>
              <Badge
                style={{
                  backgroundColor: `${getScoreColor(document.score)}20`,
                  color: getScoreColor(document.score),
                }}
              >
                Score: {(document.score * 100).toFixed(0)}%
              </Badge>
              <Badge variant="outline">
                OCR: {(document.ocr_confidence * 100).toFixed(0)}%
              </Badge>
              <span className="text-[var(--muted)] text-xs">
                {new Date(document.uploadedAt).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Baixar documento</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Compartilhar</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="outline" onClick={handleSaveFields} className="gap-2">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Salvar</span>
          </Button>

          <Sheet open={showTaskSheet} onOpenChange={setShowTaskSheet}>
            <SheetTrigger asChild>
              <Button className="gap-2 bg-[var(--primary)] hover:bg-[var(--primary-700)]">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Criar Tarefa</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-6">
              <SheetHeader className="space-y-2">
                <SheetTitle>Criar Tarefa</SheetTitle>
                <SheetDescription>
                  Criar tarefa vinculada a este documento
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Título</Label>
                  <Input
                    id="task-title"
                    value={taskForm.title}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-description">Descrição</Label>
                  <Textarea
                    id="task-description"
                    value={taskForm.description}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, description: e.target.value })
                    }
                    rows={4}
                  />
                  <p className="text-xs text-[var(--muted)]">
                    Contexto do documento incluído automaticamente
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-assignee">Responsável</Label>
                  <Select
                    value={taskForm.assignee}
                    onValueChange={(value: string) =>
                      setTaskForm({ ...taskForm, assignee: value })
                    }
                  >
                    <SelectTrigger id="task-assignee">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="João Silva">João Silva</SelectItem>
                      <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                      <SelectItem value="Pedro Costa">Pedro Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-priority">Prioridade</Label>
                  <Select
                    value={taskForm.priority}
                    onValueChange={(value: any) =>
                      setTaskForm({ ...taskForm, priority: value })
                    }
                  >
                    <SelectTrigger id="task-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-[var(--muted)]">
                    Sugerida automaticamente com base no score de risco
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-due">Data de vencimento</Label>
                  <Input
                    id="task-due"
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, dueDate: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCreateTask}
                    className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-700)]"
                  >
                    Criar Tarefa
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTaskSheet(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* AI Summary Alert */}
      <Alert className="bg-gradient-to-r from-[var(--primary)]/5 to-transparent border-l-4 border-l-[var(--primary)]">
        <Brain className="w-4 h-4 text-[var(--primary)]" />
        <AlertDescription>
          <div className="flex items-start justify-between gap-4">
            <div>
              <strong className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Resumo da IA:
              </strong>
              <p className="mt-1">{document.summary}</p>
            </div>
            {document.score > 0.7 && (
              <Badge variant="destructive" className="flex-shrink-0">
                Ação Urgente
              </Badge>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="insights">
            <Sparkles className="w-4 h-4 mr-2" />
            Insights IA
          </TabsTrigger>
          <TabsTrigger value="fields">Campos</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Document Text with Highlights */}
            <Card className="lg:sticky lg:top-20 lg:h-fit lg:max-h-[calc(100vh-8rem)] overflow-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Texto do Documento
                </CardTitle>
                <p className="text-sm text-[var(--muted)]">
                  Clique nos destaques para navegar até o campo correspondente
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 whitespace-pre-wrap font-mono text-sm">
                  {document.content?.split('\n').map((line, i) => {
                    let highlightedLine = line;
                    const highlights = document.highlights || [];

                    highlights.forEach((highlight) => {
                      if (line.includes(highlight.text)) {
                        const colorMap: Record<string, string> = {
                          risk: 'var(--danger)',
                          equipment: 'var(--primary)',
                          date: 'var(--accent)',
                          value: 'var(--success)',
                        };
                        const color = colorMap[highlight.type] || 'var(--primary)';
                        highlightedLine = highlightedLine.replace(
                          highlight.text,
                          `<mark style="background-color: ${color}20; color: ${color}; padding: 2px 4px; border-radius: 4px; cursor: pointer; font-weight: 500;" onclick="document.getElementById('field-${highlight.type}')?.scrollIntoView({behavior:'smooth',block:'center'})">${highlight.text}</mark>`
                        );
                      }
                    });

                    return (
                      <p
                        key={i}
                        dangerouslySetInnerHTML={{ __html: highlightedLine }}
                        className="leading-relaxed"
                      />
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-[var(--border)] space-y-2">
                  <div className="text-sm font-medium">Legenda de Destaques:</div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: 'rgba(214, 69, 69, 0.2)' }}
                      />
                      Risco/Criticidade
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: 'rgba(0, 91, 143, 0.2)' }}
                      />
                      Equipamento
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: 'rgba(255, 138, 0, 0.2)' }}
                      />
                      Data/Prazo
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: 'rgba(46, 204, 113, 0.2)' }}
                      />
                      Valor/Métrica
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Analysis Cards */}
            <div className="space-y-6">
              {/* Risk Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Análise de Risco
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Score de Risco</span>
                    <Badge
                      style={{
                        backgroundColor: `${getScoreColor(document.score)}20`,
                        color: getScoreColor(document.score),
                      }}
                    >
                      {(document.score * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress value={document.score * 100} className="h-2" />

                  <div className="space-y-3 mt-4">
                    <div className="flex items-start gap-2 text-sm">
                      <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--primary)]" />
                      <div>
                        <div className="font-medium">Fatores de Risco Detectados</div>
                        <div className="text-[var(--muted)] text-xs mt-0.5">
                          Palavras-chave críticas: temperatura anômala, desligamento, urgente
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <Activity className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--warning)]" />
                      <div>
                        <div className="font-medium">Contexto Operacional</div>
                        <div className="text-[var(--muted)] text-xs mt-0.5">
                          Equipamento: {editedFields.equipment || 'N/A'} | Severidade: {document.score > 0.7 ? 'Alta' : 'Moderada'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--accent)]" />
                      <div>
                        <div className="font-medium">Recomendação da IA</div>
                        <div className="text-[var(--muted)] text-xs mt-0.5">
                          {document.score > 0.7 
                            ? 'Ação imediata requerida - criar tarefa urgente e notificar equipe' 
                            : 'Monitorar situação e planejar intervenção'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* OCR Quality */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Qualidade do OCR
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Confiança</span>
                    <span className="font-medium">
                      {(document.ocr_confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={document.ocr_confidence * 100} className="h-2" />
                  <p className="text-sm text-[var(--muted)]">
                    {document.ocr_confidence > 0.85 
                      ? '✓ Alta confiança - dados extraídos são confiáveis' 
                      : '⚠ Confiança moderada - recomenda-se validação manual'}
                  </p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => setShowTaskSheet(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Criar Tarefa
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => handleNavigate('/monitoring')}
                    >
                      <Activity className="w-4 h-4" />
                      Monitorar
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4" />
                      Baixar
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4" />
                      Compartilhar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4">
            {aiInsights.map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              const color = getInsightColor(insight.type);

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border-l-4" style={{ borderLeftColor: color }}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-medium">{insight.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {(insight.confidence * 100).toFixed(0)}% confiança
                            </Badge>
                          </div>
                          <p className="text-sm text-[var(--muted)] mb-3">
                            {insight.description}
                          </p>
                          {insight.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={insight.action.onClick}
                              className="gap-2"
                            >
                              {insight.action.label}
                              <ArrowLeft className="w-3 h-3 rotate-180" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Fields Tab */}
        <TabsContent value="fields" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campos Extraídos pela IA</CardTitle>
              <p className="text-sm text-[var(--muted)]">
                Todos os campos são editáveis. Clique para modificar valores incorretos.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(editedFields).map(([key, value]) => (
                <div key={key} id={`field-${key}`}>
                  <Label htmlFor={`edit-${key}`} className="capitalize flex items-center gap-2">
                    {key}
                    {document.ocr_confidence > 0.85 && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </Label>
                  <Input
                    id={`edit-${key}`}
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    className="mt-1"
                  />
                </div>
              ))}

              {Object.keys(editedFields).length === 0 && (
                <p className="text-sm text-[var(--muted)] text-center py-8">
                  Nenhum campo foi extraído deste documento
                </p>
              )}

              {Object.keys(editedFields).length > 0 && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSaveFields}
                    className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-700)]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditedFields(document?.entities || {})}
                    className="flex-1"
                  >
                    Resetar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Audit Trail */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Histórico de Auditoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {document.auditTrail?.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex gap-3 pb-3 last:pb-0 border-b last:border-0 border-[var(--border)]"
                    >
                      <div className="mt-1">
                        {entry.action.includes('criado') ? (
                          <Plus className="w-4 h-4 text-[var(--primary)]" />
                        ) : entry.action.includes('OCR') ? (
                          <Clock className="w-4 h-4 text-[var(--warning)]" />
                        ) : (
                          <User className="w-4 h-4 text-[var(--muted)]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{entry.action}</div>
                        <div className="text-xs text-[var(--muted)]">
                          {entry.user} • {new Date(entry.timestamp).toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliação da Análise</CardTitle>
                <p className="text-sm text-[var(--muted)]">
                  Sua avaliação ajuda a melhorar a precisão da IA
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm mb-3">
                    A classificação automática foi precisa?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => handleFeedback(1)}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Sim, precisa
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => handleFeedback(0)}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Não, incorreta
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)]">
                  <Label htmlFor="feedback-comment">Comentário adicional (opcional)</Label>
                  <Textarea
                    id="feedback-comment"
                    placeholder="Descreva o que poderia ser melhorado..."
                    rows={3}
                    className="mt-2"
                  />
                  <Button variant="outline" size="sm" className="mt-2">
                    Enviar Comentário
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Mobile Sticky Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[var(--surface)] border-t border-[var(--border)] shadow-lg z-20">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSaveFields}
            className="flex-1 gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar
          </Button>
          <Button
            onClick={() => setShowTaskSheet(true)}
            className="flex-1 gap-2 bg-[var(--primary)] hover:bg-[var(--primary-700)]"
          >
            <Plus className="w-4 h-4" />
            Tarefa
          </Button>
        </div>
      </div>
    </div>
  );
}