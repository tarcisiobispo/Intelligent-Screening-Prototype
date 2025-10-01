import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from './alert';

interface ValidationSummaryProps {
  errors: string[];
  isValid: boolean;
  className?: string;
}

export function ValidationSummary({ errors, isValid, className }: ValidationSummaryProps) {
  if (isValid) {
    return (
      <Alert className={`bg-[var(--success)]/10 border-[var(--success)] ${className || ''}`}>
        <CheckCircle className="w-4 h-4 text-[var(--success)]" />
        <AlertDescription className="text-[var(--success)]">
          Todos os campos estão válidos
        </AlertDescription>
      </Alert>
    );
  }

  if (errors.length === 0) return null;

  return (
    <Alert className={`bg-[var(--danger)]/10 border-[var(--danger)] ${className || ''}`}>
      <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
      <AlertDescription>
        <div className="text-[var(--danger)]">
          <div className="font-medium mb-2">Corrija os seguintes erros:</div>
          <ul className="space-y-1 text-sm">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-[var(--danger)] mt-0.5">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
}