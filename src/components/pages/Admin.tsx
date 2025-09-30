import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Settings, Users, Key, Bell, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function Admin() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="mb-2">Administração</h1>
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="org-name">Nome da Organização</Label>
                <Input id="org-name" defaultValue="Energia & Infra" />
              </div>
              <div>
                <Label htmlFor="ocr-threshold">Limite de Confiança OCR (%)</Label>
                <Input id="ocr-threshold" type="number" defaultValue="70" />
                <p className="text-xs text-[var(--muted)] mt-1">
                  Documentos abaixo deste valor serão marcados para revisão
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações de Alta Prioridade</Label>
                  <p className="text-xs text-[var(--muted)]">
                    Enviar alertas imediatos para docs com score &gt; 70%
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Processamento Automático</Label>
                  <p className="text-xs text-[var(--muted)]">
                    Iniciar OCR automaticamente após upload
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="bg-[var(--primary)] hover:bg-[var(--primary-700)]">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gerenciamento de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                      <Button variant="outline" size="sm" className="text-[var(--danger)]">
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Chaves de API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Autenticação de Dois Fatores</Label>
                  <p className="text-xs text-[var(--muted)]">
                    Requer 2FA para todos os usuários
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Logs de Auditoria</Label>
                  <p className="text-xs text-[var(--muted)]">
                    Registrar todas as ações do sistema
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Expiração de Sessão</Label>
                  <p className="text-xs text-[var(--muted)]">
                    Tempo de inatividade antes do logout
                  </p>
                </div>
                <Input type="number" defaultValue="30" className="w-24" />
              </div>
              <Button className="bg-[var(--primary)] hover:bg-[var(--primary-700)]">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}