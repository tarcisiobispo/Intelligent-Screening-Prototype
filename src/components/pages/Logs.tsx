import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Search, FileCode, Filter, Download, Info, AlertTriangle, XCircle } from 'lucide-react';

export function Logs() {
  const [levelFilter, setLevelFilter] = useState('all');

  const logs = [
    {
      id: 1,
      timestamp: '2025-09-30T10:45:23Z',
      level: 'info',
      message: 'Documento doc_001 processado com sucesso',
      user: 'Sistema',
      details: 'OCR confidence: 82%',
    },
    {
      id: 2,
      timestamp: '2025-09-30T10:44:15Z',
      level: 'warning',
      message: 'OCR de baixa confiança detectado',
      user: 'Sistema',
      details: 'doc_004 - confidence: 32%',
    },
    {
      id: 3,
      timestamp: '2025-09-30T10:43:05Z',
      level: 'info',
      message: 'Usuário João Silva fez login',
      user: 'João Silva',
      details: 'IP: 192.168.1.100',
    },
    {
      id: 4,
      timestamp: '2025-09-30T10:42:12Z',
      level: 'info',
      message: 'Tarefa task_001 criada',
      user: 'João Silva',
      details: 'Prioridade: Alta',
    },
    {
      id: 5,
      timestamp: '2025-09-30T10:40:33Z',
      level: 'error',
      message: 'Falha ao conectar com API externa',
      user: 'Sistema',
      details: 'Timeout após 30s',
    },
    {
      id: 6,
      timestamp: '2025-09-30T10:38:22Z',
      level: 'info',
      message: 'Upload de 3 documentos iniciado',
      user: 'Maria Santos',
      details: 'Total: 12.5 MB',
    },
    {
      id: 7,
      timestamp: '2025-09-30T10:35:44Z',
      level: 'warning',
      message: 'Uso de memória acima de 70%',
      user: 'Sistema',
      details: 'Memória: 68%',
    },
    {
      id: 8,
      timestamp: '2025-09-30T10:30:11Z',
      level: 'info',
      message: 'Backup automático concluído',
      user: 'Sistema',
      details: 'Tamanho: 245 MB',
    },
  ];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="w-4 h-4 text-[var(--primary)]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-[var(--danger)]" />;
      default:
        return <FileCode className="w-4 h-4 text-[var(--muted)]" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const colors: Record<string, any> = {
      info: { bg: 'rgba(79, 163, 217, 0.1)', text: 'var(--primary)' },
      warning: { bg: 'rgba(246, 200, 95, 0.1)', text: 'var(--warning)' },
      error: { bg: 'rgba(214, 69, 69, 0.1)', text: 'var(--danger)' },
    };
    return colors[level] || colors.info;
  };

  const filteredLogs =
    levelFilter === 'all' ? logs : logs.filter((log) => log.level === levelFilter);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="mb-2">Logs do Sistema</h1>
          <p className="text-[var(--muted)]">
            {filteredLogs.length} entradas • Registro de atividades
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
              <Input placeholder="Buscar logs..." className="pl-10" />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            Histórico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const badge = getLevelBadge(log.level);
              return (
                <div
                  key={log.id}
                  className="flex gap-3 p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--bg)] transition-colors"
                >
                  <div className="mt-1">{getLevelIcon(log.level)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-medium">{log.message}</div>
                      <Badge
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.text,
                        }}
                      >
                        {log.level.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-[var(--muted)] space-y-1">
                      <div>
                        {new Date(log.timestamp).toLocaleString('pt-BR')} • {log.user}
                      </div>
                      <div className="font-mono text-xs">{log.details}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}