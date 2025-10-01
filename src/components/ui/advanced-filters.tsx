import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './sheet';
import { Badge } from './badge';
import { FilterConfig, saveCustomFilter, getCustomFilters, deleteCustomFilter } from '../../lib/filters';
import { Filter, Save, X, Calendar, User, Target } from 'lucide-react';

interface AdvancedFiltersProps {
  onFilterChange: (filter: FilterConfig) => void;
  currentFilter: FilterConfig;
}

export function AdvancedFilters({ onFilterChange, currentFilter }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customFilters, setCustomFilters] = useState<FilterConfig[]>(getCustomFilters());
  const [filterForm, setFilterForm] = useState<FilterConfig>({
    id: '',
    name: '',
    ...currentFilter,
  });

  const handleSaveFilter = () => {
    if (!filterForm.name.trim()) return;
    
    const newFilter: FilterConfig = {
      ...filterForm,
      id: filterForm.id || `custom_${Date.now()}`,
    };
    
    saveCustomFilter(newFilter);
    setCustomFilters(getCustomFilters());
    onFilterChange(newFilter);
    setIsOpen(false);
  };

  const handleDeleteFilter = (id: string) => {
    deleteCustomFilter(id);
    setCustomFilters(getCustomFilters());
  };

  const resetForm = () => {
    setFilterForm({
      id: '',
      name: '',
      dateRange: undefined,
      assignee: undefined,
      status: undefined,
      priority: undefined,
      score: undefined,
    });
  };

  const hasActiveFilters = currentFilter.dateRange || currentFilter.assignee || 
    currentFilter.status || currentFilter.priority || currentFilter.score;

  return (
    <div className="flex items-center gap-2">
      {hasActiveFilters && (
        <div className="flex items-center gap-1 flex-wrap">
          {currentFilter.dateRange && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="w-3 h-3" />
              {currentFilter.dateRange.start} - {currentFilter.dateRange.end}
            </Badge>
          )}
          {currentFilter.assignee && (
            <Badge variant="secondary" className="gap-1">
              <User className="w-3 h-3" />
              {currentFilter.assignee}
            </Badge>
          )}
          {currentFilter.status && (
            <Badge variant="secondary">
              Status: {currentFilter.status}
            </Badge>
          )}
          {currentFilter.score && (
            <Badge variant="secondary" className="gap-1">
              <Target className="w-3 h-3" />
              {currentFilter.score.min}-{currentFilter.score.max}%
            </Badge>
          )}
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtros Avançados</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Custom Filters */}
            {customFilters.length > 0 && (
              <div className="space-y-3">
                <Label>Filtros Salvos</Label>
                <div className="space-y-2">
                  {customFilters.map((filter) => (
                    <div key={filter.id} className="flex items-center justify-between p-2 border rounded">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onFilterChange(filter);
                          setIsOpen(false);
                        }}
                        className="flex-1 justify-start"
                      >
                        {filter.name}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFilter(filter.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Form */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Período</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="Data inicial"
                    value={filterForm.dateRange?.start || ''}
                    onChange={(e) =>
                      setFilterForm({
                        ...filterForm,
                        dateRange: {
                          start: e.target.value,
                          end: filterForm.dateRange?.end || '',
                        },
                      })
                    }
                  />
                  <Input
                    type="date"
                    placeholder="Data final"
                    value={filterForm.dateRange?.end || ''}
                    onChange={(e) =>
                      setFilterForm({
                        ...filterForm,
                        dateRange: {
                          start: filterForm.dateRange?.start || '',
                          end: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Responsável</Label>
                <Select
                  value={filterForm.assignee || ''}
                  onValueChange={(value) =>
                    setFilterForm({ ...filterForm, assignee: value || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="João Silva">João Silva</SelectItem>
                    <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                    <SelectItem value="Pedro Costa">Pedro Costa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filterForm.status || ''}
                  onValueChange={(value) =>
                    setFilterForm({ ...filterForm, status: value || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in-progress">Em Progresso</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select
                  value={filterForm.priority || ''}
                  onValueChange={(value) =>
                    setFilterForm({ ...filterForm, priority: value || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Score de Risco (%)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max="100"
                    value={filterForm.score?.min || ''}
                    onChange={(e) =>
                      setFilterForm({
                        ...filterForm,
                        score: {
                          min: parseInt(e.target.value) || 0,
                          max: filterForm.score?.max || 100,
                        },
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    min="0"
                    max="100"
                    value={filterForm.score?.max || ''}
                    onChange={(e) =>
                      setFilterForm({
                        ...filterForm,
                        score: {
                          min: filterForm.score?.min || 0,
                          max: parseInt(e.target.value) || 100,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => {
                  onFilterChange(filterForm);
                  setIsOpen(false);
                }}
                className="flex-1"
              >
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Limpar
              </Button>
            </div>

            {/* Save Filter */}
            <div className="space-y-2 pt-4 border-t">
              <Label>Salvar Filtro</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do filtro"
                  value={filterForm.name}
                  onChange={(e) => setFilterForm({ ...filterForm, name: e.target.value })}
                />
                <Button onClick={handleSaveFilter} size="sm" className="gap-1">
                  <Save className="w-4 h-4" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}