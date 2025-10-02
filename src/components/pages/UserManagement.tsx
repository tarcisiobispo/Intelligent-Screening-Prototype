import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Users, Plus, Search, MoreHorizontal, Edit, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: ''
  });

  const users = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      role: 'Admin',
      department: 'TI',
      status: 'Ativo',
      lastLogin: '2 horas atrás'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      role: 'Analista',
      department: 'Engenharia',
      status: 'Ativo',
      lastLogin: '1 dia atrás'
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro.costa@empresa.com',
      role: 'Operador',
      department: 'Operações',
      status: 'Inativo',
      lastLogin: '1 semana atrás'
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    toast.success('Usuário adicionado', { description: `${newUser.name} foi adicionado ao sistema.` });
    setNewUser({ name: '', email: '', role: '', department: '' });
    setIsAddUserOpen(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Analista': return 'bg-blue-100 text-blue-800';
      case 'Operador': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Gerenciamento de Usuários</h1>
          <p className="text-[var(--muted)]">Gerencie usuários e suas permissões no sistema</p>
        </div>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Função</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Administrador</SelectItem>
                    <SelectItem value="Analista">Analista</SelectItem>
                    <SelectItem value="Operador">Operador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddUser} className="flex-1">
                  Adicionar Usuário
                </Button>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Usuários', value: '12', icon: Users },
          { label: 'Usuários Ativos', value: '10', icon: Users },
          { label: 'Administradores', value: '3', icon: Users },
          { label: 'Novos este mês', value: '2', icon: Plus }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Usuários do Sistema</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
              <Input
                placeholder="Buscar usuários..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-[var(--primary)] text-white">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{user.email}</p>
                    <p className="text-xs text-[var(--muted)]">Último login: {user.lastLogin}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                  <span className="text-sm text-[var(--muted)] hidden sm:block">{user.department}</span>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Edit className="w-4 h-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-600">
                        <Trash2 className="w-4 h-4" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}