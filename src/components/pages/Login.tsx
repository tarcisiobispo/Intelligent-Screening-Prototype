import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';

import { useAuth } from '../../lib/auth';
import { validationRules, ValidationResult } from '../../lib/validation';
import { getErrorMessage } from '../../lib/error-messages';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Shield,
  HelpCircle,
  Zap,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  
  // Estados visuais calculados
  const emailError = emailTouched && (!email.includes('@') || email.length < 5);
  const passwordError = passwordTouched && password.length < 6;
  const emailSuccess = emailTouched && email.includes('@') && email.length >= 5;
  const passwordSuccess = passwordTouched && password.length >= 6;

  // Load remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const isFormValid = email.length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark fields as touched for validation
    setEmailTouched(true);
    setPasswordTouched(true);

    // Client-side validation
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido');
      toast.error('Email inválido');
      return;
    }

    if (!password || password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      toast.error('Senha muito curta');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      
      // Remember email if checkbox is checked
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      toast.success('Login realizado com sucesso!', {
        description: 'Redirecionando para o dashboard...',
      });

      // Redirect to dashboard
      setTimeout(() => {
        window.history.pushState({}, '', '/Intelligent-Screening-Prototype/dashboard');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 500);
    } catch (err: any) {
      const errorMsg = getErrorMessage('INVALID_CREDENTIALS');
      setError(errorMsg.description);
      
      toast.error(errorMsg.title, {
        description: errorMsg.suggestion,
        action: {
          label: errorMsg.action?.label || 'Tentar novamente',
          onClick: () => {
            setEmail('admin@triagem.com');
            setPassword('demo123');
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@triagem.com');
    setPassword('demo123');
    toast.success('Credenciais de demonstração preenchidas', {
      description: 'Clique em "Entrar" para continuar',
    });
  };

  const handleForgotPassword = () => {
    toast.info('Recuperação de senha', {
      description: 'Em um sistema real, um email seria enviado com instruções.',
      duration: 5000,
    });
  };

  const features = [
    {
      icon: Zap,
      title: 'OCR Inteligente',
      description: 'Processamento automático de documentos',
    },
    {
      icon: TrendingUp,
      title: 'Análise de Risco',
      description: 'Classificação automática com IA',
    },
    {
      icon: FileText,
      title: 'Triagem Automatizada',
      description: 'Priorização inteligente de documentos',
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-700)] mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="ds-h1 mb-2">Triagem Inteligente</h1>
            <p className="ds-body text-[var(--muted)]">
              Sistema de análise de documentos para Energia & Infraestrutura
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="ds-h4">Entrar na plataforma</CardTitle>
              <CardDescription className="ds-body text-[var(--muted)]">
                Insira suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Alert */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailValid(e.target.value.includes('@') && e.target.value.length >= 5);
                      }}
                      onBlur={() => setEmailTouched(true)}
                      className={`${
                        emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 
                        emailSuccess ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''
                      }`}
                      disabled={loading}
                    />

                  </div>
                  {emailError && (
                    <p className="text-xs text-red-500">Email deve ter formato válido</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordValid(e.target.value.length >= 6);
                      }}
                      onBlur={() => setPasswordTouched(true)}
                      className={`pr-10 ${
                        passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 
                        passwordSuccess ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''
                      }`}
                      disabled={loading}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-[var(--muted)]" />
                      ) : (
                        <Eye className="w-4 h-4 text-[var(--muted)]" />
                      )}
                    </Button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-500">Senha deve ter pelo menos 6 caracteres</p>
                  )}
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked: boolean | undefined) => setRememberMe(!!checked)}
                      disabled={loading}
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Lembrar-me
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={handleForgotPassword}
                    className="p-0 h-auto text-xs text-[var(--primary)] hover:underline"
                  >
                    Esqueceu a senha?
                  </Button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="ds-button ds-button-primary ds-button-md w-full"
                  disabled={loading}
                  aria-label={loading ? 'Entrando...' : 'Entrar'}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>

                {/* Demo Login Button */}
                <Button
                  type="button"
                  className="ds-button ds-button-outline ds-button-md w-full"
                  onClick={handleDemoLogin}
                  disabled={loading}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Usar credenciais de demonstração
                </Button>
              </form>

              {/* Help Link */}
              <div className="mt-6 text-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => window.location.href = '/help'}
                  className="text-[var(--muted)] hover:text-[var(--primary)]"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Precisa de ajuda?
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-[var(--muted)] mt-6">
            Ao entrar, você concorda com os Termos de Uso e Política de Privacidade
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Features (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-700)] p-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-lg text-white"
        >
          <h2 className="text-white mb-4">
            Triagem Inteligente de Documentos
          </h2>
          <p className="text-white/90 mb-8">
            Automatize a análise e classificação de documentos técnicos com inteligência artificial.
            Reduza tempo de processamento e identifique riscos críticos instantaneamente.
          </p>

          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white mb-1">{feature.title}</h3>
                    <p className="text-white/80 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-sm">
            <p className="text-sm text-white/90">
              💡 <strong>Dica:</strong> Use as credenciais de demonstração para explorar
              todas as funcionalidades do sistema sem necessidade de cadastro.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}