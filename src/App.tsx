import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './lib/theme';
import { AuthProvider, useAuth } from './lib/auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/pages/Dashboard';
import { Upload } from './components/pages/Upload';
import { Documents } from './components/pages/Documents';
import { DocumentViewer } from './components/pages/DocumentViewer';
import { Tasks } from './components/pages/Tasks';
import { Monitoring } from './components/pages/Monitoring';
import { Admin } from './components/pages/Admin';
import { Help } from './components/pages/Help';
import { Logs } from './components/pages/Logs';
import { Notifications } from './components/pages/Notifications';
import { Login } from './components/pages/Login';
import { Toaster } from './components/ui/sonner';

// Simple client-side router
function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [documentId, setDocumentId] = useState<string | null>(null);

  // Single useEffect to handle all path updates
  useEffect(() => {
    const updatePath = () => {
      const path = window.location.pathname;
      setCurrentPath(path);

      const docMatch = path.match(/^\/documents\/(.+)$/);
      if (docMatch) {
        setDocumentId(docMatch[1]);
      } else {
        setDocumentId(null);
      }
    };

    // Initial load
    updatePath();

    // Handle browser back/forward
    const handlePopState = () => {
      updatePath();
    };

    // Intercept link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href && link.origin === window.location.origin) {
        e.preventDefault();
        const newPath = link.pathname;
        window.history.pushState({}, '', newPath);
        updatePath();
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Redirect authenticated users from / or /login to /dashboard
  useEffect(() => {
    if (isAuthenticated && (currentPath === '/' || currentPath === '/login')) {
      window.history.replaceState({}, '', '/dashboard');
      setCurrentPath('/dashboard');
    }
  }, [isAuthenticated, currentPath]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--muted)]">Carregando...</p>
        </div>
      </div>
    );
  }


  // Se não autenticado, renderiza login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Se autenticado e na rota raiz ou login, trata como dashboard
  const effectivePath = (currentPath === '/' || currentPath === '/login') ? '/dashboard' : currentPath;


  // AUTHENTICATED ROUTES - Determine what to render
  let page = 'dashboard';
  let component = <Dashboard />;
  let breadcrumbs: Array<{ label: string; href?: string }> = [];

  // Document viewer tem prioridade
  if (documentId) {
    page = 'documents';
    component = <DocumentViewer documentId={documentId} />;
    breadcrumbs = [
      { label: 'Documentos', href: '/documents' },
      { label: 'Visualizar' },
    ];
  } else {
    // Route based on effective path
    switch (effectivePath) {
      case '/dashboard':
        page = 'dashboard';
        component = <Dashboard />;
        breadcrumbs = [];
        break;
      case '/upload':
        page = 'upload';
        component = <Upload />;
        breadcrumbs = [{ label: 'Upload' }];
        break;
      case '/documents':
        page = 'documents';
        component = <Documents />;
        breadcrumbs = [{ label: 'Documentos' }];
        break;
      case '/tasks':
        page = 'tasks';
        component = <Tasks />;
        breadcrumbs = [{ label: 'Tarefas' }];
        break;
      case '/monitoring':
        page = 'monitoring';
        component = <Monitoring />;
        breadcrumbs = [{ label: 'Monitoramento' }];
        break;
      case '/admin':
        page = 'admin';
        component = <Admin />;
        breadcrumbs = [{ label: 'Administração' }];
        break;
      case '/help':
        page = 'help';
        component = <Help />;
        breadcrumbs = [{ label: 'Ajuda' }];
        break;
      case '/logs':
        page = 'logs';
        component = <Logs />;
        breadcrumbs = [{ label: 'Logs' }];
        break;
      case '/notifications':
        page = 'notifications';
        component = <Notifications />;
        breadcrumbs = [{ label: 'Notificações' }];
        break;
      default:
        // Unknown route - redireciona para dashboard
        page = 'dashboard';
        component = <Dashboard />;
        breadcrumbs = [];
        break;
    }
  }

  return (
    <Layout currentPage={page} breadcrumbs={breadcrumbs}>
      {component}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router />
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}