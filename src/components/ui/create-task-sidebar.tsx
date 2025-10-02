import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { ValidatedInput } from './validated-input';
import { useToast } from './toast-provider';
import { validationRules, ValidationResult } from '../../lib/validation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { X, User, Calendar, AlertCircle, FileText } from 'lucide-react';
import { sendWebhook } from '../../lib/export';

interface CreateTaskSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  document?: {
    id: string;
    title: string;
    type: string;
    summary: string;
    score: number;
    entities: Record<string, string>;
  };
  selectedDocsCount?: number;
  onTaskCreated?: () => void;
}

export function CreateTaskSidebar({ isOpen, onClose, document, selectedDocsCount, onTaskCreated }: CreateTaskSidebarProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleValid, setTitleValid] = useState(false);
  const [assigneeValid, setAssigneeValid] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titleValid || !assigneeValid) {
      toast.error('Formulário inválido', 'Por favor, corrija os erros no formulário');
      return;
    }

    setIsSubmitting(true);
    const loadingId = toast.loading('Criando tarefa...', 'Processando solicitação');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const successMessage = selectedDocsCount && selectedDocsCount > 1 
        ? `${selectedDocsCount} tarefas foram criadas com sucesso`
        : `Tarefa "${formData.title}" foi criada com sucesso`;
      
      toast.dismiss(loadingId);
      toast.success(selectedDocsCount && selectedDocsCount > 1 ? 'Tarefas criadas!' : 'Tarefa criada!', successMessage);
      
      // Enviar webhook para sistemas externos
      sendWebhook('task_created', {
        title: formData.title,
        assignee: formData.assignee,
        priority: formData.priority,
        documentId: document?.id,
        documentTitle: document?.title,
        bulkCount: selectedDocsCount
      });
      
      setFormData({
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
        priority: 'medium'
      });
      
      if (onTaskCreated) {
        onTaskCreated();
      }
      
      onClose();
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error('Erro ao criar tarefa', 'Tente novamente em alguns instantes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 0.7) {
      return { label: 'Alto', color: 'var(--danger)', bgColor: 'rgba(214, 69, 69, 0.1)' };
    } else if (score >= 0.3) {
      return { label: 'Médio', color: 'var(--warning)', bgColor: 'rgba(246, 200, 95, 0.1)' };
    } else {
      return { label: 'Baixo', color: 'var(--success)', bgColor: 'rgba(46, 204, 113, 0.1)' };
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 40
          }}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '384px',
          backgroundColor: 'white',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold">Criar Nova Tarefa</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Document Context */}
            {document ? (
              <div className="bg-[var(--muted)]/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-[var(--muted)]" />
                  <span className="text-sm font-medium">Documento relacionado:</span>
                </div>
                <h3 className="font-medium mb-2">{document.title}</h3>
                <div className="flex gap-2 mb-2">
                  <Badge variant="secondary">{document.type}</Badge>
                  <Badge
                    style={{
                      backgroundColor: getScoreBadge(document.score).bgColor,
                      color: getScoreBadge(document.score).color,
                    }}
                  >
                    Score: {getScoreBadge(document.score).label}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--muted)] line-clamp-3">
                  {document.summary.split('\n')[0]}
                </p>
                {Object.keys(document.entities).length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-[var(--muted)] mb-1">Entidades identificadas:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(document.entities).slice(0, 3).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : selectedDocsCount && selectedDocsCount > 0 ? (
              <div className="bg-[var(--primary)]/10 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-sm font-medium">Criação em lote:</span>
                </div>
                <p className="font-medium">{selectedDocsCount} documento{selectedDocsCount > 1 ? 's' : ''} selecionado{selectedDocsCount > 1 ? 's' : ''}</p>
              </div>
            ) : null}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <ValidatedInput
                label="Título"
                value={formData.title}
                onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                onValidation={(result: ValidationResult) => setTitleValid(result.isValid)}
                rules={validationRules.taskTitle}
                placeholder="Ex: Revisar laudo técnico"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva os detalhes da tarefa..."
                  className="w-full min-h-[80px] px-3 py-2 border border-[var(--border)] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>

              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-[38px] transform -translate-y-1/2 text-[var(--muted)] z-10" />
                <ValidatedInput
                  label="Responsável"
                  value={formData.assignee}
                  onChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}
                  onValidation={(result: ValidationResult) => setAssigneeValid(result.isValid)}
                  rules={validationRules.assignee}
                  placeholder="Digite o nome do responsável"
                  className="pl-10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prazo</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="pl-10"
                  />
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridade</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ zIndex: 60 }}>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--danger)]" />
                        Alta
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--warning)]" />
                        Média
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                        Baixa
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--border)]">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (formData.title || formData.description || formData.assignee) {
                    if (confirm('Descartar alterações? Todos os dados não salvos serão perdidos.')) {
                      onClose();
                    }
                  } else {
                    onClose();
                  }
                }}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !titleValid || !assigneeValid}
                className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-700)]"
              >
                {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}