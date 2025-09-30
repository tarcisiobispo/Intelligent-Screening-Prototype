import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  Check,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

type NotificationType = 'success' | 'warning' | 'info' | 'error';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: NotificationType;
  date: string;
}

export function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Documento processado',
      description: 'Relatório T123 foi processado com sucesso e está disponível para revisão',
      time: '5 min atrás',
      date: '30 Set 2025',
      read: false,
      type: 'success',
    },
    {
      id: 2,
      title: 'Alta prioridade',
      description: 'Transformador T456 requer atenção imediata - temperatura acima do normal',
      time: '15 min atrás',
      date: '30 Set 2025',
      read: false,
      type: 'warning',
    },
    {
      id: 3,
      title: 'Tarefa atribuída',
      description: 'Nova tarefa de revisão foi atribuída a você por João Silva',
      time: '1 hora atrás',
      date: '30 Set 2025',
      read: true,
      type: 'info',
    },
    {
      id: 4,
      title: 'Processamento concluído',
      description: 'Lote de 15 documentos foi processado com sucesso',
      time: '2 horas atrás',
      date: '30 Set 2025',
      read: true,
      type: 'success',
    },
    {
      id: 5,
      title: 'Erro no OCR',
      description: 'Falha ao processar documento DOC_789 - qualidade da imagem insuficiente',
      time: '3 horas atrás',
      date: '30 Set 2025',
      read: true,
      type: 'error',
    },
    {
      id: 6,
      title: 'Novo comentário',
      description: 'Maria Santos comentou no documento REL_2024_001',
      time: '5 horas atrás',
      date: '29 Set 2025',
      read: true,
      type: 'info',
    },
  ]);

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Notificação marcada como lida');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('Todas as notificações marcadas como lidas');
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notificação removida');
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[var(--success)]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-[var(--danger)]" />;
      default:
        return <Info className="w-5 h-5 text-[var(--primary)]" />;
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-green-500';
      case 'warning':
        return 'bg-yellow-50 border-l-yellow-500';
      case 'error':
        return 'bg-red-50 border-l-red-500';
      default:
        return 'bg-blue-50 border-l-blue-500';
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] mb-1">Notificações</h1>
          <p className="text-sm text-[var(--muted)]">
            Gerencie suas notificações e alertas do sistema
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[var(--danger)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Não lidas</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[var(--success)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Lidas</p>
                <p className="text-2xl font-bold">{notifications.length - unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Filtros</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-[var(--primary)]' : ''}
            >
              Todas ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
              className={filter === 'unread' ? 'bg-[var(--primary)]' : ''}
            >
              Não lidas ({unreadCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            {filter === 'unread' ? 'Notificações não lidas' : 'Todas as notificações'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-12 h-12 text-[var(--muted)] mx-auto mb-3" />
              <p className="text-[var(--muted)]">
                {filter === 'unread' 
                  ? 'Nenhuma notificação não lida' 
                  : 'Nenhuma notificação'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-[var(--bg)] transition-colors ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-[var(--text)] flex items-center gap-2">
                          {notification.title}
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                          )}
                        </h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                              title="Marcar como lida"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 p-0 text-[var(--danger)] hover:text-[var(--danger)]"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--muted)] mb-2">
                        {notification.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                        <span>{notification.time}</span>
                        <span>•</span>
                        <span>{notification.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
