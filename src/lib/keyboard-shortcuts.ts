import { toast } from 'sonner';
import { navigate } from './navigation';

export class KeyboardShortcuts {
  private shortcuts: Map<string, () => void> = new Map();
  private isEnabled = true;

  constructor() {
    this.setupDefaultShortcuts();
    this.bindEvents();
  }

  private setupDefaultShortcuts() {
    // Navigation
    this.shortcuts.set('ctrl+1', () => navigate('/dashboard'));
    this.shortcuts.set('ctrl+2', () => navigate('/documents'));
    this.shortcuts.set('ctrl+3', () => navigate('/tasks'));
    this.shortcuts.set('ctrl+4', () => navigate('/upload'));
    
    // Actions
    this.shortcuts.set('ctrl+f', () => this.focusSearch());
    this.shortcuts.set('ctrl+n', () => this.newDocument());
    this.shortcuts.set('ctrl+s', () => this.saveAction());
    this.shortcuts.set('escape', () => this.closeModals());
    this.shortcuts.set('ctrl+a', () => this.selectAll());
    this.shortcuts.set('ctrl+shift+e', () => this.exportData());
    
    // Bulk actions
    this.shortcuts.set('ctrl+shift+a', () => this.bulkArchive());
    this.shortcuts.set('ctrl+shift+t', () => this.bulkCreateTasks());
    this.shortcuts.set('ctrl+shift+r', () => this.bulkReprocess());
  }

  private bindEvents() {
    document.addEventListener('keydown', (e) => {
      if (!this.isEnabled) return;
      
      // Skip if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = this.getKeyString(e);
      const action = this.shortcuts.get(key);
      
      if (action) {
        e.preventDefault();
        action();
      }
    });
  }

  private getKeyString(e: KeyboardEvent): string {
    const parts = [];
    if (e.ctrlKey) parts.push('ctrl');
    if (e.shiftKey) parts.push('shift');
    if (e.altKey) parts.push('alt');
    parts.push(e.key.toLowerCase());
    return parts.join('+');
  }

  private focusSearch() {
    const searchInput = document.querySelector('input[placeholder*="Busque"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      toast.success('Busca ativada', 'Digite para pesquisar');
    }
  }

  private newDocument() {
    navigate('/upload');
    toast.success('Novo documento', 'Redirecionado para upload');
  }

  private saveAction() {
    toast.success('Salvo', 'Alterações salvas automaticamente');
  }

  private closeModals() {
    // Close any open modals/sidebars
    const closeButtons = document.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(btn => (btn as HTMLElement).click());
  }

  private selectAll() {
    const selectAllCheckbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    if (selectAllCheckbox && selectAllCheckbox.checked !== undefined) {
      selectAllCheckbox.click();
      toast.success('Seleção alterada', 'Todos os itens selecionados/desmarcados');
    }
  }

  private exportData() {
    const exportButton = document.querySelector('button:has([data-lucide="download"])') as HTMLElement;
    if (exportButton) {
      exportButton.click();
      toast.success('Exportação iniciada', 'Dados sendo preparados');
    }
  }

  private bulkArchive() {
    const archiveButton = document.querySelector('button:contains("Arquivar")') as HTMLElement;
    if (archiveButton) {
      archiveButton.click();
    } else {
      toast.error('Nenhum item selecionado', 'Selecione documentos para arquivar');
    }
  }

  private bulkCreateTasks() {
    const taskButton = document.querySelector('button:contains("Criar Tarefas")') as HTMLElement;
    if (taskButton) {
      taskButton.click();
    } else {
      toast.error('Nenhum item selecionado', 'Selecione documentos para criar tarefas');
    }
  }

  private bulkReprocess() {
    const reprocessButton = document.querySelector('button:contains("Reprocessar")') as HTMLElement;
    if (reprocessButton) {
      reprocessButton.click();
    } else {
      toast.error('Nenhum item selecionado', 'Selecione documentos para reprocessar');
    }
  }

  public getShortcutsList() {
    return [
      { key: 'Ctrl+1', action: 'Ir para Dashboard' },
      { key: 'Ctrl+2', action: 'Ir para Documentos' },
      { key: 'Ctrl+3', action: 'Ir para Tarefas' },
      { key: 'Ctrl+4', action: 'Ir para Upload' },
      { key: 'Ctrl+F', action: 'Focar na busca' },
      { key: 'Ctrl+N', action: 'Novo documento' },
      { key: 'Ctrl+S', action: 'Salvar' },
      { key: 'Ctrl+A', action: 'Selecionar todos' },
      { key: 'Ctrl+Shift+E', action: 'Exportar dados' },
      { key: 'Ctrl+Shift+A', action: 'Arquivar selecionados' },
      { key: 'Ctrl+Shift+T', action: 'Criar tarefas em lote' },
      { key: 'Ctrl+Shift+R', action: 'Reprocessar selecionados' },
      { key: 'Esc', action: 'Fechar modais' },
    ];
  }

  public disable() {
    this.isEnabled = false;
  }

  public enable() {
    this.isEnabled = true;
  }
}

export const keyboardShortcuts = new KeyboardShortcuts();