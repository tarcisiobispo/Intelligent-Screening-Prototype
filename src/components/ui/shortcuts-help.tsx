import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { keyboardShortcuts } from '../../lib/keyboard-shortcuts';
import { Keyboard, X } from 'lucide-react';

export function ShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const shortcuts = keyboardShortcuts.getShortcutsList();

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="fixed bottom-4 right-4 gap-2 bg-[var(--bg)] border border-[var(--border)] shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Keyboard className="w-4 h-4" />
        Atalhos
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Atalhos de Teclado
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              data-close-modal
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-[var(--text)]">{shortcut.action}</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {shortcut.key}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}