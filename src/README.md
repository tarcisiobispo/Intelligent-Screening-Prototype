# 🔷 Triagem Inteligente - Energia & Infra

Sistema de triagem inteligente de documentos com OCR, classificação por IA e gerenciamento de tarefas para o setor de Energia e Infraestrutura.

## 🔐 Acesso ao Sistema

### Credenciais de Demonstração
Use as seguintes credenciais para acessar o sistema:

**Administrador:**
- Email: `admin@triagem.com`
- Senha: `demo123`

**Usuário:**
- Email: `user@triagem.com`  
- Senha: `demo123`

**Recursos da Tela de Login:**
- ✅ Validação em tempo real com feedback visual
- ✅ Mensagens de erro claras e acionáveis
- ✅ Opção "Lembrar-me" que persiste o email
- ✅ Link para recuperação de senha
- ✅ Botão de demonstração para acesso rápido
- ✅ Design responsivo mobile-first
- ✅ Animações suaves com Motion
- ✅ Dark mode automático
- ✅ Implementa todas as 10 heurísticas de Nielsen

## ✨ Features

### 🏠 Dashboard
- KPIs em tempo real (documentos, pendências, prioridades)
- Gráficos interativos (documentos por dia, distribuição de score, tipos)
- Alertas críticos em destaque
- Ações rápidas

### 📤 Upload
- Drag & drop de múltiplos arquivos
- Integração com Google Drive e SharePoint (mock)
- Processamento OCR simulado (1.5-3s)
- Preview em batch com confidence score
- Ações: Reprocessar / Solicitar reenvio

### 📋 Inbox de Documentos
- Cards ordenados por score (Alto → Baixo)
- Busca semântica
- Filtros: tipo, score, confidence
- Filtros salvos
- Preview com resumo de 1-3 linhas

### 📄 Visualizador de Documentos com IA Avançada
- **Interface com Abas:**
  - **Visão Geral:** Texto com highlights + análise de risco
  - **Insights IA:** Cards com análises inteligentes da IA
  - **Campos:** Campos extraídos editáveis
  - **Histórico:** Auditoria completa e feedback

- **Análise de IA Avançada:**
  - 🎯 Identificação automática de riscos críticos
  - 🔍 Detecção de anomalias (temperatura, valores)
  - 📊 Predição de urgência baseada em histórico
  - 🤖 Classificação automática com confiança
  - 💡 Recomendações acionáveis
  - 📈 Score breakdown detalhado

- **Highlights Inteligentes:**
  - 🔴 Risco/Criticidade
  - 🔵 Equipamento identificado
  - 🟠 Datas e prazos
  - 🟢 Valores e métricas
  - Clique para navegar ao campo correspondente

- **Funcionalidades:**
  - Campos editáveis com validação
  - Resumo executivo gerado por IA
  - Explicabilidade do score (XAI)
  - Histórico de auditoria completo
  - Criação de tarefa com contexto
  - Feedback para melhoria da IA
  - Download e compartilhamento
  - Ações rápidas contextuais

### ✅ Tarefas
- Board Kanban (A fazer / Em andamento / Concluídas)
- Prioridade baseada em score do documento
- Vínculo com documento original
- Filtros por status e prioridade

### 📊 Monitoramento
- Status dos serviços em tempo real
- Métricas de performance
- Uso de recursos (CPU, memória, rede)

### ⚙️ Administração
- Configurações gerais
- Gerenciamento de usuários
- Chaves de API
- Segurança e compliance

### ❓ Ajuda
- Central de ajuda com busca
- FAQ completo
- Recursos e tutoriais
- Contato com suporte

### 📝 Logs
- Histórico completo do sistema
- Filtros por nível (info, warning, error)
- Busca e exportação

## 🎨 Design System

### Cores (Identidade Visual)

**Light Mode:**
```
Primary:     #005B8F
Primary-700: #00456D
Primary-300: #4FA3D9
Accent:      #FF8A00
Danger:      #D64545
Success:     #2ECC71
Warning:     #F6C85F
Background:  #F8FAFC
Surface:     #FFFFFF
Text:        #0F172A
Muted:       #64748B
```

**Dark Mode:**
```
Background:  #0B1220
Surface:     #0F1724
Text:        #E6EEF6
Muted:       #9AB0C9
Primary:     #4FA3D9
Accent:      #FFB16A
Danger:      #FF7B7B
Success:     #66D38B
```

### Tipografia
- Fonte: **Inter**
- H1: 28px / 36px / 700
- Body: 16px / 24px / 400
- Border-radius: 10px
- Spacing: múltiplos de 8px
- Shadow: 0 6px 18px rgba(15,23,42,0.06)

## 🗂️ Navegação

- **Menu lateral fixo:** ícone + label (8 páginas)
- **Topbar:** busca global + notificações (3) + avatar + theme toggle
- **Breadcrumbs:** em todas as páginas exceto dashboard
- **Mobile:** menu colapsável, single column, slide-overs

## 🌓 Dark Mode

- Toggle persistente no topbar (localStorage)
- Respeita `prefers-color-scheme`
- Transições suaves (200ms)
- Tokens CSS dedicados

## ♿ Acessibilidade (A11Y)

- ✅ Contraste ≥ 4.5:1
- ✅ Focus visível (outline 2px)
- ✅ Navegação por teclado (J/K, R, T)
- ✅ ARIA labels e live regions
- ✅ Respeita `prefers-reduced-motion`

## 🎯 Heurísticas de Nielsen

1. **Visibilidade do status:** Loading states, progress bars, toasts
2. **Linguagem do usuário:** Termos do setor (transformador, bomba)
3. **Controle do usuário:** Undo em 5s, campos editáveis
4. **Consistência:** Tokens CSS, componentes padronizados
5. **Prevenção de erros:** Validação, confirmações
6. **Reconhecimento vs memorização:** Breadcrumbs, filtros salvos
7. **Flexibilidade:** Atalhos de teclado, actions rápidas
8. **Design minimalista:** UI limpa, foco no conteúdo
9. **Recuperação de erros:** Reprocessar, solicitar reenvio
10. **Ajuda:** Central de ajuda, tooltips contextuais

## 📡 Mock APIs

### Documentos
```javascript
// Dados incluídos
const documents = [
  {
    id: "doc_001",
    title: "Inspeção transformador T123",
    type: "Relatório",
    ocr_confidence: 0.82,
    score: 0.95,
    summary: "Temperatura 120°C no transformador T123. Recomendado desligamento.",
    entities: { equipment: "T123", temperature: "120°C", date: "2025-09-20" }
  },
  {
    id: "doc_002",
    title: "Laudo vibração bomba B-45",
    type: "Laudo",
    ocr_confidence: 0.88,
    score: 0.72,
    summary: "Vibração 2.5 mm/s; possível desalinhamento.",
    entities: { equipment: "B-45", vibration: "2.5 mm/s" }
  },
  {
    id: "doc_003",
    title: "NF-2025-0045",
    type: "Nota Fiscal",
    ocr_confidence: 0.95,
    score: 0.15,
    summary: "NF valor R$14.500",
    entities: { value: "14500", supplier: "ABC" }
  },
  {
    id: "doc_004",
    title: "Foto painel - baixa qualidade",
    type: "Comunicação",
    ocr_confidence: 0.32,
    score: 0.50,
    summary: "Imagem com pouco contraste; OCR baixa confiança",
    entities: {}
  }
];
```

### Timings
- Upload: 0.5-1s por arquivo
- OCR: 1.5-3s por documento
- Task creation: 300-600ms
- Toasts: aparecem em 200ms, auto-dismiss em 4s

## 📂 Estrutura de Arquivos

```
/
├── App.tsx                      # Router + Main app
├── components/
│   ├── Layout.tsx               # Layout com sidebar + topbar
│   ├── pages/
│   │   ├── Dashboard.tsx        # / - Dashboard principal
│   │   ├── Upload.tsx           # /upload
│   │   ├── Documents.tsx        # /documents - Inbox
│   │   ├── DocumentViewer.tsx   # /documents/:id - Viewer
│   │   ├── Tasks.tsx            # /tasks
│   │   ├── Monitoring.tsx       # /monitoring
│   │   ├── Admin.tsx            # /admin
│   │   ├── Help.tsx             # /help
│   │   └── Logs.tsx             # /logs
│   └── ui/                      # ShadCN components
├── lib/
│   ├── mockApi.ts               # Mock API functions
│   └── theme.tsx                # Theme provider (dark mode)
├── styles/
│   └── globals.css              # Design tokens + base styles
├── STYLEGUIDE.md                # Design system documentation
└── README.md                    # This file
```

## 🚀 Getting Started

### Páginas Disponíveis

- **/** - Dashboard com KPIs e gráficos
- **/upload** - Upload de documentos
- **/documents** - Inbox ordenado por score
- **/documents/doc_001** - Visualizador de documentos
- **/tasks** - Gerenciamento de tarefas
- **/monitoring** - Status dos serviços
- **/admin** - Administração do sistema
- **/help** - Central de ajuda
- **/logs** - Logs do sistema

### Interações Críticas

#### Upload
1. Arraste arquivos ou conecte Drive/SharePoint
2. Visualize preview com OCR confidence
3. Documentos com baixa confiança mostram ações de reprocessamento

#### Inbox
1. Documentos ordenados por score (alto → baixo)
2. Use busca semântica
3. Aplique filtros ou use filtros salvos
4. Clique em "Revisar" para abrir documento

#### Visualizador
1. Texto à esquerda com highlights coloridos
2. Clique no highlight → scroll e foco no campo
3. Edite campos extraídos
4. Crie tarefa vinculada (modal slide-over)
5. Dê feedback (👍/👎)

#### Mobile
1. Menu colapsável (hamburguer)
2. Single column layout
3. Sticky actions na parte inferior
4. Slide-overs para modais

## 🎨 Microcopy (Literal)

- Upload: "Arraste arquivos aqui ou conecte seu Google Drive."
- OCR baixo: "OCR de baixa confiança. Reprocessar ou solicitar reenvio?"
- Card: "Transformador T123: temperatura 120°C (2025-09-20) — Recomendado desligamento."
- Task confirm: "Tarefa criada: Investigar T123 — alta temperatura. Ir para tarefa."
- Feedback: "Obrigado — seu feedback foi registrado."

## 📊 Critérios de Aceite

✅ Menu lateral + breadcrumbs em todas as telas  
✅ Inbox ordenado por score (Alto → Baixo)  
✅ Upload com batch preview + OCR quality  
✅ Viewer: highlights + campos editáveis + audit trail  
✅ Criar tarefa mock retorna link e anexa ao doc  
✅ Dark mode toggle persiste (localStorage)  
✅ Mobile-first responsive (single column)  
✅ Contraste ≥ 4.5, keyboard nav (J/K/R/T)  
✅ ARIA live para toasts  
✅ Respeita prefers-reduced-motion  

## 📚 Libraries Used

- **React** - UI framework
- **Tailwind CSS v4** - Styling
- **Recharts** - Charts and graphs
- **Lucide React** - Icons
- **ShadCN/UI** - Component library
- **Sonner** - Toast notifications

## 🎯 Use Cases

### Alta Prioridade (Score ≥ 70%)
1. Sistema detecta temperatura anômala (doc_001)
2. Alerta crítico aparece no dashboard
3. Usuário revisa documento no viewer
4. Highlights mostram palavras-chave de risco
5. Cria tarefa com prioridade alta automaticamente
6. Notifica responsável

### Baixa Confiança OCR (< 70%)
1. Upload detecta baixa confiança (doc_004)
2. Banner mostra opções: Reprocessar / Solicitar reenvio
3. Usuário escolhe reprocessar
4. Simula novo OCR (2-3s)
5. Confiança aumenta
6. Toast confirma sucesso

### Workflow Completo
1. Upload de documento
2. OCR automático
3. Score calculado pela IA
4. Documento aparece no Inbox (ordenado)
5. Usuário revisa e edita campos
6. Cria tarefa vinculada
7. Feedback positivo/negativo
8. Auditoria registrada

## 🔗 Links Úteis

- **Demo ao vivo:** [Este protótipo]
- **Style Guide:** STYLEGUIDE.md
- **Mock API:** lib/mockApi.ts

## 📝 License

Este é um protótipo de demonstração para Energia & Infra.

---

**Desenvolvido com ❤️ usando Figma Make**

**Versão:** 1.0.0  
**Data:** Setembro 2025