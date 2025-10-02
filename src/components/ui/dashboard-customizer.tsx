import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { dashboardCustomization, type DashboardLayout } from '../../lib/dashboard-customization';
import { Settings, X, RotateCcw, Download, Upload } from 'lucide-react';

interface DashboardCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onLayoutChange: (layout: DashboardLayout) => void;
}

export function DashboardCustomizer({ isOpen, onClose, onLayoutChange }: DashboardCustomizerProps) {
  const [layout, setLayout] = useState(dashboardCustomization.getLayout());

  if (!isOpen) return null;

  const handleToggleWidget = (widgetId: string) => {
    const newLayout = {
      ...layout,
      widgets: layout.widgets.map(w => 
        w.id === widgetId ? { ...w, visible: !w.visible } : w
      )
    };
    setLayout(newLayout);
    dashboardCustomization.saveLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const handleCompactMode = (enabled: boolean) => {
    const newLayout = { ...layout, compactMode: enabled };
    setLayout(newLayout);
    dashboardCustomization.saveLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const handleReset = () => {
    dashboardCustomization.resetToDefault();
    const defaultLayout = dashboardCustomization.getLayout();
    setLayout(defaultLayout);
    onLayoutChange(defaultLayout);
  };

  const handleExport = () => {
    const layoutJson = dashboardCustomization.exportLayout();
    const blob = new Blob([layoutJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-layout.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (dashboardCustomization.importLayout(content)) {
            const newLayout = dashboardCustomization.getLayout();
            setLayout(newLayout);
            onLayoutChange(newLayout);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md sm:max-w-lg lg:max-w-xl max-h-[90vh] overflow-hidden bg-[var(--surface)] border border-[var(--border)] shadow-xl">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Personalizar Dashboard
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-6 overflow-y-auto" style={{maxHeight: 'calc(90vh - 120px)'}}>
          {/* Widgets Visibility */}
          <div>
            <h4 className="text-base font-medium mb-3">Widgets Visíveis</h4>
            <div className="space-y-3">
              {layout.widgets.map(widget => (
                <div key={widget.id} className="flex items-center gap-3">
                  <Checkbox
                    id={widget.id}
                    checked={widget.visible}
                    onCheckedChange={() => handleToggleWidget(widget.id)}
                  />
                  <Label htmlFor={widget.id} className="text-sm">
                    {widget.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Layout Options */}
          <div>
            <h4 className="text-base font-medium mb-3">Opções de Layout</h4>
            <div className="flex items-center gap-3">
              <Checkbox
                id="compact-mode"
                checked={layout.compactMode}
                onCheckedChange={handleCompactMode}
              />
              <Label htmlFor="compact-mode" className="text-sm">
                Modo Compacto (cards menores)
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-[var(--border)]">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
              <Button variant="outline" size="sm" onClick={handleImport} className="flex-1 gap-2">
                <Upload className="w-4 h-4" />
                Importar
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset} className="w-full gap-2">
              <RotateCcw className="w-4 h-4" />
              Restaurar Padrão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}