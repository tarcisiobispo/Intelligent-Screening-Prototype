import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({
  title = "Algo deu errado",
  message = "Não foi possível carregar os dados. Tente novamente.",
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <Card>
      <CardContent className="pt-6 text-center py-12">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-[var(--danger)]" />
        <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{title}</h3>
        <p className="text-[var(--muted)] mb-4">{message}</p>
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </Button>
        )}
      </CardContent>
    </Card>
  );
}