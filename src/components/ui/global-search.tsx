import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './card';
import { Input } from './input';
import { Badge } from './badge';
import { Button } from './button';
import { Search, FileText, CheckSquare, User, Clock, X } from 'lucide-react';
import { mockApi } from '../../lib/mockApi';
import { navigate } from '../../lib/navigation';

interface SearchResult {
  id: string;
  title: string;
  type: 'document' | 'task' | 'user';
  description: string;
  url: string;
  score?: number;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      loadRecentSearches();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const loadRecentSearches = () => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  };

  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const [documents, tasks] = await Promise.all([
      mockApi.getDocuments({ search: searchQuery }),
      mockApi.getTasks()
    ]);

    const searchResults: SearchResult[] = [
      ...documents.slice(0, 3).map(doc => ({
        id: doc.id,
        title: doc.title,
        type: 'document' as const,
        description: doc.summary.slice(0, 100) + '...',
        url: `/documents/${doc.id}`,
        score: doc.score
      })),
      ...tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3).map(task => ({
        id: task.id,
        title: task.title,
        type: 'task' as const,
        description: task.description.slice(0, 100) + '...',
        url: `/tasks`
      })),
      // Mock users
      ...['João Silva', 'Maria Santos', 'Pedro Costa']
        .filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(name => ({
          id: name.replace(' ', '-').toLowerCase(),
          title: name,
          type: 'user' as const,
          description: 'Usuário do sistema',
          url: `/admin`
        }))
    ];

    setResults(searchResults);
    setSelectedIndex(0);
  };

  const handleSelectResult = (result: SearchResult) => {
    saveRecentSearch(query);
    navigate(result.url);
    onClose();
    setQuery('');
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    performSearch(search);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'task': return CheckSquare;
      case 'user': return User;
      default: return Search;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'document': return 'Documento';
      case 'task': return 'Tarefa';
      case 'user': return 'Usuário';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-50">
      <Card className="w-full max-w-md mx-4 bg-[var(--surface)] border border-[var(--border)] shadow-xl">
        <CardContent className="p-0">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
            <Search className="w-5 h-5 text-[var(--muted)]" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                performSearch(e.target.value);
              }}
              placeholder="Buscar documentos, tarefas, pessoas..."
              className="border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Results */}
          <div className="max-h-64 overflow-y-auto">
            {query.trim() === '' && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-[var(--muted)]" />
                  <span className="text-sm font-medium text-[var(--muted)]">Buscas Recentes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecentSearch(search)}
                      className="text-xs"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-2">
                {results.map((result, index) => {
                  const Icon = getIcon(result.type);
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <div
                      key={result.id}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-[var(--primary)]/10' : 'hover:bg-[var(--bg)]'
                      }`}
                      onClick={() => handleSelectResult(result)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[var(--primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">{result.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(result.type)}
                          </Badge>
                          {result.score && result.score > 0.7 && (
                            <Badge variant="destructive" className="text-xs">
                              Alta Prioridade
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[var(--muted)] line-clamp-2">
                          {result.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {query.trim() !== '' && results.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-[var(--muted)] mx-auto mb-2" />
                <p className="text-sm text-[var(--muted)]">
                  Nenhum resultado encontrado para "{query}"
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--muted)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>↑↓ Navegar</span>
              <span>↵ Selecionar</span>
              <span>Esc Fechar</span>
            </div>
            <span>Ctrl+K para abrir</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}