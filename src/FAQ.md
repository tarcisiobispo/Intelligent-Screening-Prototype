# ❓ Perguntas Frequentes (FAQ)

## 🔐 Autenticação e Acesso

### Como faço login no sistema?
Use as credenciais de demonstração:
- **Email:** `admin@triagem.com`
- **Senha:** `demo123`

Ou clique no botão **"Usar credenciais de demonstração"** na tela de login.

### Esqueci minha senha. O que faço?
No protótipo, clique em "Esqueceu a senha?" para ver a mensagem informativa. Em produção, um email seria enviado com instruções de recuperação.

### Por que não consigo acessar o sistema sem fazer login?
A partir da versão 2.0, todas as rotas são protegidas por autenticação. Isso garante segurança e simula o comportamento de um sistema em produção.

### O que acontece se eu fechar o navegador?
Se você marcou a opção "Lembrar-me", sua sessão permanecerá ativa. Caso contrário, precisará fazer login novamente.

### Posso criar novas contas?
No protótipo atual, não há funcionalidade de registro. Use as credenciais de demonstração fornecidas.

---

## 🤖 Análise de IA e Documentos

### O que são os "Insights IA"?
São análises inteligentes geradas automaticamente para cada documento. Incluem:
1. Identificação de riscos críticos
2. Reconhecimento de padrões
3. Detecção de anomalias
4. Avaliação de confiança OCR
5. Predição de urgência
6. Classificação automática

### Como a IA calcula o score de risco?
O score é calculado com base em:
- Palavras-chave críticas detectadas
- Tipo de equipamento
- Valores fora do padrão
- Contexto do documento
- Histórico de ocorrências similares

Scores acima de 70% indicam alta prioridade.

### O que significa "confiança" nos insights?
É o nível de certeza da IA sobre aquela análise, expresso em porcentagem (0-100%). Quanto maior, mais confiável é o insight.

### Como funcionam os highlights coloridos?
Cada cor representa um tipo de informação:
- 🔴 **Vermelho:** Risco/Criticidade
- 🔵 **Azul:** Equipamento
- 🟠 **Laranja:** Data/Prazo
- 🟢 **Verde:** Valor/Métrica

Clique em um highlight para navegar automaticamente até o campo correspondente.

### Posso editar os campos extraídos?
Sim! Vá para a aba "Campos" no DocumentViewer e edite qualquer campo. Clique em "Salvar Alterações" para persistir.

### O que é OCR e por que importa?
OCR (Optical Character Recognition) é a tecnologia que converte imagens de texto em texto editável. A confiança do OCR indica quão precisa foi a extração. Valores abaixo de 85% podem requerer revisão manual.

---

## 📱 Interface e Navegação

### Como navego entre as páginas?
Use o menu lateral (desktop) ou o menu hambúrguer (mobile). Você também pode:
- Clicar em links e botões
- Usar os breadcrumbs
- Clicar no logo para voltar ao Dashboard

### O que são as abas no DocumentViewer?
As abas organizam as informações do documento:
- **Visão Geral:** Texto e análise principal
- **Insights IA:** Análises inteligentes detalhadas
- **Campos:** Campos extraídos editáveis
- **Histórico:** Auditoria e feedback

### Como uso a busca no header?
Digite sua consulta na barra de busca e pressione **Enter**. A busca é semântica e entende contexto (ex: "temperatura alta" encontra documentos relacionados).

### O que fazer quando algo está carregando?
Os loading states (skeletons, spinners) indicam que o sistema está processando. Aguarde alguns segundos. Timings típicos:
- Busca: 200-400ms
- Upload: 500-1000ms por arquivo
- OCR: 1.5-3s
- Criação de tarefa: 300-600ms

### Como ativo o Dark Mode?
Clique no ícone de sol/lua no canto superior direito do header. Sua preferência será salva automaticamente.

### O sistema funciona em mobile?
Sim! O design é mobile-first e totalmente responsivo. Teste redimensionando o navegador ou acessando de um dispositivo móvel.

---

## 📋 Documentos e Tarefas

### Como faço upload de documentos?
1. Vá para **Menu → Upload**
2. Arraste arquivos para a área de drop ou clique para selecionar
3. Aguarde o processamento OCR
4. Revise os resultados
5. Clique em "Ver Documento" para análise detalhada

### Como sei quais documentos são prioritários?
Os documentos são automaticamente ordenados por score de risco (alto → baixo). Documentos com score ≥ 70% são alta prioridade.

### Como crio uma tarefa vinculada a um documento?
1. Abra o documento no DocumentViewer
2. Clique em **"Criar Tarefa"**
3. Preencha o formulário (já vem pré-preenchido com contexto do documento)
4. Clique em "Criar Tarefa"
5. A tarefa aparecerá no Board de Tarefas

### Posso mover tarefas no Kanban?
Sim! Na página de Tarefas, arraste os cards entre as colunas:
- A fazer
- Em andamento
- Concluídas

### Como filtro documentos?
Na página de Documentos (Inbox), use:
- **Busca:** Digite palavras-chave
- **Filtro de Tipo:** Relatório, Laudo, etc.
- **Filtro de Score:** Alto, Médio, Baixo
- **Filtros Salvos:** Pré-configurados para consultas comuns

---

## 🎨 Design e Personalização

### Posso mudar as cores do sistema?
No protótipo, as cores seguem o design system definido. Para mudanças, edite os tokens CSS em `/styles/globals.css`.

### O Dark Mode muda todas as cores?
Sim! O sistema possui paletas completas para light e dark mode, garantindo contraste adequado em ambos os temas.

### Por que alguns textos estão em tamanhos diferentes?
O sistema usa uma escala tipográfica consistente (16-28px) baseada na hierarquia de informação. Títulos são maiores, corpo de texto é 16px.

### Como sei que um elemento é clicável?
Elementos clicáveis têm:
- Cursor pointer (🖱️)
- Hover states (mudança de cor/sombra)
- Indicadores visuais (setas, ícones)
- Underline em links

---

## 🔧 Técnico e Desenvolvimento

### É um sistema real ou protótipo?
É um **protótipo navegável** totalmente funcional, mas usa Mock APIs (dados simulados). Para produção, seria necessário implementar backend real.

### Quais tecnologias são usadas?
- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS v4
- **Componentes:** shadcn/ui
- **Ícones:** Lucide React
- **Gráficos:** Recharts
- **Animações:** Motion/React

### Os dados são reais?
Não. O sistema usa dados mock (simulados) para demonstração. Todos os documentos, tarefas e métricas são exemplos fictícios.

### Como os timings são simulados?
As Mock APIs incluem delays aleatórios para simular latência de rede real:
- Upload: 500-1000ms/arquivo
- OCR: 1500-3000ms
- Busca: 200-400ms
- Criação de tarefa: 300-600ms

### Posso usar este código em produção?
O protótipo serve como **base sólida** para um MVP, mas requer:
- Backend real com API RESTful
- Banco de dados
- Autenticação robusta (OAuth2/JWT)
- OCR vendor integration (Google Vision, AWS Textract)
- Modelo de ML para classificação

### Onde está o código-fonte?
Todos os arquivos estão disponíveis na estrutura do projeto:
- `/components/` - Componentes React
- `/lib/` - Lógica e APIs
- `/styles/` - CSS e tokens
- Documentação completa em `/`

---

## 📊 Métricas e Performance

### Quanto tempo leva para processar um documento?
No protótipo:
- Upload: 0.5-1s por arquivo
- OCR: 1.5-3s
- Análise de IA: instantâneo (pré-calculado)

Em produção, dependerá do tamanho do arquivo e vendor de OCR escolhido.

### Quantos documentos posso processar simultaneamente?
O protótipo suporta upload em batch (múltiplos arquivos). Em produção, o limite dependeria da infraestrutura.

### Como são calculadas as métricas do Dashboard?
As métricas são agregadas dos dados mock:
- Total de documentos
- Pendentes (status = "pending")
- Alta prioridade (score ≥ 70%)
- Baixa confiança OCR (< 70%)
- Tarefas abertas (status ≠ "done")

---

## ♿ Acessibilidade

### O sistema é acessível?
Sim! Implementa:
- Navegação por teclado (Tab, Shift+Tab)
- ARIA labels em elementos interativos
- Contraste WCAG 2.1 AA (≥ 4.5:1)
- Focus visível em todos os elementos
- Suporte a leitores de tela
- Respeito a `prefers-reduced-motion`

### Como navego apenas com o teclado?
- **Tab:** Próximo elemento
- **Shift+Tab:** Elemento anterior
- **Enter:** Ativar botão/link
- **Esc:** Fechar modal
- **Setas:** Navegação em dropdowns

### O sistema funciona com leitores de tela?
Sim! Todos os elementos têm ARIA labels apropriados e semântica HTML correta.

---

## 🐛 Troubleshooting

### O login não está funcionando
Verifique:
1. Email contém `@`
2. Senha tem pelo menos 6 caracteres
3. Credenciais corretas: `admin@triagem.com` / `demo123`
4. Tente o botão "Demonstração"

### A página está carregando infinitamente
- Aguarde 3-5 segundos (timings de mock API)
- Recarregue a página (F5)
- Limpe o cache do navegador

### Dark Mode não persiste
- Verifique se cookies/localStorage estão habilitados
- Teste em modo anônimo
- Limpe o cache e tente novamente

### Notificações não aparecem
- Verifique se está bloqueando toasts/popups
- Teste em outro navegador
- Confira o console para erros

### Layout quebrado no mobile
- Force refresh (Ctrl+F5)
- Limpe o cache
- Teste em modo device (DevTools F12 → Toggle Device)

---

## 📱 Mobile

### Quais gestos funcionam no mobile?
- **Swipe:** Fechar sidebar
- **Tap:** Click/ativação
- **Long press:** Menu contextual (em alguns elementos)
- **Scroll:** Vertical nas páginas

### Por que alguns elementos são diferentes no mobile?
O design mobile-first prioriza usabilidade em telas pequenas:
- Menu vira hambúrguer
- Cards em coluna única
- Botões maiores (44x44px)
- Ações fixas na parte inferior

---

## 🔮 Futuro e Roadmap

### Quais recursos virão a seguir?
Sugestões incluem:
- Sistema de notificações push
- Chat/comentários em documentos
- Exportação de relatórios (PDF/Excel)
- Dashboard personalizável
- Integração com ERP/SAP
- Mobile app nativo

### Quando terá backend real?
O protótipo atual usa Mock APIs. Para MVP de produção, backend seria implementado em 4-8 semanas (estimativa).

### Posso sugerir melhorias?
Sim! Use o sistema de feedback dentro da aplicação ou entre em contato com a equipe.

---

## 📞 Suporte

### Onde encontro mais informação?

**Documentação:**
- [README.md](README.md) - Guia principal
- [LOGIN_GUIDE.md](LOGIN_GUIDE.md) - Autenticação
- [QUICK_START.md](QUICK_START.md) - Início rápido
- [STYLEGUIDE.md](STYLEGUIDE.md) - Design system
- [API.md](API.md) - APIs
- [CHANGELOG.md](CHANGELOG.md) - Mudanças
- [WHATS_NEW.md](WHATS_NEW.md) - Novidades v2.0

**Dentro do Sistema:**
- Menu → Ajuda (FAQ e recursos)
- Menu → Logs (debugging)

**Contato:**
- Para dúvidas técnicas, consulte a documentação
- Para bugs, verifique o console (F12)
- Para sugestões, use o feedback no sistema

---

## ✅ Checklist de Primeiros Passos

Para novos usuários:

- [ ] Fazer login com credenciais de demo
- [ ] Explorar o Dashboard
- [ ] Testar Dark Mode
- [ ] Ver um documento de alta prioridade (doc_001)
- [ ] Navegar pelas abas do DocumentViewer
- [ ] Explorar os Insights IA
- [ ] Criar uma tarefa
- [ ] Ver o Board de Tarefas
- [ ] Testar a busca no header
- [ ] Fazer logout

---

**Ainda tem dúvidas?**

Consulte:
- [Central de Ajuda](/help) dentro do sistema
- [Documentação completa](INDEX.md)
- Console do navegador (F12) para erros técnicos

**Versão FAQ:** 1.0  
**Última Atualização:** Setembro 30, 2025  
**Perguntas:** 50+  
**Categorias:** 10  

---

**Protótipo pronto para uso! 🚀**