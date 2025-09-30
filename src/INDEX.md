# 📑 Índice de Navegação - Triagem Inteligente

Este é o índice completo do projeto. Use os links abaixo para navegar pela documentação e pela aplicação.

## 🔐 ACESSO RÁPIDO

**Credenciais de Login:**
```
Email: admin@triagem.com
Senha: demo123
```
*Ou clique no botão "Usar credenciais de demonstração" na tela de login*

**Nova Documentação:**
- [LOGIN_GUIDE.md](LOGIN_GUIDE.md) - Guia completo de autenticação
- [CHANGELOG.md](CHANGELOG.md) - Histórico de mudanças v2.0

## 📚 Documentação

### Essenciais (Leia primeiro)
1. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** ⭐
   - Resumo executivo completo
   - Todas as entregas
   - Estatísticas do projeto
   - Critérios de aceite

2. **[QUICK_START.md](QUICK_START.md)** ⚡
   - Links rápidos para todas as páginas
   - Como testar funcionalidades
   - Fluxos completos de uso
   - Atalhos de teclado

3. **[README.md](README.md)** 📖
   - Overview do projeto
   - Features detalhadas
   - Dados mock
   - Use cases

### Referência Técnica
4. **[STYLEGUIDE.md](STYLEGUIDE.md)** 🎨
   - Design system completo
   - Tokens CSS (cores, tipografia)
   - Componentes e padrões
   - Acessibilidade
   - Heurísticas de Nielsen

5. **[API.md](API.md)** 📡
   - Documentação completa das Mock APIs
   - 8 endpoints detalhados
   - Request/Response formats
   - Timings e exemplos
   - Dados mock

6. **[DEPLOYMENT.md](DEPLOYMENT.md)** 🚀
   - Guia de entrega
   - Checklist de qualidade
   - Estrutura de arquivos
   - Métricas e testes

## 🔗 Links Rápidos da Aplicação

### Navegação Principal
- [**Dashboard**](/) - Visão geral (KPIs + gráficos)
- [**Upload**](/upload) - Enviar documentos
- [**Inbox**](/documents) - Lista de documentos
- [**Tarefas**](/tasks) - Board Kanban
- [**Monitoramento**](/monitoring) - Status dos serviços
- [**Administração**](/admin) - Configurações
- [**Ajuda**](/help) - Central de ajuda
- [**Logs**](/logs) - Histórico do sistema

### Documentos de Exemplo
- [**Doc 001**](/documents/doc_001) - ⚠️ Alta Prioridade (Score 95%)
  - Transformador T123 com temperatura 120°C
  - Recomendado desligamento imediato
  
- [**Doc 002**](/documents/doc_002) - ⚡ Prioridade Média (Score 72%)
  - Bomba B-45 com vibração 2.5 mm/s
  - Possível desalinhamento
  
- [**Doc 003**](/documents/doc_003) - ✅ Baixa Prioridade (Score 15%)
  - Nota Fiscal NF-2025-0045
  - Valor R$14.500
  
- [**Doc 004**](/documents/doc_004) - ⚠️ Baixa Confiança OCR (32%)
  - Foto de painel com baixa qualidade
  - Requer reprocessamento

## 📂 Estrutura de Arquivos

### Root Level
```
/
├── INDEX.md                   # Este arquivo (navegação)
├── PROJECT_SUMMARY.md         # Resumo executivo
├── README.md                  # Guia principal
├── QUICK_START.md            # Início rápido
├── STYLEGUIDE.md             # Design system
├── API.md                     # Documentação API
└── DEPLOYMENT.md             # Guia de deployment
```

### Aplicação
```
/
├── App.tsx                    # Router principal
├── components/
│   ├── Layout.tsx            # Layout master
│   ├── pages/                # 9 páginas
│   │   ├── Dashboard.tsx
│   │   ├── Upload.tsx
│   │   ├── Documents.tsx
│   │   ├── DocumentViewer.tsx
│   │   ├── Tasks.tsx
│   │   ├── Monitoring.tsx
│   │   ├── Admin.tsx
│   │   ├── Help.tsx
│   │   └── Logs.tsx
│   └── ui/                   # 40+ componentes ShadCN
├── lib/
│   ├── mockApi.ts            # Mock APIs (8 endpoints)
│   └── theme.tsx             # Theme provider (dark mode)
└── styles/
    └── globals.css           # Design tokens + base styles
```

## 🎯 Guias de Uso por Persona

### Para Product Managers
1. Comece com [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
2. Veja o [Dashboard](/) para visão geral
3. Teste o fluxo completo no [QUICK_START.md](QUICK_START.md)
4. Revise os critérios de aceite em [DEPLOYMENT.md](DEPLOYMENT.md)

### Para Designers
1. Leia o [STYLEGUIDE.md](STYLEGUIDE.md)
2. Explore todas as 9 páginas da aplicação
3. Toggle o Dark Mode no topbar
4. Teste responsividade em mobile

### Para Desenvolvedores
1. Comece com [README.md](README.md)
2. Consulte [API.md](API.md) para endpoints
3. Veja implementação em `/lib/mockApi.ts`
4. Revise componentes em `/components/pages/`

### Para QA/Testers
1. Use [QUICK_START.md](QUICK_START.md) para links
2. Siga os fluxos de teste
3. Verifique checklist em [DEPLOYMENT.md](DEPLOYMENT.md)
4. Teste acessibilidade (Tab, focus, screen readers)

### Para Stakeholders
1. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Visão executiva
2. [Dashboard](/) - Demo interativo
3. [Doc 001](/documents/doc_001) - Caso de uso crítico
4. Toggle Dark Mode para ver tema escuro

## 🔍 Busca Rápida

### Por Funcionalidade

**Upload de Documentos**
- Página: [/upload](/upload)
- Código: `/components/pages/Upload.tsx`
- Docs: [README.md](README.md#upload)

**Visualizador**
- Página: [/documents/doc_001](/documents/doc_001)
- Código: `/components/pages/DocumentViewer.tsx`
- Docs: [README.md](README.md#visualizador)

**Dark Mode**
- Toggle: Topbar (ícone sol/lua)
- Código: `/lib/theme.tsx`
- Docs: [STYLEGUIDE.md](STYLEGUIDE.md#dark-mode)

**Mock APIs**
- Código: `/lib/mockApi.ts`
- Docs: [API.md](API.md)

**Design Tokens**
- Código: `/styles/globals.css`
- Docs: [STYLEGUIDE.md](STYLEGUIDE.md#colors)

### Por Conceito

**Acessibilidade**
- [STYLEGUIDE.md > Acessibilidade](STYLEGUIDE.md#acessibilidade)
- [DEPLOYMENT.md > A11Y](DEPLOYMENT.md#acessibilidade)

**Heurísticas de Nielsen**
- [STYLEGUIDE.md > Nielsen](STYLEGUIDE.md#heurísticas-nielsen)
- [PROJECT_SUMMARY.md > Nielsen](PROJECT_SUMMARY.md#heurísticas-nielsen)

**Responsividade**
- [STYLEGUIDE.md > Breakpoints](STYLEGUIDE.md#breakpoints)
- [PROJECT_SUMMARY.md > Responsividade](PROJECT_SUMMARY.md#responsividade)

**Componentes**
- Lista completa: [README.md > Componentes](README.md#componentes)
- Código: `/components/ui/`

## 📊 Recursos por Categoria

### Design
- [STYLEGUIDE.md](STYLEGUIDE.md) - Design system
- `/styles/globals.css` - CSS tokens
- [Figma (não disponível)] - Mockups originais

### Desenvolvimento
- [API.md](API.md) - API documentation
- `/lib/mockApi.ts` - Mock APIs
- `/components/` - Componentes React

### Testes
- [DEPLOYMENT.md > Checklist](DEPLOYMENT.md#checklist)
- [QUICK_START.md > Testando](QUICK_START.md#testando)

### Documentação
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Resumo
- [README.md](README.md) - Guia principal
- [QUICK_START.md](QUICK_START.md) - Início rápido

## 🎓 Learning Path

### Novo no Projeto?
1. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) (5 min)
2. [QUICK_START.md](QUICK_START.md) (10 min)
3. Explore a aplicação (20 min)
4. [README.md](README.md) para detalhes (15 min)

### Quer Implementar?
1. [API.md](API.md) - Entenda os endpoints
2. [STYLEGUIDE.md](STYLEGUIDE.md) - Design system
3. Revise código em `/components/`
4. [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment

### Precisa Apresentar?
1. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Slides
2. [Dashboard](/) - Demo ao vivo
3. [Doc 001](/documents/doc_001) - Caso de uso
4. Toggle Dark Mode - Wow factor

## 💡 Tips

### Navegação
- Use os links do menu lateral (8 itens)
- Breadcrumbs mostram onde você está
- Clique no logo para voltar ao Dashboard

### Temas
- Toggle Dark Mode: Ícone sol/lua no topbar
- Tema persiste entre sessões
- Experimente em diferentes horários

### Mobile
- Redimensione o navegador para < 768px
- Menu vira hamburguer
- Layout muda para single column

### Dados
- 4 documentos mock pré-carregados
- 2 tarefas de exemplo
- Todos os dados em `/lib/mockApi.ts`

## 📞 Precisa de Ajuda?

### Durante Uso
- Acesse [/help](/help) - Central de ajuda
- FAQ com 6 perguntas comuns
- Contato com suporte

### Durante Desenvolvimento
- Consulte [API.md](API.md) para endpoints
- Veja [STYLEGUIDE.md](STYLEGUIDE.md) para padrões
- Revise código em `/components/`

### Durante Apresentação
- Use [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) como script
- Links rápidos em [QUICK_START.md](QUICK_START.md)
- Stats em [DEPLOYMENT.md](DEPLOYMENT.md)

## ✅ Checklist Rápido

Ao apresentar/testar o protótipo, certifique-se de mostrar:

- [ ] Dashboard com KPIs e gráficos
- [ ] Upload com drag & drop
- [ ] Inbox ordenado por score
- [ ] Doc_001 (alta prioridade) no Viewer
- [ ] Highlights coloridos no texto
- [ ] Campos editáveis
- [ ] Criar tarefa (modal slide-over)
- [ ] Board de tarefas
- [ ] Dark mode toggle (persiste!)
- [ ] Responsividade mobile
- [ ] Toasts de notificação

## 🎉 Pronto!

Você agora tem acesso completo a:
- ✅ **9 páginas** funcionais
- ✅ **6 documentos** de documentação
- ✅ **40+ componentes** UI
- ✅ **8 endpoints** Mock API
- ✅ **100% funcional** e navegável

**Comece pelo [Dashboard](/) ou [QUICK_START.md](QUICK_START.md)**

---

**Versão:** 2.0.0  
**Última Atualização:** Setembro 30, 2025  
**Projeto:** Triagem Inteligente - Energia & Infra  
**Status:** ✅ Completo + Login + IA Avançada

**Desenvolvido com ❤️ usando Figma Make**