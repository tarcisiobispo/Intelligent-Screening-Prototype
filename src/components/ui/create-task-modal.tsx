import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { useToast } from './toast-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { X, User, Calendar, AlertCircle } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  documentId?: string;
  selectedDocsCount?: number;
  onTaskCreated?: () => void;
}

export function CreateTaskModal({ isOpen, onClose, documentTitle, documentId, selectedDocsCount, onTaskCreated }: CreateTaskModalProps) {
  console.log('CreateTaskModal render - isOpen:', isOpen);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Título obrigatório', 'Por favor, insira um título para a tarefa');
      return;
    }
    
    if (!formData.assignee) {
      toast.error('Responsável obrigatório', 'Por favor, selecione um responsável');
      return;
    }

    setIsSubmitting(true);
    const loadingId = toast.loading('Criando tarefa...', 'Processando solicitação');
    
    try {
      // Simula criação da tarefa
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.dismiss(loadingId);
      const successMessage = selectedDocsCount && selectedDocsCount > 1 
        ? `${selectedDocsCount} tarefas foram criadas com sucesso`
        : `Tarefa "${formData.title}" foi criada com sucesso`;
      
      toast.success(selectedDocsCount && selectedDocsCount > 1 ? 'Tarefas criadas!' : 'Tarefa criada!', successMessage);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
        priority: 'medium'
      });
      
      // Call callback if provided (for bulk actions)
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--muted)';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Média';
    }
  };

  if (!isOpen) {
    console.log('Modal não está aberto');
    return null;
  }

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        pointerEvents: 'all'
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '1.5rem',
          pointerEvents: 'all',
          zIndex: 51
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Criar Nova Tarefa</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {documentTitle ? (
          <div className="bg-[var(--muted)]/20 p-3 rounded-lg mb-4">
            <p className="text-sm text-[var(--muted)] mb-1">Documento relacionado:</p>
            <p className="font-medium">{documentTitle}</p>
          </div>
        ) : selectedDocsCount && selectedDocsCount > 0 ? (
          <div className="bg-[var(--primary)]/10 p-3 rounded-lg mb-4">
            <p className="text-sm text-[var(--muted)] mb-1">Criação em lote:</p>
            <p className="font-medium">{selectedDocsCount} documento{selectedDocsCount > 1 ? 's' : ''} selecionado{selectedDocsCount > 1 ? 's' : ''}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Título <span className="text-[var(--danger)]">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Revisar laudo técnico"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva os detalhes da tarefa..."
              className="w-full min-h-[80px] px-3 py-2 border border-[var(--border)] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Responsável <span className="text-[var(--danger)]">*</span>
            </label>
            <Select
              value={formData.assignee}
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}
            >
              <SelectTrigger>
                <User className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="João Silva">João Silva</SelectItem>
                <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                <SelectItem value="Pedro Costa">Pedro Costa</SelectItem>
                <SelectItem value="Ana Oliveira">Ana Oliveira</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Prazo</label>
            <div className="relative">
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full pl-10"
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
              <SelectContent>
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

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[var(--primary)] hover:bg-[var(--primary-700)]"
            >
              {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}