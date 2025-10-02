import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Wrench, Clock, AlertCircle } from 'lucide-react';

interface MaintenanceProps {
  estimatedTime?: string;
  reason?: string;
}

export function Maintenance({ 
  estimatedTime = "30 minutos", 
  reason = "Atualização do sistema" 
}: MaintenanceProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center">
        <CardContent className="pt-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
            <Wrench className="w-10 h-10 text-orange-600" />
          </div>
          
          <Badge variant="secondary" className="mb-4 bg-orange-100 text-orange-800">
            Manutenção em andamento
          </Badge>
          
          <h1 className="text-2xl font-bold text-[var(--text)] mb-3">
            Sistema em manutenção
          </h1>
          <p className="text-[var(--muted)] mb-6">
            Estamos realizando melhorias no sistema. Voltaremos em breve com novidades!
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-[var(--muted)]" />
              <span className="text-[var(--muted)]">Motivo: {reason}</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[var(--muted)]" />
              <span className="text-[var(--muted)]">Tempo estimado: {estimatedTime}</span>
            </div>
          </div>
          
          <div className="bg-[var(--surface)] p-4 rounded-lg border">
            <p className="text-xs text-[var(--muted)]">
              Para emergências, entre em contato pelo email:{' '}
              <a href="mailto:suporte@empresa.com" className="text-[var(--primary)] hover:underline">
                suporte@empresa.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}