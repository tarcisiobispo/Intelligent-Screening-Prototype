import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Activity, Server, Database, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

export function Monitoring() {
  const services = [
    { name: 'API Gateway', status: 'operational', uptime: '99.98%', responseTime: '45ms' },
    { name: 'OCR Engine', status: 'operational', uptime: '99.95%', responseTime: '2.1s' },
    { name: 'IA Classifier', status: 'operational', uptime: '99.99%', responseTime: '180ms' },
    { name: 'Database', status: 'operational', uptime: '99.99%', responseTime: '12ms' },
    { name: 'Storage', status: 'degraded', uptime: '98.50%', responseTime: '350ms' },
  ];

  const metrics = [
    { label: 'Documentos Processados (24h)', value: '1,245', trend: '+12%' },
    { label: 'Taxa de Sucesso OCR', value: '96.5%', trend: '+2.1%' },
    { label: 'Tempo Médio de Processamento', value: '2.3s', trend: '-8%' },
    { label: 'Requisições/min', value: '342', trend: '+5%' },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="mb-2">Monitoramento</h1>
        <p className="text-[var(--muted)]">Status dos serviços e métricas em tempo real</p>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--primary)]" />
            Status dos Serviços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="border border-[var(--border)] rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{service.name}</span>
                  {service.status === 'operational' ? (
                    <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
                  )}
                </div>
                <Badge
                  style={{
                    backgroundColor:
                      service.status === 'operational'
                        ? 'rgba(46, 204, 113, 0.1)'
                        : 'rgba(246, 200, 95, 0.1)',
                    color:
                      service.status === 'operational'
                        ? 'var(--success)'
                        : 'var(--warning)',
                  }}
                >
                  {service.status === 'operational' ? 'Operacional' : 'Degradado'}
                </Badge>
                <div className="space-y-1 text-sm text-[var(--muted)]">
                  <div>Uptime: {service.uptime}</div>
                  <div>Resposta: {service.responseTime}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="pt-6">
              <div className="text-sm text-[var(--muted)] mb-2">{metric.label}</div>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="text-xs text-[var(--success)]">{metric.trend} vs ontem</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resource Usage */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              CPU
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">42%</div>
            <div className="w-full bg-[var(--bg)] rounded-full h-2">
              <div
                className="bg-[var(--primary)] h-2 rounded-full"
                style={{ width: '42%' }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Memória
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">68%</div>
            <div className="w-full bg-[var(--bg)] rounded-full h-2">
              <div
                className="bg-[var(--warning)] h-2 rounded-full"
                style={{ width: '68%' }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Rede
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">25%</div>
            <div className="w-full bg-[var(--bg)] rounded-full h-2">
              <div
                className="bg-[var(--success)] h-2 rounded-full"
                style={{ width: '25%' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}