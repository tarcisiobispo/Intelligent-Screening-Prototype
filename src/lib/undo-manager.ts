import { toast } from 'sonner';

interface UndoAction {
  id: string;
  description: string;
  undo: () => Promise<void>;
  timestamp: number;
}

class UndoManager {
  private actions: UndoAction[] = [];
  private readonly TIMEOUT = 10000; // 10 segundos

  addAction(description: string, undoFn: () => Promise<void>): string {
    const id = `undo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const action: UndoAction = {
      id,
      description,
      undo: undoFn,
      timestamp: Date.now()
    };

    this.actions.push(action);

    // Mostrar toast com opção de desfazer
    const toastId = toast.success(description, {
      description: 'Clique para desfazer',
      duration: this.TIMEOUT,
      action: {
        label: 'Desfazer',
        onClick: () => this.executeUndo(id)
      }
    });

    // Remover ação após timeout
    setTimeout(() => {
      this.removeAction(id);
    }, this.TIMEOUT);

    return id;
  }

  private async executeUndo(actionId: string): Promise<void> {
    const action = this.actions.find(a => a.id === actionId);
    if (!action) return;

    try {
      await action.undo();
      toast.success('Ação desfeita com sucesso');
    } catch (error) {
      toast.error('Erro ao desfazer ação');
    } finally {
      this.removeAction(actionId);
    }
  }

  private removeAction(actionId: string): void {
    this.actions = this.actions.filter(a => a.id !== actionId);
  }
}

export const undoManager = new UndoManager();