import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, HelpCircle, BookOpen, Video, MessageCircle, Mail } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

export function Help() {
  const faqs = [
    {
      question: 'Como funciona o OCR?',
      answer:
        'O sistema utiliza tecnologia avançada de reconhecimento óptico de caracteres (OCR) para extrair texto de documentos digitalizados, PDFs e imagens. O processo é automático e leva em média 2-3 segundos por documento.',
    },
    {
      question: 'O que significa o score de risco?',
      answer:
        'O score de risco é calculado por nossa IA e indica a criticidade do documento. Valores acima de 70% indicam alta prioridade e requerem atenção imediata. O cálculo considera palavras-chave, contexto e histórico de equipamentos.',
    },
    {
      question: 'Como melhorar a qualidade do OCR?',
      answer:
        'Para obter melhores resultados: (1) Use imagens com boa iluminação e contraste, (2) Resolução mínima de 300 DPI, (3) Evite documentos com marcas d\'água, (4) PDFs com texto nativo têm melhor precisão que scans.',
    },
    {
      question: 'Posso editar os campos extraídos?',
      answer:
        'Sim! No visualizador de documentos, todos os campos extraídos são editáveis. Suas correções ajudam a treinar o sistema para melhorar a precisão futura.',
    },
    {
      question: 'Como criar uma tarefa vinculada a um documento?',
      answer:
        'No visualizador de documentos, clique no botão "Criar Tarefa". O formulário será pré-preenchido com informações do documento, incluindo prioridade baseada no score.',
    },
    {
      question: 'O que fazer se o OCR tiver baixa confiança?',
      answer:
        'Documentos com confiança OCR abaixo de 70% podem ser reprocessados ou você pode solicitar o reenvio do documento original ao responsável.',
    },
  ];

  const resources = [
    {
      title: 'Guia de Início Rápido',
      description: 'Aprenda o básico em 5 minutos',
      icon: BookOpen,
    },
    {
      title: 'Tutoriais em Vídeo',
      description: '12 vídeos explicativos',
      icon: Video,
    },
    {
      title: 'API Documentation',
      description: 'Integre com seus sistemas',
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="mb-2">Central de Ajuda</h1>
        <p className="text-[var(--muted)]">
          Encontre respostas, tutoriais e suporte técnico
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
            <Input
              placeholder="Buscar na central de ajuda..."
              className="pl-10 text-lg h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <div className="grid md:grid-cols-3 gap-4">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card
              key={resource.title}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="pt-6">
                <Icon className="w-8 h-8 text-[var(--primary)] mb-3" />
                <h3 className="mb-1">{resource.title}</h3>
                <p className="text-sm text-[var(--muted)]">{resource.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="text-[var(--muted)]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Precisa de mais ajuda?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:bg-transparent hover:border-[var(--border)] hover:text-inherit">
              <MessageCircle className="w-6 h-6 text-[var(--primary)]" />
              <div>
                <div className="font-medium">Chat ao Vivo</div>
                <div className="text-xs text-[var(--muted)]">
                  Resposta média: 2 min
                </div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2 hover:bg-[#FF8A00] hover:border-[#FF8A00] hover:text-white group"
            >
              <Mail className="w-6 h-6 text-[var(--primary)] group-hover:text-white" />
              <div>
                <div className="font-medium group-hover:text-white">Email</div>
                <div className="text-xs text-[var(--muted)] group-hover:text-white">
                  suporte@triagem.com
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}