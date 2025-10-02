// Design System Tokens
export const designTokens = {
  // Typography
  typography: {
    h1: 'text-2xl font-bold text-[var(--text)] mb-2',
    h2: 'text-xl font-bold text-[var(--text)] mb-2',
    h3: 'text-lg font-semibold text-[var(--text)] mb-1',
    h4: 'text-base font-medium text-[var(--text)]',
    cardTitle: 'text-lg font-semibold',
    body: 'text-sm text-[var(--text)]',
    muted: 'text-sm text-[var(--muted)]',
    caption: 'text-xs text-[var(--muted)]',
  },

  // Spacing
  spacing: {
    cardPadding: 'p-4',
    cardContentPadding: 'pt-4',
    sectionGap: 'space-y-6',
    itemGap: 'space-y-4',
    smallGap: 'space-y-2',
    flexGap: 'gap-4',
    smallFlexGap: 'gap-2',
  },

  // Button Sizes
  button: {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 px-3 py-1.5',
    lg: 'h-10 px-6 py-2.5',
    icon: 'size-9',
  },

  // Icon Sizes
  icon: {
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-6 h-6',
  },

  // Card Heights
  card: {
    kpi: 'h-28',
    compact: 'min-h-[120px]',
    standard: 'min-h-[200px]',
  },

  // Filter Widths
  filter: {
    narrow: 'w-24',
    small: 'w-28',
    medium: 'w-32',
    wide: 'w-36',
  },
} as const;

// Helper function to get consistent classes
export const getDesignClass = (category: keyof typeof designTokens, key: string) => {
  return (designTokens[category] as any)[key] || '';
};