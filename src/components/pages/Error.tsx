import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { navigate } from '../../lib/navigation';

interface ErrorProps {
  error?: Error;
  resetError?: () => void;
}

export function Error({ error, resetError }: ErrorProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Algo deu errado</h1>
          <p className="text-[var(--muted)] mb-4">
            Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.
          </p>
          
          {error && (
            <div className="bg-[var(--bg)] p-3 rounded-lg mb-4 text-left">
              <p className="text-xs text-[var(--muted)] font-mono break-all">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {resetError && (
              <Button 
                onClick={resetError}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar novamente
              </Button>
            )}
            <Button 
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Ir para Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}