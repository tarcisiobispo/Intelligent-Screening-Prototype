import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ErrorState } from '../ui/error-state';
import { EnhancedErrorState } from '../ui/enhanced-error-state';
import { DocumentCardSkeleton } from '../ui/loading-skeletons';
import { toast } from 'sonner';
import { errorMessages, getErrorMessage } from '../../lib/error-messages';
import { SmartSearch } from '../ui/smart-search';
import { CreateTaskSidebar } from '../ui/create-task-sidebar';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { performSemanticSearch } from '../../lib/semanticSearch';
import { exportToExcel, exportToPDF, sendWebhook } from '../../lib/export';
import { undoManager } from '../../lib/undo-manager';
import { globalProgress } from '../ui/global-progress';
import { StatusIndicator } from '../ui/status-indicator';
import { ContextualHelp } from '../ui/contextual-help';
import { HelpTooltip } from '../ui/tooltip';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  AlertTriangle,
  FileText,
  Star,
  Bookmark,
  Plus,
  User,
  Download,
  FileSpreadsheet,
  Send,
  Calendar,
  Upload,
  X,
} from 'lucide-react';
import { mockApi, type Document } from '../../lib/mockApi';
import { navigate } from '../../lib/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('todos');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showCreateTaskSidebar, setShowCreateTaskSidebar] = useState(false);
  const [selectedDocForTask, setSelectedDocForTask] = useState<Document | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  // Using sonner toast
  const [savedFilters] = useState([
    { id: '1', name: 'Alta Prioridade', filters: { minScore: 0.7 } },
    { id: '2', name: 'Baixa Confiança OCR', filters: { maxOcrConfidence: 0.7 } },
    { id: '3', name: 'Pendentes', filters: { status: 'pending' } },
  ]);



  useEffect(() => {
    loadDocuments();
  }, [searchQuery, typeFilter, scoreFilter, assigneeFilter, startDate, endDate]);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    globalProgress.show('Carregando documentos...');
    
    try {
      globalProgress.setProgress(25, 'Aplicando filtros...');
      const filters: any = {};

      if (searchQuery) filters.search = searchQuery;
      if (typeFilter !== 'all') filters.type = typeFilter;
      if (scoreFilter === 'high') filters.minScore = 0.7;
      if (scoreFilter === 'medium') {
        filters.minScore = 0.3;
        filters.maxScore = 0.7;
      }
      if (scoreFilter === 'low') filters.maxScore = 0.3;

      // Apply advanced filters
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (assigneeFilter && assigneeFilter !== 'todos') filters.assignee = assigneeFilter;

      let docs = await mockApi.getDocuments(filters);
      
      globalProgress.setProgress(75, 'Processando busca...');
      
      // Apply semantic search if query exists
      if (searchQuery.trim()) {
        docs = performSemanticSearch(searchQuery, docs);
      }
      
      globalProgress.setProgress(100, 'Concluído!');
      setDocuments(docs);
      
      setTimeout(() => globalProgress.hide(), 500);
    } catch (error) {
      console.error('Error loading documents:', error);
      setError('DOCUMENTS_LOAD_FAILED');
      globalProgress.hide();
    } finally {
      setLoading(false);
    }
  };

  const applySavedFilter = (filter: any) => {
    if (filter.minScore) {
      setScoreFilter('high');
    }
    // In real app, would apply all filter criteria
  };

  const getScoreBadge = (score: number) => {
    if (score >= 0.7) {
      return {
        label: 'Alto',
        color: 'var(--danger)',
        bgColor: 'rgba(214, 69, 69, 0.1)',
      };
    } else if (score >= 0.3) {
      return {
        label: 'Médio',
        color: 'var(--warning)',
        bgColor: 'rgba(246, 200, 95, 0.1)',
      };
    } else {
      return {
        label: 'Baixo',
        color: 'var(--success)',
        bgColor: 'rgba(46, 204, 113, 0.1)',
      };
    }
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Alta';
    if (confidence >= 0.5) return 'Média';
    return 'Baixa';
  };

  const handleSelectDoc = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    setSelectedDocs(selectedDocs.length === documents.length ? [] : documents.map(d => d.id));
  };

  const handleBulkCreateTasks = () => {
    console.log('Clicou em bulk create tasks');
    // Para bulk actions, abre sidebar sem documento específico
    setSelectedDocForTask(null);
    setShowCreateTaskSidebar(true);
  };

  const handleBulkArchive = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Arquivar Documentos',
      message: `Tem certeza que deseja arquivar ${selectedDocs.length} documento${selectedDocs.length > 1 ? 's' : ''}? Esta ação pode ser desfeita.`,
      onConfirm: async () => {
        const originalDocs = [...selectedDocs];
        const loadingId = toast.loading('Arquivando...', `Processando ${selectedDocs.length} documentos`);
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          toast.dismiss(loadingId);
          setSelectedDocs([]);
          
          // Adicionar ação de desfazer
          undoManager.addAction(
            `${originalDocs.length} documento${originalDocs.length > 1 ? 's' : ''} arquivado${originalDocs.length > 1 ? 's' : ''}`,
            async () => {
              setSelectedDocs(originalDocs);
              await loadDocuments();
            }
          );
        } catch (error) {
          toast.dismiss(loadingId);
          toast.error('Erro ao arquivar', 'Tente novamente');
        }
      }
    });
  };

  const handleBulkReprocess = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reprocessar Documentos',
      message: `Reprocessar ${selectedDocs.length} documento${selectedDocs.length > 1 ? 's' : ''}? O OCR será executado novamente.`,
      onConfirm: async () => {
        const loadingId = toast.loading('Reprocessando...', `OCR sendo executado em ${selectedDocs.length} documentos`);
        try {
          await new Promise(resolve => setTimeout(resolve, 3000));
          toast.dismiss(loadingId);
          toast.success('Reprocessamento concluído!', `${selectedDocs.length} documentos foram reprocessados`);
          setSelectedDocs([]);
        } catch (error) {
          toast.dismiss(loadingId);
          toast.error('Erro ao reprocessar', 'Tente novamente');
        }
      }
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Documentos</h1>
          <div className="flex items-center gap-3">
            <p className="text-[var(--muted)]">
              {documents.length} documentos encontrados
              {searchQuery && ` para "${searchQuery}"`}
              {!searchQuery && ` • Ordenados por prioridade`}
            </p>
            {loading && (
              <StatusIndicator status="loading" message="Carregando..." size="sm" />
            )}
          </div>
        </div>
        
        {/* Export Actions */}
        <div className="flex gap-2">
          <ContextualHelp topic="documents" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {
                exportToExcel(documents, 'documentos');
                toast.success('Export realizado!', {
                  description: 'Arquivo Excel baixado com sucesso'
                });
              }}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel (.csv)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                exportToPDF(documents, 'documentos');
                toast.success('Export realizado!', {
                  description: 'Arquivo PDF baixado com sucesso'
                });
              }}>
                <FileText className="w-4 h-4 mr-2" />
                PDF (.html)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={async () => {
              const loadingToast = toast.loading('Enviando webhook...');
              
              try {
                const result = await sendWebhook('documents_export', {
                  count: documents.length,
                  filters: { searchQuery, typeFilter, scoreFilter, assigneeFilter }
                });
                
                toast.dismiss(loadingToast);
                
                if (result.success) {
                  toast.success('Webhook enviado!', {
                    description: result.message
                  });
                } else {
                  toast.error('Erro no webhook', {
                    description: result.message
                  });
                }
              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error('Falha ao enviar webhook');
              }
            }}
          >
            <Send className="w-4 h-4" />
            Integrar
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedDocs.length > 0 && (
        <Card className="bg-[var(--primary)]/5 border-[var(--primary)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {selectedDocs.length} documento{selectedDocs.length > 1 ? 's' : ''} selecionado{selectedDocs.length > 1 ? 's' : ''}
                </span>
                <Button variant="outline" size="sm" onClick={() => setSelectedDocs([])}>
                  Desmarcar
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkCreateTasks} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Criar Tarefas
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkReprocess} className="gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  Reprocessar
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkArchive} className="gap-2">
                  <FileText className="w-4 h-4" />
                  Arquivar
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  const selectedDocuments = documents.filter(doc => selectedDocs.includes(doc.id));
                  exportToExcel(selectedDocuments, 'documentos-selecionados');
                  toast.success('Export realizado!', `${selectedDocs.length} documentos exportados`);
                }} className="gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setSelectedDocs([]);
                  toast.success('Seleção limpa', 'Todos os documentos desmarcados');
                }} className="gap-2">
                  <X className="w-4 h-4" />
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Smart Search */}
            <SmartSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Busque por equipamento, risco, temperatura ou qualquer palavra-chave..."
            />

            {/* Filter Controls */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedDocs.length === documents.length && documents.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-[var(--border)]"
                />
                <label className="text-sm font-medium">Marcar todos</label>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="space-y-1 w-36">
                <label className="text-xs font-medium text-[var(--muted)]">
                  Responsável
                </label>
                <div className="relative">
                  <Input
                    value={assigneeFilter === 'todos' ? '' : assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value || 'todos')}
                    placeholder="Digite o nome"
                    className="h-8 pl-8 text-sm"
                  />
                  <User className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                </div>
              </div>

              <div className="space-y-1 w-32">
                <label className="text-xs font-medium text-[var(--muted)]">
                  Tipo
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger size="sm" className="text-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Relatório">Relatório</SelectItem>
                    <SelectItem value="Laudo">Laudo</SelectItem>
                    <SelectItem value="Nota Fiscal">Nota Fiscal</SelectItem>
                    <SelectItem value="Comunicação">Comunicação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 w-28">
                <label className="text-xs font-medium text-[var(--muted)]">
                  Score
                </label>
                <Select value={scoreFilter} onValueChange={setScoreFilter}>
                  <SelectTrigger size="sm" className="text-sm">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="high">Alto (≥70%)</SelectItem>
                    <SelectItem value="medium">Médio (30-70%)</SelectItem>
                    <SelectItem value="low">Baixo (&lt;30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 w-32">
                <label className="text-xs font-medium text-[var(--muted)]">
                  Data Inicial
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-8 text-sm pl-8"
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'textfield'
                    } as any}
                  />
                  <Calendar className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                </div>
              </div>
              
              <div className="space-y-1 w-32">
                <label className="text-xs font-medium text-[var(--muted)]">
                  Data Final
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-8 text-sm pl-8"
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'textfield'
                    } as any}
                  />
                  <Calendar className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <DocumentCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <EnhancedErrorState
          error={getErrorMessage(error)}
          onRetry={loadDocuments}
        />
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-[var(--muted)]" />
            <p className="text-[var(--muted)]">Nenhum documento corresponde aos filtros</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => {
            const scoreBadge = getScoreBadge(doc.score);
            const isLowConfidence = doc.ocr_confidence < 0.7;

            return (
              <Card
                key={doc.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedDocs.includes(doc.id)}
                          onChange={() => handleSelectDoc(doc.id)}
                          className="mt-1 rounded border-[var(--border)]"
                        />
                        <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg">{doc.title}</h3>
                          {isLowConfidence && (
                            <AlertTriangle className="w-4 h-4 text-[var(--warning)] flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                          <Badge variant="secondary">{doc.type}</Badge>
                          <Badge
                            style={{
                              backgroundColor: scoreBadge.bgColor,
                              color: scoreBadge.color,
                            }}
                          >
                            Score: {scoreBadge.label} ({(doc.score * 100).toFixed(0)}%)
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              isLowConfidence ? 'border-[var(--warning)]' : ''
                            }
                          >
                            OCR: {getConfidenceLabel(doc.ocr_confidence)} (
                            {(doc.ocr_confidence * 100).toFixed(0)}%)
                          </Badge>
                          {searchQuery && (doc as any).searchScore && (
                            <Badge variant="outline" className="gap-1">
                              <Search className="w-3 h-3" />
                              Relevância: {Math.round((doc as any).searchScore / 10)}
                            </Badge>
                          )}
                          <Badge variant="outline" className="gap-1">
                            <Calendar className="w-3 h-3" />
                            Evento: {doc.entities.date || '20/09/2025'}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Upload className="w-3 h-3" />
                            Processado: {new Date(doc.uploadedAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </Badge>
                        </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="text-[var(--text)]">
                      {doc.summary.split('\n').slice(0, 3).map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>



                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                      <div className="text-sm text-[var(--muted)]">
                        {doc.status === 'pending' ? 'Aguardando revisão' : 'Revisado'}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            setSelectedDocForTask(doc);
                            setShowCreateTaskSidebar(true);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          Criar Tarefa
                        </Button>
                        <Button
                          size="sm"
                          className="gap-2 bg-[var(--primary)] hover:bg-[var(--primary-700)]"
                          onClick={() => navigate(`/documents/${doc.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                          Revisar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Task Sidebar */}
      <CreateTaskSidebar
        isOpen={showCreateTaskSidebar}
        onClose={() => {
          setShowCreateTaskSidebar(false);
          setSelectedDocForTask(null);
        }}
        document={selectedDocForTask || undefined}
        selectedDocsCount={selectedDocForTask ? undefined : selectedDocs.length}
        onTaskCreated={selectedDocForTask ? undefined : () => setSelectedDocs([])}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
    </div>
  );
}