import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { 
  Clock, 
  User, 
  FileText, 
  MessageCircle, 
  CheckSquare, 
  Settings, 
  Eye,
  Filter,
  Calendar
} from 'lucide-react';
import { AuditEvent, getAuditTrail, actionTypes, auditUsers } from '../../lib/auditTrail';

interface AuditTimelineProps {
  documentId: string;
}

export function AuditTimeline({ documentId }: AuditTimelineProps) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [filters, setFilters] = useState({
    user: 'todos',
    action: 'todas',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const filteredEvents = getAuditTrail(documentId, filters);
    setEvents(filteredEvents);
  }, [documentId, filters]);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create': return FileText;
      case 'update': return Settings;
      case 'comment': return MessageCircle;
      case 'task': return CheckSquare;
      case 'process': return Settings;
      case 'view': return Eye;
      default: return Clock;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'create': return 'var(--success)';
      case 'update': return 'var(--primary)';
      case 'comment': return 'var(--accent)';
      case 'task': return 'var(--warning)';
      case 'process': return 'var(--primary)';
      case 'view': return 'var(--muted)';
      default: return 'var(--muted)';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  };

  const clearFilters = () => {
    setFilters({
      user: 'todos',
      action: 'todas',
      startDate: '',
      endDate: '',
    });
  };

  const hasActiveFilters = filters.user !== 'todos' || 
    filters.action !== 'todas' || 
    filters.startDate || 
    filters.endDate;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros de Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--muted)]">Usuário</label>
              <Select 
                value={filters.user} 
                onValueChange={(value: string) => setFilters({...filters, user: value})}
              >
                <SelectTrigger className="h-8">
                  <User className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {auditUsers.map(user => (
                    <SelectItem key={user} value={user}>
                      {user === 'todos' ? 'Todos os usuários' : user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--muted)]">Ação</label>
              <Select 
                value={filters.action} 
                onValueChange={(value: string) => setFilters({...filters, action: value})}
              >
                <SelectTrigger className="h-8">
                  <Settings className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map(action => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--muted)]">Data Inicial</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--muted)]">Data Final</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="h-8"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <span className="text-sm text-[var(--muted)]">
                {events.length} evento{events.length !== 1 ? 's' : ''} encontrado{events.length !== 1 ? 's' : ''}
              </span>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Timeline de Atividades ({events.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 mx-auto mb-4 text-[var(--muted)]" />
              <p className="text-[var(--muted)]">
                {hasActiveFilters 
                  ? 'Nenhum evento encontrado com os filtros aplicados'
                  : 'Nenhum evento de auditoria registrado'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => {
                const Icon = getActionIcon(event.type);
                const color = getActionColor(event.type);
                const { date, time } = formatTimestamp(event.timestamp);
                const isLast = index === events.length - 1;

                return (
                  <div key={event.id} className="relative">
                    {/* Timeline line */}
                    {!isLast && (
                      <div 
                        className="absolute left-4 top-8 w-0.5 h-8 bg-[var(--border)]"
                        style={{ marginLeft: '0.5rem' }}
                      />
                    )}
                    
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 bg-[var(--surface)]"
                        style={{ 
                          borderColor: color,
                          backgroundColor: `${color}10`
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{event.action}</p>
                            {event.details && (
                              <p className="text-sm text-[var(--muted)] mt-1">
                                {event.details}
                              </p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-[var(--muted)]">{date}</div>
                            <div className="text-xs text-[var(--muted)]">{time}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {event.user}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ 
                              borderColor: color,
                              color: color 
                            }}
                          >
                            {actionTypes.find(a => a.value === event.type)?.label || event.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}