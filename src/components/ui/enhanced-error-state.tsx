import React from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { AlertTriangle, RefreshCw, ExternalLink, HelpCircle } from 'lucide-react';
import { ErrorMessage } from '../../lib/error-messages';

interface EnhancedErrorStateProps {
  error: ErrorMessage;
  onRetry?: () => void;
  className?: string;
}

export function EnhancedErrorState({ error, onRetry, className = '' }: EnhancedErrorStateProps) {
  return (
    <Card className={className}>
      <CardContent className="pt-6 text-center py-12">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-[var(--danger)]" />
        
        {/* Error Title */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
          {error.title}
        </h3>
        
        {/* Error Description */}
        <p className="text-[var(--muted)] mb-3">
          {error.description}
        </p>
        
        {/* Suggestion */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200 text-left">
              <strong>Como resolver:</strong> {error.suggestion}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {/* Primary Action */}
          {error.action && (
            <Button 
              onClick={error.action.onClick}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {error.action.label}
            </Button>
          )}
          
          {/* Retry Action */}
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </Button>
          )}
          
          {/* Help Link */}
          {error.helpLink && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open(error.helpLink, '_blank')}
              className="gap-2 text-[var(--primary)]"
            >
              <ExternalLink className="w-4 h-4" />
              Ver ajuda
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}