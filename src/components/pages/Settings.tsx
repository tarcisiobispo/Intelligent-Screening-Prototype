import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';

export function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      documents: true,
      tasks: true,
      system: false
    },
    appearance: {
      theme: 'system',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo'
    },
    security: {
      twoFactor: false,
      sessionTimeout: '30',
      passwordExpiry: '90'
    }
  });

  const handleSave = () => {
    toast.success('Configurações salvas', { description: 'Suas preferências foram atualizadas.' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Configurações</h1>
        <p className="text-[var(--muted)]">Personalize sua experiência no sistema</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notificações por email</Label>
              <p className="text-sm text-[var(--muted)]">Receba atualizações importantes por email</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) => 
                setSettings({...settings, notifications: {...settings.notifications, email: checked}})
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Notificações push</Label>
              <p className="text-sm text-[var(--muted)]">Receba notificações no navegador</p>
            </div>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked) => 
                setSettings({...settings, notifications: {...settings.notifications, push: checked}})
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Documentos processados</Label>
              <p className="text-sm text-[var(--muted)]">Notificar quando documentos forem processados</p>
            </div>
            <Switch
              checked={settings.notifications.documents}
              onCheckedChange={(checked) => 
                setSettings({...settings, notifications: {...settings.notifications, documents: checked}})
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Tarefas atribuídas</Label>
              <p className="text-sm text-[var(--muted)]">Notificar sobre novas tarefas</p>
            </div>
            <Switch
              checked={settings.notifications.tasks}
              onCheckedChange={(checked) => 
                setSettings({...settings, notifications: {...settings.notifications, tasks: checked}})
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tema</Label>
              <Select value={settings.appearance.theme} onValueChange={(value) => 
                setSettings({...settings, appearance: {...settings.appearance, theme: value}})
              }>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Idioma</Label>
              <Select value={settings.appearance.language} onValueChange={(value) => 
                setSettings({...settings, appearance: {...settings.appearance, language: value}})
              }>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
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
              <Label>Autenticação de dois fatores</Label>
              <p className="text-sm text-[var(--muted)]">Adicione uma camada extra de segurança</p>
            </div>
            <Switch
              checked={settings.security.twoFactor}
              onCheckedChange={(checked) => 
                setSettings({...settings, security: {...settings.security, twoFactor: checked}})
              }
            />
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionTimeout">Timeout da sessão (minutos)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => 
                  setSettings({...settings, security: {...settings.security, sessionTimeout: e.target.value}})
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="passwordExpiry">Expiração da senha (dias)</Label>
              <Input
                id="passwordExpiry"
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) => 
                  setSettings({...settings, security: {...settings.security, passwordExpiry: e.target.value}})
                }
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}