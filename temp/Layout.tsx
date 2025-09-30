import { useState } from 'react';
import {
  LayoutDashboard,
  Upload,
  FileText,
  CheckSquare,
  Activity,
  Settings,
  HelpCircle,
  FileCode,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  Sun,
  Moon,
  Home,
} from 'lucide-react';
// Update the import path if the theme hook is located elsewhere, for example:
import { useTheme } from '../hooks/theme';
// Or create the '../lib/theme.ts' file with the useTheme hook if missing.
// If your authentication hook is located elsewhere, update the path accordingly, for example:
import { useAuth } from '../hooks/auth';
// Or, if you don't have an auth hook, you can create a placeholder to avoid errors:
//
// export function useAuth() {
//   return { logout: () => {}, user: { name: 'João Silva' } };
// }
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

// Tipos para as props do Layout
type Breadcrumb = { label: string; href?: string };
type LayoutProps = {
  children: React.ReactNode;
  currentPage: string;
  breadcrumbs?: Breadcrumb[];
};

// Itens do menu lateral
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'documents', label: 'Documentos', path: '/documents', icon: FileText },
  { id: 'upload', label: 'Upload', path: '/upload', icon: Upload },
  { id: 'tasks', label: 'Tarefas', path: '/tasks', icon: CheckSquare },
  { id: 'monitoring', label: 'Monitoramento', path: '/monitoring', icon: Activity },
  { id: 'logs', label: 'Logs', path: '/logs', icon: FileCode },
  { id: 'admin', label: 'Admin', path: '/admin', icon: Settings },
  { id: 'help', label: 'Ajuda', path: '/help', icon: HelpCircle },
];

export function Layout({ children, currentPage, breadcrumbs = [] }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const [notifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Função para lidar com responsividade do menu lateral
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;

  // Expande o menu ao passar o mouse (apenas desktop)
  const handleSidebarMouseEnter = () => {
    if (isDesktop) setSidebarExpanded(true);
  };
  const handleSidebarMouseLeave = () => {
    if (isDesktop) setSidebarExpanded(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] transition-colors duration-200 lg:flex lg:flex-row">
      {/* Sidebar */}
      <aside
        className={`sidebar${sidebarExpanded ? ' sidebar--expanded' : ''} bg-[var(--surface)] border-r border-[var(--border)] z-50 transition-all duration-200 ease-in-out shadow-[var(--shadow)] lg:static lg:block`}
        style={{ width: sidebarExpanded ? '256px' : '60px', minWidth: sidebarExpanded ? '256px' : '60px', maxWidth: sidebarExpanded ? '256px' : '60px', display: 'flex' }}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        <div className="flex flex-col h-full min-h-screen">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center px-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2L3 7V13L10 18L17 13V7L10 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="10" cy="10" r="2" fill="white" />
                </svg>
              </div>
              {sidebarExpanded && <span className="font-semibold text-[var(--text)] sidebar-label">Triagem IA</span>}
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-1 py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.path}
                      className={`flex items-center ${sidebarExpanded ? 'gap-3 px-3 py-2.5' : 'justify-center py-2'} rounded-lg transition-colors duration-150 ${isActive ? 'bg-[var(--primary)] text-white' : 'text-[var(--text)] hover:bg-[var(--bg)]'}`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarExpanded && <span className="font-medium sidebar-label">{item.label}</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          {/* Footer */}
          <div className="p-4 border-t border-[var(--border)]">
            <div className="text-xs text-[var(--muted)] space-y-1 sidebar-label">
              <div>Energia & Infra</div>
              <div>v1.0.0 • Set 2025</div>
            </div>
          </div>
        </div>
      </aside>
      {/* Main content */}
      <div className={`main-content min-h-screen flex flex-col transition-all duration-200 flex-1 ${sidebarExpanded ? 'lg:ml-[256px]' : 'lg:ml-[60px]'}`}>
        {/* Topbar */}
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-30 shadow-[var(--shadow)]">
          <div className="h-full px-4 flex items-center justify-between gap-4">
            {/* Left section */}
            <div className="flex items-center gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <Input
                  placeholder="Buscar documentos, tarefas..."
                  className="pl-10 bg-[var(--bg)] border-[var(--border)]"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter' && searchQuery) {
                      window.location.href = `/documents?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                />
              </div>
            </div>
            {/* Right section */}
            <div className="flex items-center gap-2">
              {/* Mobile search */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => {
                const query = prompt('Buscar:');
                if (query) window.location.href = `/documents?search=${encodeURIComponent(query)}`;
              }}>
                <Search className="w-5 h-5" />
              </Button>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {notifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[var(--danger)] text-white border-0">{notifications}</Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="py-2 px-2 space-y-2">
                    {/* ...notificações... */}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-[var(--primary)] cursor-pointer" onClick={() => toast.info('Todas as notificações', { description: 'Redirecionando...' })}>
                    Ver todas as notificações
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Theme toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-[var(--primary)] text-white">{user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'JS'}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">{user?.name || 'João Silva'}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.info('Perfil', { description: 'Recurso em desenvolvimento' })}>Perfil</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/admin'}>Configurações</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-[var(--danger)]" onClick={() => {
                    if (confirm('Deseja realmente sair?')) {
                      logout();
                      toast.success('Logout realizado', { description: 'Até logo!' });
                      window.location.href = '/login';
                    }
                  }}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    <Home className="w-4 h-4" />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbSeparator>
                      <ChevronRight className="w-4 h-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 || !crumb.href ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}