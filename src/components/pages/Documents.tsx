import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
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
  const [savedFilters] = useState([
    { id: '1', name: 'Alta Prioridade', filters: { minScore: 0.7 } },
    { id: '2', name: 'Baixa Confiança OCR', filters: { maxOcrConfidence: 0.7 } },
    { id: '3', name: 'Pendentes', filters: { status: 'pending' } },
  ]);



  useEffect(() => {
    loadDocuments();
  }, [searchQuery, typeFilter, scoreFilter]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const filters: any = {};

      if (searchQuery) filters.search = searchQuery;
      if (typeFilter !== 'all') filters.type = typeFilter;
      if (scoreFilter === 'high') filters.minScore = 0.7;
      if (scoreFilter === 'medium') {
        filters.minScore = 0.3;
        filters.maxScore = 0.7;
      }
      if (scoreFilter === 'low') filters.maxScore = 0.3;

      const docs = await mockApi.getDocuments(filters);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
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

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="mb-2">Inbox de Documentos</h1>
          <p className="text-[var(--muted)]">
            {documents.length} documentos • Ordenados por score
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
              <Input
                placeholder="Busca semântica: equipamento, risco, temperatura..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="Relatório">Relatório</SelectItem>
                  <SelectItem value="Laudo">Laudo</SelectItem>
                  <SelectItem value="Nota Fiscal">Nota Fiscal</SelectItem>
                  <SelectItem value="Comunicação">Comunicação</SelectItem>
                </SelectContent>
              </Select>

              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os scores</SelectItem>
                  <SelectItem value="high">Alto (≥70%)</SelectItem>
                  <SelectItem value="medium">Médio (30-70%)</SelectItem>
                  <SelectItem value="low">Baixo (&lt;30%)</SelectItem>
                </SelectContent>
              </Select>

              {/* Saved Filters */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Bookmark className="w-4 h-4" />
                    Filtros Salvos
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Meus Filtros</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {savedFilters.map((filter) => (
                    <DropdownMenuItem
                      key={filter.id}
                      onClick={() => applySavedFilter(filter.filters)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {filter.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="text-[var(--primary)]">+ Salvar filtro atual</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="h-4 bg-[var(--bg)] rounded animate-pulse" />
                  <div className="h-4 bg-[var(--bg)] rounded animate-pulse w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-[var(--muted)]" />
            <p className="text-[var(--muted)]">Nenhum documento encontrado</p>
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
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
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
                          <span>
                            {new Date(doc.uploadedAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="text-[var(--text)]">
                      {doc.summary.split('\n').slice(0, 3).map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>

                    {/* Entities */}
                    {Object.keys(doc.entities).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(doc.entities).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                      <div className="text-sm text-[var(--muted)]">
                        {doc.status === 'pending' ? 'Pendente de revisão' : 'Revisado'}
                      </div>
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}