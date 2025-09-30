import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  CheckSquare,
  Clock,
  User,
  Calendar,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { mockApi, type Task } from '../../lib/mockApi';

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await mockApi.getTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: 'rgba(214, 69, 69, 0.1)', text: 'var(--danger)' };
      case 'medium':
        return { bg: 'rgba(246, 200, 95, 0.1)', text: 'var(--warning)' };
      case 'low':
        return { bg: 'rgba(46, 204, 113, 0.1)', text: 'var(--success)' };
      default:
        return { bg: 'var(--bg)', text: 'var(--muted)' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return { bg: 'rgba(46, 204, 113, 0.1)', text: 'var(--success)' };
      case 'in_progress':
        return { bg: 'rgba(79, 163, 217, 0.1)', text: 'var(--primary)' };
      default:
        return { bg: 'var(--bg)', text: 'var(--muted)' };
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === 'todo'),
    in_progress: filteredTasks.filter((t) => t.status === 'in_progress'),
    done: filteredTasks.filter((t) => t.status === 'done'),
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="mb-2">Tarefas</h1>
          <p className="text-[var(--muted)]">
            {filteredTasks.length} tarefas • Gerenciamento de atividades
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="todo">A fazer</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
                <SelectItem value="done">Concluídas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Board */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-[var(--bg)] rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-32 bg-[var(--bg)] rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* To Do */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>A Fazer</span>
                <Badge variant="secondary">{tasksByStatus.todo.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus.todo.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {tasksByStatus.todo.length === 0 && (
                <p className="text-sm text-[var(--muted)] text-center py-8">
                  Nenhuma tarefa pendente
                </p>
              )}
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Em Andamento</span>
                <Badge variant="secondary">{tasksByStatus.in_progress.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus.in_progress.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {tasksByStatus.in_progress.length === 0 && (
                <p className="text-sm text-[var(--muted)] text-center py-8">
                  Nenhuma tarefa em andamento
                </p>
              )}
            </CardContent>
          </Card>

          {/* Done */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Concluídas</span>
                <Badge variant="secondary">{tasksByStatus.done.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus.done.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {tasksByStatus.done.length === 0 && (
                <p className="text-sm text-[var(--muted)] text-center py-8">
                  Nenhuma tarefa concluída
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const priorityColor = {
    high: { bg: 'rgba(214, 69, 69, 0.1)', text: 'var(--danger)' },
    medium: { bg: 'rgba(246, 200, 95, 0.1)', text: 'var(--warning)' },
    low: { bg: 'rgba(46, 204, 113, 0.1)', text: 'var(--success)' },
  }[task.priority];

  const statusLabel = {
    todo: 'A fazer',
    in_progress: 'Em andamento',
    done: 'Concluída',
  }[task.status];

  const priorityLabel = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
  }[task.priority];

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <h4 className="mb-2">{task.title}</h4>
            <p className="text-sm text-[var(--muted)] line-clamp-2">
              {task.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              style={{
                backgroundColor: priorityColor.bg,
                color: priorityColor.text,
              }}
            >
              {priorityLabel}
            </Badge>
            {isOverdue && (
              <Badge
                style={{
                  backgroundColor: 'rgba(214, 69, 69, 0.1)',
                  color: 'var(--danger)',
                }}
              >
                Atrasada
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-sm text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {task.assignee}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(task.dueDate).toLocaleDateString('pt-BR')}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => (window.location.href = `/documents/${task.documentId}`)}
          >
            <ExternalLink className="w-4 h-4" />
            Ver Documento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}