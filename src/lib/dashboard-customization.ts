import { toast } from 'sonner';

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'kpi' | 'chart' | 'alert';
  visible: boolean;
  order: number;
  size: 'small' | 'medium' | 'large';
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  theme: 'light' | 'dark' | 'auto';
  compactMode: boolean;
}

class DashboardCustomization {
  private storageKey = 'dashboard-layout';
  
  getDefaultLayout(): DashboardLayout {
    return {
      widgets: [
        { id: 'total-docs', title: 'Total de Documentos', type: 'kpi', visible: true, order: 1, size: 'small' },
        { id: 'pending-review', title: 'Pendentes de Revisão', type: 'kpi', visible: true, order: 2, size: 'small' },
        { id: 'high-priority', title: 'Alta Prioridade', type: 'kpi', visible: true, order: 3, size: 'small' },
        { id: 'ocr-issues', title: 'OCR Inexato', type: 'kpi', visible: true, order: 4, size: 'small' },
        { id: 'critical-alert', title: 'Alertas Críticos', type: 'alert', visible: true, order: 5, size: 'medium' },
        { id: 'docs-by-type', title: 'Documentos por Tipo', type: 'chart', visible: true, order: 6, size: 'medium' },
        { id: 'tasks-status', title: 'Tarefas por Status', type: 'chart', visible: true, order: 7, size: 'medium' },
        { id: 'processing-trend', title: 'Volume de Processamento', type: 'chart', visible: true, order: 8, size: 'large' },
      ],
      theme: 'auto',
      compactMode: false,
    };
  }

  getLayout(): DashboardLayout {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : this.getDefaultLayout();
    } catch {
      return this.getDefaultLayout();
    }
  }

  saveLayout(layout: DashboardLayout) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(layout));
      toast.success('Layout salvo', 'Personalização aplicada com sucesso');
    } catch {
      toast.error('Erro ao salvar', 'Não foi possível salvar o layout');
    }
  }

  toggleWidget(widgetId: string) {
    const layout = this.getLayout();
    const widget = layout.widgets.find(w => w.id === widgetId);
    if (widget) {
      widget.visible = !widget.visible;
      this.saveLayout(layout);
    }
  }

  reorderWidgets(widgetIds: string[]) {
    const layout = this.getLayout();
    widgetIds.forEach((id, index) => {
      const widget = layout.widgets.find(w => w.id === id);
      if (widget) {
        widget.order = index + 1;
      }
    });
    layout.widgets.sort((a, b) => a.order - b.order);
    this.saveLayout(layout);
  }

  setCompactMode(enabled: boolean) {
    const layout = this.getLayout();
    layout.compactMode = enabled;
    this.saveLayout(layout);
  }

  resetToDefault() {
    const defaultLayout = this.getDefaultLayout();
    this.saveLayout(defaultLayout);
    toast.success('Layout restaurado', 'Configurações padrão aplicadas');
  }

  exportLayout(): string {
    return JSON.stringify(this.getLayout(), null, 2);
  }

  importLayout(layoutJson: string): boolean {
    try {
      const layout = JSON.parse(layoutJson);
      this.saveLayout(layout);
      return true;
    } catch {
      toast.error('Layout inválido', 'Formato JSON incorreto');
      return false;
    }
  }
}

export const dashboardCustomization = new DashboardCustomization();