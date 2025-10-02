import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { navigate } from '../../lib/navigation';

export function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
            <FileQuestion className="w-8 h-8 text-[var(--primary)]" />
          </div>
          
          <h1 className="text-6xl font-bold text-[var(--primary)] mb-2">404</h1>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Página não encontrada</h2>
          <p className="text-[var(--muted)] mb-6">
            A página que você está procurando não existe ou foi movida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
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