# Triagem Inteligente - Style Guide

## 🎨 Design System

### Colors (CSS Tokens)

#### Light Mode
```css
--primary: #005B8F;         /* Primary actions, links */
--primary-700: #00456D;     /* Primary hover state */
--primary-300: #4FA3D9;     /* Primary light variant */
--accent: #FF8A00;          /* Accent/warning highlights */
--danger: #D64545;          /* Errors, high priority */
--success: #2ECC71;         /* Success states */
--warning: #F6C85F;         /* Warnings, medium priority */
--bg: #F8FAFC;             /* Page background */
--surface: #FFFFFF;         /* Card/panel background */
--text: #0F172A;           /* Primary text */
--muted: #64748B;          /* Secondary text */
```

#### Dark Mode
```css
[data-theme="dark"] {
  --bg: #0B1220;
  --surface: #0F1724;
  --text: #E6EEF6;
  --muted: #9AB0C9;
  --primary: #4FA3D9;
  --accent: #FFB16A;
  --danger: #FF7B7B;
  --success: #66D38B;
  --card-border: rgba(255, 255, 255, 0.04);
}
```

### Typography

**Font Family:** Inter

**Scale:**
- H1: 28px / 36px / 700
- H2: 24px / 32px / 700
- H3: 20px / 28px / 600
- H4: 18px / 26px / 600
- Body: 16px / 24px / 400
- Label: 14px / 20px / 500

### Spacing

**Base unit:** 8px

Common spacing values: 8px, 16px, 24px, 32px, 48px

### Border Radius

**Base:** 10px

Use consistently across cards, buttons, inputs.

### Shadows

**Default shadow:** `0 6px 18px rgba(15, 23, 42, 0.06)`

Use for cards and elevated components.

## 🎯 Component Patterns

### Score Badges

```tsx
// High score (≥70%): Red background, danger color
// Medium score (30-70%): Yellow background, warning color  
// Low score (<30%): Green background, success color
```

### OCR Confidence Badges

```tsx
// High (≥80%): Success green
// Med (50-80%): Warning yellow
// Low (<50%): Danger red
```

### Highlights in Document Viewer

```tsx
// Risk keywords: Red (#D64545)
// Equipment: Blue (#005B8F)
// Date: Orange (#FF8A00)
// Value: Green (#2ECC71)
```

## 📱 Responsive Breakpoints

- Mobile: < 768px (single column, slide-over panels)
- Tablet: 768px - 1024px
- Desktop: > 1024px (sidebar visible, split views)

## ♿ Accessibility

### Contrast Ratios
- Normal text: ≥ 4.5:1
- Large text: ≥ 3:1

### Focus States
- Visible outline: 2px solid var(--primary)
- Outline offset: 2px

### Keyboard Navigation
- J/K: Navigate list items
- R: Revisar/Review document
- T: Create task
- Tab/Shift+Tab: Focus navigation

### ARIA
- Use aria-live for toast notifications
- Proper labels for all form inputs
- Role attributes for custom components

## 🎭 Motion

### Transitions
- Duration: 150-200ms for UI interactions
- Easing: ease-in-out

### Reduced Motion
Respect `prefers-reduced-motion` - animations < 10ms

## 📄 Microcopy

### Upload Page
- "Arraste arquivos aqui ou conecte seu Google Drive."
- "OCR de baixa confiança. Reprocessar ou solicitar reenvio?"

### Document Cards
- "Transformador T123: temperatura 120°C (2025-09-20) — Recomendado desligamento."

### Task Creation
- "Tarefa criada: Investigar T123 — alta temperatura. Ir para tarefa."

### Feedback
- "Obrigado — seu feedback foi registrado."

## 🏗️ Architecture

### File Structure
```
/components
  /pages         # Page components
  /ui            # ShadCN components
  Layout.tsx     # Main layout with sidebar + topbar
/lib
  mockApi.ts     # Mock API functions
  theme.tsx      # Theme provider
/styles
  globals.css    # Design tokens + base styles
```

### State Management
- Local state with useState/useEffect
- No global state library required
- Mock API for data fetching

### Routing
- Client-side routing via history API
- Link interception for SPA behavior
- URL pattern: `/documents/:id`

## 🔧 Mock APIs

### Endpoints
- `POST /api/documents/upload` - Upload files
- `GET /api/documents` - List documents (with filters)
- `GET /api/documents/:id` - Get single document
- `POST /api/documents/:id/reprocess` - Reprocess OCR
- `POST /api/tasks` - Create task
- `POST /api/documents/:id/feedback` - Submit feedback

### Timing
- Upload: 0.5-1s per file
- OCR: 1.5-3s per document
- Task creation: 300-600ms
- Toasts: Appear in 200ms, dismiss in 4s

## 🎨 Jakob Nielsen's Heuristics Implementation

1. **Visibility of System Status** - Loading states, progress bars, toast notifications
2. **Match System & Real World** - Industry terminology (transformador, bomba)
3. **User Control & Freedom** - Undo in toasts (5s), editable fields
4. **Consistency** - Design tokens, component patterns
5. **Error Prevention** - Validation, confirmation dialogs
6. **Recognition vs Recall** - Breadcrumbs, saved filters, icons+labels
7. **Flexibility** - Keyboard shortcuts, saved filters, bulk actions
8. **Aesthetic & Minimalist** - Clean UI, focused content
9. **Error Recovery** - Reprocess OCR, request resend
10. **Help & Documentation** - Help page, contextual tooltips

## 🚀 Performance

- Lazy load heavy components
- Optimize re-renders with memoization
- Debounce search inputs
- Virtual scrolling for long lists (if needed)

## 📦 Assets

All mock document data and icons are embedded in the code.
Use Lucide React for all icons.
No external images required - ImageWithFallback for dynamic content.