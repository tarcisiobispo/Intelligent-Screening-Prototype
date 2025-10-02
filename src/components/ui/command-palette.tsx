import { useState, useEffect } from 'react';
import { Card, CardContent } from './card';
import { Input } from './input';
import { Badge } from './badge';
import { Button } from './button';
import { 
  Search, 
  FileText, 
  CheckSquare, 
  User, 
  Settings, 
  Upload, 
  BarChart3,
  ArrowRight,
  Clock
} from 'lucide-react';
import { navigate } from '../../lib/navigation';
import { navigationHistory } from '../../lib/navigation-history';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: 'navigation' | 'action' | 'recent';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [commands, setCommands] = useState<Command[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadCommands();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, commands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && commands[selectedIndex]) {
        commands[selectedIndex].action();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, commands, selectedIndex]);

  const loadCommands = () => {
    const baseCommands: Command[] = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        description: 'Ir para o painel principal',
        icon: BarChart3,
        action: () => navigate('/dashboard'),
        category: 'navigation'
      },
      {
        id: 'documents',
        title: 'Documentos',
        description: 'Ver todos os documentos',
        icon: FileText,
        action: () => navigate('/documents'),
        category: 'navigation'
      },
      {
        id: 'tasks',
        title: 'Tarefas',
        description: 'Gerenciar tarefas',
        icon: CheckSquare,
        action: () => navigate('/tasks'),
        category: 'navigation'
      },
      {
        id: 'upload',
        title: 'Upload',
        description: 'Enviar novos documentos',
        icon: Upload,
        action: () => navigate('/upload'),
        category: 'navigation'
      },
      {
        id: 'admin',
        title: 'Administração',
        description: 'Configurações do sistema',
        icon: Settings,
        action: () => navigate('/admin'),
        category: 'navigation'
      }
    ];

    // Add recent tabs
    const recentTabs = navigationHistory.getRecentTabs().map(tab => ({
      id: `recent-${tab.path}`,
      title: tab.title,
      description: `Visitado recentemente`,
      icon: Clock,
      action: () => navigate(tab.path),
      category: 'recent' as const
    }));

    const allCommands = [...baseCommands, ...recentTabs];
    
    if (query.trim()) {
      const filtered = allCommands.filter(cmd => 
        cmd.title.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description.toLowerCase().includes(query.toLowerCase())
      );
      setCommands(filtered);
    } else {
      setCommands(allCommands);
    }
    
    setSelectedIndex(0);
  };

  useEffect(() => {
    loadCommands();
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
      <Card className="w-full max-w-lg mx-4 bg-[var(--surface)] border border-[var(--border)] shadow-xl">
        <CardContent className="p-0">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
            <Search className="w-5 h-5 text-[var(--muted)]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite um comando ou busque..."
              className="border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>

          {/* Commands */}
          <div className="max-h-80 overflow-y-auto">
            {commands.length > 0 ? (
              <div className="p-2">
                {commands.map((command, index) => {
                  const Icon = command.icon;
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <div
                      key={command.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-[var(--primary)]/10' : 'hover:bg-[var(--bg)]'
                      }`}
                      onClick={() => {
                        command.action();
                        onClose();
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[var(--primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">{command.title}</span>
                          {command.category === 'recent' && (
                            <Badge variant="outline" className="text-xs">
                              Recente
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[var(--muted)] truncate">
                          {command.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--muted)]" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-[var(--muted)] mx-auto mb-2" />
                <p className="text-sm text-[var(--muted)]">
                  Nenhum comando encontrado
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--muted)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>↑↓ Navegar</span>
              <span>↵ Executar</span>
              <span>Esc Fechar</span>
            </div>
            <span>Cmd+P para abrir</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}