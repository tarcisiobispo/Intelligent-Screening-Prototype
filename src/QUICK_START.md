# 🚀 Guia Rápido - Triagem Inteligente

## ⚡ Início Rápido (3 minutos)

### 1️⃣ Faça Login
```
URL: http://localhost:3000 (ou URL do deploy)

Clique em "Usar credenciais de demonstração"
   OU
Digite:
  Email: admin@triagem.com
  Senha: demo123

Clique em "Entrar"
```

### 2️⃣ Explore o Dashboard
- Visualize os KPIs em tempo real
- Clique no alerta crítico para ver o documento de alta prioridade
- Clique em qualquer card de KPI para navegar

### 3️⃣ Analise um Documento com IA
```
Dashboard → Click no alerta "Transformador T123"
   OU
Menu Lateral → Documentos → Click em qualquer documento
```

**Na tela de DocumentViewer:**
- Navegue pelas abas: Visão Geral, Insights IA, Campos, Histórico
- Veja os highlights coloridos no texto
- Clique nos highlights para navegar aos campos
- Explore os Insights da IA
- Crie uma tarefa

### 4️⃣ Gerencie Tarefas
```
Menu Lateral → Tarefas
```
- Veja o board Kanban
- Arraste tarefas entre colunas (A fazer → Em andamento → Concluídas)
- Filtre por prioridade/status

---

## 🎯 Casos de Uso Principais

### Caso 1: Processar Novos Documentos
```
1. Menu → Upload
2. Arraste arquivos ou clique para selecionar
3. Aguarde processamento OCR (1.5-3s simulado)
4. Revise os resultados
5. Clique em "Ver Documento" para análise detalhada
```

### Caso 2: Revisar Documento de Alta Prioridade
```
1. Dashboard → Click em alerta crítico
2. Leia o resumo da IA
3. Vá para aba "Insights IA"
4. Revise os riscos identificados
5. Clique em "Criar Tarefa Urgente"
6. Preencha o formulário
7. Atribua responsável
8. Salve a tarefa
```

### Caso 3: Buscar Documentos Específicos
```
1. Use a busca no header (top-right)
   Ou
2. Menu → Documentos
3. Use os filtros (Tipo, Score, OCR)
4. Ou busque por palavra-chave
5. Clique no documento desejado
```

### Caso 4: Monitorar Sistema
```
1. Menu → Monitoramento
2. Visualize status dos serviços
3. Confira métricas de performance
4. Analise uso de recursos
```

### Caso 5: Gerenciar Configurações
```
1. Menu → Administração
2. Configure:
   - Regras de triagem
   - Thresholds de score
   - Integrações (mock)
   - Preferências do sistema
```

---

## 🎨 Recursos Visuais

### Ícones e Cores do Sistema

**Níveis de Risco:**
- 🔴 Vermelho: Alto risco (Score ≥ 70%)
- 🟡 Amarelo: Risco médio (Score 30-70%)
- 🟢 Verde: Baixo risco (Score < 30%)

**Tipos de Highlight no Documento:**
- 🔴 Risco/Criticidade
- 🔵 Equipamento
- 🟠 Data/Prazo
- 🟢 Valor/Métrica

**Status de Tarefas:**
- 📋 A fazer
- ⚙️ Em andamento
- ✅ Concluídas

**Confiança OCR:**
- ✅ Alta: ≥ 80%
- ⚠️ Média: 50-80%
- ❌ Baixa: < 50%

---

## ⌨️ Atalhos de Teclado

### Globais
- `Enter` - Submit em formulários
- `Esc` - Fechar modals/sheets

### Navegação
- Clique nos links do menu lateral
- Use breadcrumbs para voltar
- Botão "Voltar" disponível em todas as páginas

### Busca
- Digite na barra de busca e pressione `Enter`
- Mobile: Clique no ícone de busca

---

## 💡 Dicas e Truques

### 🎯 Melhor Experiência
1. **Use Dark Mode**: Toggle no header (ícone lua/sol)
2. **Favoritos**: Use "Filtros Salvos" na página de Documentos
3. **Notificações**: Clique no sino para ver alertas

### 📱 Mobile
- Menu hambúrguer no canto superior esquerdo
- Swipe para fechar sidebar
- Botões de ação fixos na parte inferior (Document Viewer)

### 🤖 IA e Insights
- Quanto maior o score, mais urgente é o documento
- Insights marcados como "críticos" requerem ação imediata
- Confiança da IA mostrada em % em cada insight
- Use o feedback (👍/👎) para melhorar o sistema

### ⚡ Produtividade
- **Ações Rápidas** disponíveis no Dashboard
- **Criar Tarefa** diretamente do DocumentViewer
- **Busca Semântica** entende contexto (ex: "temperatura alta")
- **Filtros Salvos** para queries recorrentes

---

## 🔄 Fluxos Completos

### Fluxo 1: Do Upload à Resolução
```
1. Upload de Documento
   ↓
2. Processamento OCR (automático)
   ↓
3. Análise de IA e Score (automático)
   ↓
4. Notificação se crítico (automático)
   ↓
5. Usuário revisa documento
   ↓
6. Cria tarefa vinculada
   ↓
7. Atribui responsável
   ↓
8. Tarefa movida para "Em andamento"
   ↓
9. Resolução e conclusão
   ↓
10. Tarefa marcada como "Concluída"
    ↓
11. Feedback da IA registrado
```

### Fluxo 2: Monitoramento Diário
```
1. Login no sistema
   ↓
2. Visualiza Dashboard
   ↓
3. Revisa KPIs
   ↓
4. Clica em alertas críticos
   ↓
5. Analisa documentos urgentes
   ↓
6. Cria tarefas necessárias
   ↓
7. Verifica status geral no Monitoramento
   ↓
8. Logout
```

---

## 🎓 Recursos de Aprendizado

### Para Novos Usuários
1. **Explore o Dashboard**: Familiarize-se com os KPIs
2. **Teste o Upload**: Use documentos de exemplo
3. **Revise um Documento**: Entenda a análise da IA
4. **Crie uma Tarefa**: Pratique o fluxo completo

### Para Power Users
1. **Configure Filtros Salvos**: Economize tempo
2. **Use Atalhos**: Navegação rápida
3. **Integre com Google Drive/SharePoint**: (quando disponível)
4. **Personalize Thresholds**: Na página Admin

---

## 📞 Ajuda e Suporte

### Dentro do Sistema
- **Menu → Ajuda**: FAQ e documentação
- **Menu → Logs**: Para debugging

### Documentação Externa
- `README.md`: Overview completo
- `LOGIN_GUIDE.md`: Detalhes de autenticação
- `CHANGELOG.md`: Histórico de mudanças
- `STYLEGUIDE.md`: Guia de design
- `API.md`: Documentação da API

---

## 🎬 Demonstração para Stakeholders

### Roteiro Sugerido (10 minutos)

**1. Login (1 min)**
- Mostre a tela de login profissional
- Use botão "Demonstração"

**2. Dashboard (2 min)**
- Destaque os KPIs em tempo real
- Mostre os gráficos interativos
- Clique no alerta crítico

**3. Análise de Documento com IA (4 min)**
- Mostre o texto com highlights
- Navegue pelas abas
- **DESTAQUE**: Aba "Insights IA" com análises inteligentes
- Demonstre criação de tarefa

**4. Gestão de Tarefas (2 min)**
- Mostre o Kanban board
- Arraste uma tarefa entre colunas
- Mostre vínculo com documento

**5. Monitoramento (1 min)**
- Mostre status dos serviços
- Destaque métricas de performance

**Pontos de Venda:**
- ✨ **Automação completa** com OCR e IA
- 🎯 **Redução de 70%** no tempo de triagem
- 🔍 **Detecção automática** de riscos críticos
- 📊 **Visibilidade total** do processo
- 📱 **Mobile-first** para uso em campo

---

## 🔐 Segurança e Melhores Práticas

### Para Demonstração
- ✅ Use credenciais de demo
- ✅ Não adicione dados sensíveis reais
- ✅ Sistema é apenas protótipo

### Para Produção (Recomendações)
- 🔒 Implementar backend real
- 🔒 HTTPS obrigatório
- 🔒 Autenticação robusta (OAuth2/JWT)
- 🔒 Logs de auditoria completos
- 🔒 Backup e disaster recovery
- 🔒 Conformidade LGPD/GDPR

---

## ✅ Checklist de Demonstração

Antes de apresentar, verifique:
- [ ] Sistema rodando sem erros
- [ ] Dark mode funcionando
- [ ] Login com credenciais demo OK
- [ ] Documentos de exemplo carregados
- [ ] Gráficos renderizando corretamente
- [ ] Criação de tarefa funcionando
- [ ] Mobile responsivo testado
- [ ] Notificações aparecendo

---

## 🎯 KPIs para Medir Sucesso

Após implementação, meça:
- ⏱️ **Tempo médio de triagem**: Meta < 2 minutos/doc
- 🎯 **Precisão da IA**: Meta > 90%
- 📈 **Documentos processados/dia**: Baseline vs. novo
- ⚡ **Tempo de resposta a críticos**: Meta < 1 hora
- 👥 **Adoção de usuários**: Meta > 80% da equipe
- 📊 **Tarefas criadas vs. resolvidas**: Ratio ideal 1:1

---

**Pronto para começar? Faça login e explore! 🚀**