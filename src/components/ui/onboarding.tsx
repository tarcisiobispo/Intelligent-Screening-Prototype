import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { ChevronLeft, ChevronRight, X, Upload, FileText, BarChart3, CheckCircle } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action?: string;
  target?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Sistema!',
    description: 'Vamos te guiar pelos principais recursos em 4 passos rápidos.',
    icon: CheckCircle,
  },
  {
    id: 'upload',
    title: 'Envie Documentos',
    description: 'Faça upload de PDFs, imagens ou documentos Word. O OCR será executado automaticamente.',
    icon: Upload,
    action: 'Ir para Upload',
    target: '/upload',
  },
  {
    id: 'documents',
    title: 'Revise e Filtre',
    description: 'Use filtros inteligentes para encontrar documentos por tipo, score ou responsável.',
    icon: FileText,
    action: 'Ver Documentos',
    target: '/documents',
  },
  {
    id: 'dashboard',
    title: 'Monitore Resultados',
    description: 'Acompanhe estatísticas em tempo real e personalize seu dashboard.',
    icon: BarChart3,
    action: 'Abrir Dashboard',
    target: '/dashboard',
  },
];

export function Onboarding() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('onboarding-completed');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setIsVisible(false);
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setIsVisible(false);
  };

  const handleAction = () => {
    const step = onboardingSteps[currentStep];
    if (step.target) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { path: step.target } }));
      handleComplete();
    }
  };

  if (!isVisible) return null;

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{step.title}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {currentStep + 1} de {onboardingSteps.length}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-4">
          <p className="text-sm text-[var(--muted)]">{step.description}</p>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex gap-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                  }`}
                />
              ))}
            </div>

            {step.action ? (
              <Button size="sm" onClick={handleAction} className="gap-2">
                {step.action}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleNext} className="gap-2">
                {currentStep === onboardingSteps.length - 1 ? 'Concluir' : 'Próximo'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}