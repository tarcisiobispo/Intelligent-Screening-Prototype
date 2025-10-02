import React, { useState, useEffect } from 'react';
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
  Home,
} from 'lucide-react';
import { GlobalProgress } from './ui/global-progress';
import { StatusIndicator } from './ui/status-indicator';
import { useAuth } from '../lib/auth';
import { Button } from './ui/button';
import { navigate } from '../lib/navigation';
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
const BASE = (import.meta as any).env?.BASE_URL || '/';
const ORIGIN_BASE = (typeof window !== 'undefined' ? window.location.origin : '') + BASE;
const withBase = (p: string) => new URL(p.replace(/^\//, ''), ORIGIN_BASE).pathname;
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: withBase('/dashboard'), icon: LayoutDashboard },
  { id: 'documents', label: 'Documentos', path: withBase('/documents'), icon: FileText },
  { id: 'upload', label: 'Envio', path: withBase('/upload'), icon: Upload },
  { id: 'tasks', label: 'Tarefas', path: withBase('/tasks'), icon: CheckSquare },
  { id: 'monitoring', label: 'Monitoramento', path: withBase('/monitoring'), icon: Activity },
  { id: 'logs', label: 'Logs', path: withBase('/logs'), icon: FileCode },
  { id: 'admin', label: 'Administração', path: withBase('/admin'), icon: Settings },
  { id: 'help', label: 'Ajuda', path: withBase('/help'), icon: HelpCircle },
];

export function Layout({ children, currentPage, breadcrumbs = [] }: LayoutProps) {
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [globalProgressState, setGlobalProgressState] = useState({
    isVisible: false,
    progress: 0,
    message: ''
  });

  useEffect(() => {
    const handleGlobalProgress = (event: CustomEvent) => {
      setGlobalProgressState(event.detail);
    };

    window.addEventListener('globalProgress', handleGlobalProgress as EventListener);
    return () => window.removeEventListener('globalProgress', handleGlobalProgress as EventListener);
  }, []);

  // Mock notifications data
  const [notifications] = useState([
    {
      id: 1,
      title: 'Documento processado',
      description: 'Relatório T123 foi processado com sucesso',
      time: '5 min atrás',
      read: false,
      type: 'success',
    },
    {
      id: 2,
      title: 'Alta prioridade',
      description: 'Transformador T456 requer atenção imediata',
      time: '15 min atrás',
      read: false,
      type: 'warning',
    },
    {
      id: 3,
      title: 'Tarefa atribuída',
      description: 'Nova tarefa de revisão foi atribuída a você',
      time: '1 hora atrás',
      read: true,
      type: 'info',
    },
  ]);

  const getPageStatus = () => {
    const currentMenuItem = menuItems.find(item => item.id === currentPage);
    return currentMenuItem ? 'success' : 'idle';
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] transition-colors duration-200 lg:flex lg:flex-row">
      {/* Global Progress Bar */}
      <GlobalProgress 
        isVisible={globalProgressState.isVisible}
        progress={globalProgressState.progress}
        message={globalProgressState.message}
      />
      {/* Sidebar */}
      <aside
        className={`sidebar${sidebarExpanded ? ' sidebar--expanded' : ''} bg-[var(--surface)] border-r border-[var(--border)] z-50 transition-all duration-200 ease-in-out${sidebarOpen ? ' fixed top-0 left-0 h-full w-full' : ' hidden'} lg:static lg:block lg:h-auto shadow-[var(--shadow)]`}
        style={{ display: sidebarOpen || window.innerWidth >= 1024 ? 'flex' : 'none' }}
        onMouseEnter={() => window.innerWidth >= 1024 && setSidebarExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 1024 && setSidebarExpanded(false)}
      >
        <div className="flex flex-col h-full min-h-screen w-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between border-b border-[var(--border)] flex-shrink-0 px-3">
            <div className="flex items-center gap-3 overflow-hidden w-full">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0" style={{ minWidth: '32px', minHeight: '32px' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2L3 7V13L10 18L17 13V7L10 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="10" cy="10" r="2" fill="white" />
                </svg>
              </div>
              <span className="font-semibold text-[var(--text)] sidebar-label whitespace-nowrap overflow-hidden">Triagem IA</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-[var(--bg)] rounded flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto" role="navigation" aria-label="Navegação principal">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isActive ? 'bg-[var(--primary)] text-white' : 'text-[var(--text)] hover:bg-[var(--bg)]'}`}
                      onClick={() => setSidebarOpen(false)}
                      title={item.label}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" style={{ minWidth: '20px', minHeight: '20px' }} aria-hidden="true" />
                      <span className="font-medium sidebar-label whitespace-nowrap">{item.label}</span>
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
      <div className={`main-content min-h-screen flex flex-col transition-all duration-200 flex-1 ${sidebarExpanded ? 'lg:ml-[256px]' : 'lg:ml-[88px]'}`}>
        {/* Topbar */}
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-30 shadow-sm" role="banner">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            {/* Left section */}
            <div className="flex items-center gap-4 flex-1">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-[var(--bg)] rounded-lg">
                <Menu className="w-5 h-5" />
              </button>
              {/* Search */}
              <div className="relative flex-1 max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <Input
                  placeholder="Buscar documentos, tarefas..."
                  className="pl-10 h-9 bg-[var(--bg)] border-[var(--border)] text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery) {
                      navigate(`/documents?search=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                  aria-label="Buscar documentos e tarefas"
                />
              </div>
            </div>
            {/* Right section */}
            <div className="flex items-center gap-1">
              {/* Mobile search */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => {
                const query = prompt('Buscar:');
                if (query) navigate(`/documents?search=${encodeURIComponent(query)}`);
              }} aria-label="Buscar">
                <Search className="w-5 h-5" aria-hidden="true" />
              </Button>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label={`Notificações${notifications.filter(n => !n.read).length > 0 ? ` (${notifications.filter(n => !n.read).length} não lidas)` : ''}`}>
                    <Bell className="w-5 h-5" aria-hidden="true" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <Badge className="absolute top-0 right-0 w-4 h-4 p-0 flex items-center justify-center bg-[var(--danger)] text-white border-0 text-[10px] leading-none">
                        {notifications.filter(n => !n.read).length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notificações</span>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {notifications.filter(n => !n.read).length} novas
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-[var(--muted)]">
                        Nenhuma notificação
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-3 py-3 hover:bg-[var(--bg)] cursor-pointer transition-colors border-b border-[var(--border)] last:border-0 ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-950/10' : ''
                          }`}
                          onClick={() => {
                            toast.info(notification.title, { description: notification.description });
                          }}
                        >
                          <div className="flex gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              notification.type === 'success' ? 'bg-[var(--success)]' :
                              notification.type === 'warning' ? 'bg-[var(--warning)]' :
                              'bg-[var(--primary)]'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[var(--text)] mb-0.5">
                                {notification.title}
                              </p>
                              <p className="text-xs text-[var(--muted)] line-clamp-2 mb-1">
                                {notification.description}
                              </p>
                              <p className="text-xs text-[var(--muted)]">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-[var(--primary)] cursor-pointer" onClick={() => navigate('/notifications')}>
                    Ver todas as notificações
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-[var(--primary)] text-white">{user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'JS'}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">{user?.name || 'João Silva'}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.info('Perfil', { description: 'Recurso em desenvolvimento' })}>Perfil</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin')}>Configurações</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-[var(--danger)]" onClick={() => {
                    const shouldLogout = window.confirm('Deseja realmente sair do sistema?');
                    if (shouldLogout) {
                      logout();
                      toast.success('Logout realizado', { description: 'Até logo!' });
                    }
                  }}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        {/* Breadcrumbs with Status */}
        <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={withBase('/')}>
                    <Home className="w-4 h-4" />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="w-4 h-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-2">
                    {menuItems.find(item => item.id === currentPage)?.label || 'Página'}
                  </BreadcrumbPage>
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
                        <BreadcrumbLink href={withBase(crumb.href)}>{crumb.label}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            
            {/* Page Status Indicator */}
            <StatusIndicator 
              status={getPageStatus()}
              message={currentPage === 'dashboard' ? 'Dados atualizados' : 'Página carregada'}
              size="sm"
            />
          </div>
        </div>
        {/* Page content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8" style={{ marginTop: globalProgressState.isVisible ? '60px' : '0' }}>
          {children}
        </div>
      </div>
    </div>
  );
}