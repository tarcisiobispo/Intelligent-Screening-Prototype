import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { HelpCircle, X, ExternalLink } from 'lucide-react';

interface HelpContent {
  title: string;
  description: string;
  tips: string[];
  videoUrl?: string;
  docsUrl?: string;
}

const helpContent: Record<string, HelpContent> = {
  dashboard: {
    title: 'Central de Monitoramento',
    description: 'Visão geral dos documentos processados e estatísticas em tempo real.',
    tips: [
      'Clique nos cards KPI para navegar diretamente',
      'Use os filtros para personalizar os gráficos',
      'Gráficos são interativos - clique para detalhes'
    ],
    docsUrl: '/help#dashboard'
  },
  documents: {
    title: 'Gerenciar Documentos',
    description: 'Visualize, filtre e gerencie todos os documentos processados.',
    tips: [
      'Use Ctrl+F para busca rápida',
      'Selecione múltiplos para ações em lote',
      'Score alto = maior prioridade de revisão'
    ],
    docsUrl: '/help#documents'
  },
  upload: {
    title: 'Envio de Documentos',
    description: 'Faça upload de arquivos para análise automática.',
    tips: [
      'Arraste arquivos diretamente na área',
      'PDFs têm melhor precisão OCR',
      'Máximo 50MB por arquivo'
    ],
    videoUrl: 'https://example.com/upload-tutorial',
    docsUrl: '/help#upload'
  },
  tasks: {
    title: 'Gerenciar Tarefas',
    description: 'Organize e acompanhe tarefas criadas a partir dos documentos.',
    tips: [
      'Arraste cards entre colunas',
      'Use filtros para focar no importante',
      'Tarefas atrasadas ficam em vermelho'
    ],
    docsUrl: '/help#tasks'
  },
  filters: {
    title: 'Sistema de Filtros',
    description: 'Como usar os filtros para encontrar documentos específicos.',
    tips: [
      'Combine múltiplos filtros para precisão',
      'Deixe campos vazios para "todos"',
      'Use datas para períodos específicos'
    ]
  },
  ocr: {
    title: 'Confiança OCR',
    description: 'Entenda os níveis de confiança do reconhecimento de texto.',
    tips: [
      'Alta (>80%): Texto muito confiável',
      'Média (50-80%): Revisar se necessário',
      'Baixa (<50%): Requer revisão manual'
    ]
  }
};

interface ContextualHelpProps {
  topic: keyof typeof helpContent;
  className?: string;
}

export function ContextualHelp({ topic, className = '' }: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const content = helpContent[topic];

  if (!content) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`gap-2 ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="w-4 h-4" />
        Ajuda
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[var(--primary)]" />
                  {content.title}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4 overflow-y-auto">
              <p className="text-sm text-[var(--muted)]">{content.description}</p>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Dicas Úteis:</h4>
                <ul className="space-y-1">
                  {content.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-[var(--muted)] flex items-start gap-2">
                      <span className="w-1 h-1 bg-[var(--primary)] rounded-full mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                {content.videoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => window.open(content.videoUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver Tutorial
                  </Button>
                )}
                {content.docsUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      setIsOpen(false);
                      window.dispatchEvent(new CustomEvent('navigate', { detail: { path: content.docsUrl } }));
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Documentação
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}