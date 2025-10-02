import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { Settings, Users, Key, Bell, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { undoManager } from '../../lib/undo-manager';

export function Admin() {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const handleRemoveUser = (userName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remover Usuário',
      message: `Tem certeza que deseja remover ${userName}? Esta ação pode ser desfeita.`,
      onConfirm: () => {
        undoManager.addAction(
          `Usuário ${userName} removido`,
          async () => {
            toast.success(`Usuário ${userName} restaurado`);
          }
        );
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Administração</h1>
        <p className="text-[var(--muted)]">Configurações do sistema e gerenciamento de usuários</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Settings className="w-5 h-5" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="org-name">Nome da Organização</Label>
                <Input id="org-name" defaultValue="Energia & Infra" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ocr-threshold">Limite de Confiança OCR (%)</Label>
                <Input id="ocr-threshold" type="number" defaultValue="70" />
                <p className="text-xs text-[var(--muted)]">
                  Documentos abaixo deste valor serão marcados para revisão
                </p>
              </div>
              <div className="flex items-start gap-4">
                <Checkbox id="notifications" defaultChecked className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="notifications">Notificações de Alta Prioridade</Label>
                  <p className="text-xs text-[var(--muted)]">
                    Enviar alertas imediatos para docs com score &gt; 70%
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Checkbox id="auto-processing" defaultChecked className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="auto-processing">Processamento Automático</Label>
                  <p className="text-xs text-[var(--muted)]">
                    Iniciar OCR automaticamente após upload
                  </p>
                </div>
              </div>
              <Button className="bg-[var(--primary)] hover:bg-[var(--primary-700)]">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Users className="w-5 h-5" />
                Gerenciamento de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-4">
                {['João Silva', 'Maria Santos', 'Pedro Costa'].map((user) => (
                  <div
                    key={user}
                    className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{user}</div>
                      <div className="text-sm text-[var(--muted)]">
                        {user.toLowerCase().replace(' ', '.')}@empresa.com
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-[var(--danger)]"
                        onClick={() => handleRemoveUser(user)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  + Adicionar Usuário
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Key className="w-5 h-5" />
                Chaves de API
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
              <div>
                <Label>Chave de Produção</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="password"
                    value="sk_prod_••••••••••••••••"
                    readOnly
                  />
                  <Button variant="outline">Copiar</Button>
                  <Button variant="outline">Regenerar</Button>
                </div>
              </div>
              <div>
                <Label>Chave de Desenvolvimento</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="password"
                    value="sk_dev_••••••••••••••••"
                    readOnly
                  />
                  <Button variant="outline">Copiar</Button>
                  <Button variant="outline">Regenerar</Button>
                </div>
              </div>
              <div className="pt-4 border-t border-[var(--border)]">
                <h4 className="mb-2">Webhooks</h4>
                <Input placeholder="https://api.exemplo.com/webhook" />
                <Button className="mt-2">Adicionar Webhook</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Shield className="w-5 h-5" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-6">
              <div className="flex items-start gap-4">
                <Checkbox id="2fa" defaultChecked className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="2fa">Autenticação de Dois Fatores</Label>
                  <p className="text-xs text-[var(--muted)]">
                    Requer 2FA para todos os usuários
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Checkbox id="audit-logs" defaultChecked className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="audit-logs">Logs de Auditoria</Label>
                  <p className="text-xs text-[var(--muted)]">
                    Registrar todas as ações do sistema
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Expiração de Sessão (minutos)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" className="w-24" />
                <p className="text-xs text-[var(--muted)]">
                  Tempo de inatividade antes do logout
                </p>
              </div>
              <Button className="bg-[var(--primary)] hover:bg-[var(--primary-700)]">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
    </div>
  );
}