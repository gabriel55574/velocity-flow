---
description: > **Este documento define regras obrigatórias para qualquer AI que trabalhe neste projeto.**
---

# 🤖 Regras do Agente — Velocity Agency OS

> **Este documento define regras obrigatórias para qualquer AI que trabalhe neste projeto.**

---

## 🔧 Configuração do Projeto

### Supabase Project
| Chave | Valor |
|-------|-------|
| **Project ID** | `cuowpgsuaylnqntwnnur` |
| **URL** | `https://cuowpgsuaylnqntwnnur.supabase.co` |

> ⚠️ **IMPORTANTE:** Sempre use o project_id `cuowpgsuaylnqntwnnur` ao usar o Supabase MCP.

---

## 📋 Regras Essenciais

### 1. SEMPRE Use os MCPs Disponíveis

Antes de implementar qualquer feature, **consulte os MCPs**:

| MCP | Quando Usar |
|-----|-------------|
| **@Context7** | Documentação de bibliotecas (React, Tailwind, shadcn, etc.) |
| **@Supabase MCP** | Queries, schema, RLS, Edge Functions |
| **@shadcn** | Componentes UI, exemplos de uso, instalação |
| **@perplexity-ask** | Pesquisas web, soluções de problemas |
| **@sequential-thinking** | Problemas complexos que requerem análise |

```
Exemplo: Antes de criar um componente de Kanban, consulte:
- @Context7 para documentação do React DnD ou similar
- @shadcn para componentes relacionados (cards, drag-drop)
```

---

### 2. SEMPRE Consulte Estes Documentos ANTES de Implementar

| Documento | Obrigatório | Por quê |
|-----------|-------------|---------|
| `Docs/implementacao.md` | ✅ SIM | Entender arquitetura, padrões, estrutura atual |
| `Docs/pendencias_de_implementacao_velocity_agency_os_v2.md` | ✅ SIM | Ver o que ainda precisa ser feito |
| `Docs/prompt_inicial.md` | ⚠️ Se necessário | Especificação original do projeto |
| `src/data/mockData.ts` | ✅ SIM | Ver dados mock disponíveis |

**Ordem de leitura:**
1. `implementacao.md` — entender estado atual
2. `pendencias_v2.md` — ver prioridades
3. `mockData.ts` — ver dados disponíveis

---

### 3. SEMPRE Atualize Documentos com 100% de PRECISÃO

> ⚠️ **REGRA CRÍTICA:** Só marque como ✅ o que foi REALMENTE implementado. Verifique o código antes de atualizar.

| Documento | O que Atualizar | Regra |
|-----------|-----------------|-------|
| `pendencias_v2.md` | Marcar itens como `[x]` | **APENAS se 100% implementado** |
| `implementacao.md` | Changelog | **Listar EXATAMENTE o que foi criado** |

**Processo OBRIGATÓRIO antes de atualizar docs:**
1. Executar `list_dir` na pasta criada
2. Verificar CADA arquivo com `view_file_outline`
3. Comparar funcionalidades implementadas vs. requisitos do `pendencias_v2.md`
4. Só então atualizar documentação

**Formato de atualização do pendencias_v2.md:**
```markdown
- [x] Item implementado (100% completo)
- [/] Item parcialmente implementado (listar o que falta)
- [ ] Item não iniciado
```

**Formato de changelog em implementacao.md:**
```markdown
### DD mmm AAAA — Nome da Feature

**Arquivos criados:**
- `NomeArquivo.tsx` — Descrição do que FAZ (não só o nome)

**Funcionalidades implementadas:**
- ✅ Funcionalidade 1
- ✅ Funcionalidade 2

**Funcionalidades NÃO implementadas (pendentes):**
- ❌ Funcionalidade faltando
```

---

### 4. Fluxo de Trabalho Obrigatório

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. CONSULTAR                                                    │
│    - Ler implementacao.md                                       │
│    - Ler pendencias_v2.md                                       │
│    - Usar MCPs para documentação técnica                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. IMPLEMENTAR                                                  │
│    - Seguir padrões do implementacao.md                         │
│    - Usar mockData.ts para dados                                │
│    - Usar componentes shadcn existentes                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. ATUALIZAR DOCUMENTAÇÃO                                       │
│    - Adicionar changelog em implementacao.md                    │
│    - Marcar [x] concluído em pendencias_de_implementacao_velocity_agency_os_v2.md                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. TESTAR                                                       │
│    - Verificar se `npm run dev` funciona                        │
│    - Testar no browser se possível                              │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5. Regras de Código

#### ✅ FAÇA
- Use alias `@/` para imports
- Use componentes de `/src/components/ui/`
- Use dados de `/src/data/mockData.ts`
- Use Tailwind CSS para estilização
- Use TypeScript com tipagem correta
- Crie componentes reutilizáveis em `/src/components/`

#### ❌ NÃO FAÇA
- NÃO hardcode dados — use mockData
- NÃO instale dependências sem documentar
- NÃO crie CSS inline ou arquivos CSS separados
- NÃO ignore erros TypeScript
- NÃO altere estrutura sem atualizar docs

---

### 6. Onde Criar Novos Arquivos

| Tipo | Diretório | Exemplo |
|------|-----------|---------|
| Componente de Aba | `/src/components/workspace/` | `WorkflowTimeline.tsx` |
| Componente UI | `/src/components/ui/` | `kanban-board.tsx` |
| Componente Compartilhado | `/src/components/shared/` | `EmptyState.tsx` |
| Página | `/src/pages/` | `NewPage.tsx` |
| Hook | `/src/hooks/` | `use-workflows.ts` |
| Tipo/Interface | `/src/types/` | `workflow.ts` |

---

### 7. Checklist Antes de Finalizar

- [ ] Código compila sem erros (`npm run dev`)
- [ ] Responsivo (mobile + desktop)
- [ ] Usa dados mock existentes
- [ ] Segue padrões do Design System
- [ ] Changelog atualizado em `implementacao.md`
- [ ] Pendências atualizadas em `pendencias_v2.md`

---

### 8. Situações Especiais

#### Se precisar de um novo componente shadcn:
```bash
npx shadcn@latest add [nome-componente]
```
Depois, documentar em `implementacao.md`.

#### Se precisar instalar uma nova dependência:
1. Instalar: `npm install [pacote]`
2. Documentar em `implementacao.md` seção 1 (Stack)
3. Explicar o motivo da instalação

#### Se encontrar um erro ou inconsistência:
1. Documentar o problema
2. Propor solução
3. Perguntar ao usuário se necessário

---

## 📂 Mapa de Documentos

```
Docs/
├── implementacao.md         ← Guia técnico + changelog
├── pendencias_v2.md         ← Lista de pendências priorizadas
├── prompt_inicial.md        ← Especificação original
└── pendencias.md            ← (obsoleto, use v2)
```

---