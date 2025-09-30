---
description: Repository Information Overview
alwaysApply: true
---

# Intelligent Screening Prototype Information

## Summary
A React-based web application for intelligent document screening in the Energy & Infrastructure sector. Features OCR, AI classification, and task management with a mobile-first responsive design and dark mode support.

## Structure
- **src/**: Main application code (components, pages, styles)
- **src/components/**: UI components and page implementations
- **src/lib/**: Utilities for auth, theme, and mock API
- **src/styles/**: Global CSS and styling
- **build/**: Production build output

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: React 18.3.1
**Build System**: Vite 6.3.6
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- React 18.3.1 (UI framework)
- Radix UI components (accessible UI primitives)
- Tailwind CSS (styling via flowbite)
- Recharts (interactive charts)
- Lucide React (icon system)
- React Hook Form (form handling)

**Development Dependencies**:
- TypeScript (type safety)
- Vite (build tool)
- SWC (fast compiler)

## Build & Installation
```bash
npm install
npm run dev    # Development server on port 3000
npm run build  # Production build
```

## Application Structure
**Entry Point**: src/main.tsx
**Routing**: Client-side routing in App.tsx
**State Management**: React Context (AuthProvider, ThemeProvider)
**Mock Backend**: src/lib/mockApi.ts

## Pages
- **Dashboard**: KPIs, charts, alerts, quick actions
- **Upload**: Drag & drop, batch upload, OCR simulation
- **Documents**: Document inbox sorted by AI score
- **Document Viewer**: Split view with highlights and editable fields
- **Tasks**: Kanban board for task management
- **Monitoring**: Service status and metrics
- **Admin**: User management and settings
- **Help**: Search, FAQ, resources
- **Logs**: System logs with filters

## Features
- **Authentication**: Login system with route protection
- **Dark Mode**: Toggle with localStorage persistence
- **Responsive Design**: Mobile-first with breakpoints
- **Accessibility**: WCAG 2.1 AA compliant
- **Mock APIs**: 8 endpoints with realistic timing
- **Interactive Charts**: Dashboard visualizations
- **Document Processing**: OCR simulation with confidence scores

## Design System
- **Colors**: Custom CSS variables for light/dark modes
- **Typography**: Inter font with consistent scaling
- **Spacing**: 8px-based system
- **Components**: 40+ reusable UI components