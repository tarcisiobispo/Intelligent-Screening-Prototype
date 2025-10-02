// Sistema de Design - Tokens e Padrões

export const colors = {
  // Primárias
  primary: {
    50: '#EBF8FF',
    100: '#BEE3F8', 
    500: '#003D5C',
    600: '#002A3F',
    700: '#001F2E',
    900: '#0A1628'
  },
  
  // Secundárias
  secondary: {
    50: '#FEF3C7',
    100: '#FDE68A',
    500: '#D97706',
    600: '#B45309',
    700: '#92400E'
  },
  
  // Neutros
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A'
  },
  
  // Estados
  success: '#0F7B0F',
  error: '#B91C1C',
  warning: '#D97706',
  info: '#0369A1'
};

export const typography = {
  // Hierarquia de títulos
  h1: 'text-3xl font-bold leading-tight tracking-tight text-[var(--text)]',
  h2: 'text-2xl font-bold leading-tight text-[var(--text)]',
  h3: 'text-xl font-semibold leading-snug text-[var(--text)]',
  h4: 'text-lg font-semibold text-[var(--text)]',
  h5: 'text-base font-semibold text-[var(--text)]',
  
  // Corpo de texto
  body: 'text-sm leading-relaxed text-[var(--text)]',
  bodyLarge: 'text-base leading-relaxed text-[var(--text)]',
  bodySmall: 'text-xs leading-normal text-[var(--text)]',
  
  // Especiais
  caption: 'text-xs text-[var(--muted)] uppercase tracking-wide font-medium',
  label: 'text-sm font-medium text-[var(--text)]',
  code: 'font-mono text-sm bg-neutral-100 px-1 py-0.5 rounded'
};

export const spacing = {
  // Espaçamentos padronizados (em rem)
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
  
  // Classes Tailwind equivalentes
  classes: {
    xs: 'p-1',
    sm: 'p-2', 
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-6',
    '2xl': 'p-8',
    '3xl': 'p-12',
    '4xl': 'p-16'
  }
};

export const components = {
  // Botões padronizados
  button: {
    base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    
    variants: {
      primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-700)] focus-visible:ring-[var(--primary)]',
      secondary: 'bg-[var(--secondary)] text-white hover:bg-[var(--secondary-600)] focus-visible:ring-[var(--secondary)]',
      outline: 'border border-[var(--border)] bg-transparent hover:bg-[var(--neutral-50)] focus-visible:ring-[var(--primary)]',
      ghost: 'hover:bg-[var(--neutral-100)] focus-visible:ring-[var(--primary)]',
      destructive: 'bg-[var(--danger)] text-white hover:bg-red-700 focus-visible:ring-red-500'
    },
    
    sizes: {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      icon: 'h-10 w-10'
    }
  },
  
  // Cards padronizados
  card: {
    base: 'rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm',
    header: 'p-6 pb-0',
    content: 'p-6',
    footer: 'p-6 pt-0'
  },
  
  // Inputs padronizados
  input: {
    base: 'flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm placeholder:text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    error: 'border-[var(--danger)] focus-visible:ring-[var(--danger)]',
    success: 'border-[var(--success)] focus-visible:ring-[var(--success)]'
  },
  
  // Badges/Tags
  badge: {
    base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    variants: {
      default: 'bg-[var(--neutral-100)] text-[var(--neutral-800)]',
      primary: 'bg-[var(--primary)] text-white',
      secondary: 'bg-[var(--secondary)] text-white',
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800'
    }
  }
};

// Utilitários para aplicar o design system
export const ds = {
  // Aplicar tipografia
  text: (variant: keyof typeof typography) => typography[variant],
  
  // Aplicar espaçamento
  space: (size: keyof typeof spacing.classes) => spacing.classes[size],
  
  // Combinar classes de componente
  button: (variant: keyof typeof components.button.variants, size: keyof typeof components.button.sizes = 'md') => 
    `${components.button.base} ${components.button.variants[variant]} ${components.button.sizes[size]}`,
    
  card: () => components.card.base,
  
  input: (state?: 'error' | 'success') => 
    `${components.input.base} ${state ? components.input[state] : ''}`,
    
  badge: (variant: keyof typeof components.badge.variants = 'default') =>
    `${components.badge.base} ${components.badge.variants[variant]}`
};