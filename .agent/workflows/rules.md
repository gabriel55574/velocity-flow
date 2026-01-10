---
description: > **Este documento define regras obrigatórias para qualquer AI que trabalhe neste projeto.**
---

## 🔧 Configuração do Projeto

### Supabase Project
| Chave | Valor |
|-------|-------|
| **Project ID** | `cuowpgsuaylnqntwnnur` |
| **URL** | `https://cuowpgsuaylnqntwnnur.supabase.co` |
| **Region** | `us-east-2` |

> ⚠️ **IMPORTANTE:** Sempre use o project_id `cuowpgsuaylnqntwnnur` ao usar o Supabase MCP.

### Variáveis de Ambiente
```bash
VITE_SUPABASE_URL=https://cuowpgsuaylnqntwnnur.supabase.co
VITE_SUPABASE_ANON_KEY=<ver .env.local>
```

### Mapa Completo de Documentação

```
Docs/
├── velocity_agency_os_PDR_v1_0.md    # PDR - FONTE DE VERDADE
├── epics_and_user_stories.md         # Backlog com User Stories
├── conferencia.md                    # Análise de gaps
├── implementacao.md                  # Guia técnico detalhado
├── pendencias_...v2.md               # Pendências + código de referência
├── walkthrough.md                    # Histórico de implementação
├── AGENT_RULES.md                    # ESTE DOCUMENTO
├── prompt_inicial.md                 # Especificação original (legacy)
└── epic-kickoff-ui-overhaul.md       # Epic de UI (concluído)
```

---

## 🛠️ MCPs Disponíveis

### SEMPRE Use Antes de Implementar

| MCP | Quando Usar | Exemplo |
|-----|-------------|---------|
| **@Context7** | Documentação de bibliotecas | React, TanStack Query, Supabase Client |
| **@Supabase MCP** | Queries, schema, migrations, RLS | Criar tabela, rodar query |
| **@shadcn** | Componentes UI, exemplos | Adicionar componente, ver demo |
| **@perplexity-ask** | Pesquisas web, soluções | Resolver bug, melhores práticas |
| **@sequential-thinking** | Problemas complexos | Arquitetura, decisões técnicas |

```
Exemplo de uso antes de implementar CRUD:
1. @Context7 → documentação TanStack Query (mutations)
2. @Supabase MCP → verificar schema da tabela
3. @shadcn → ver exemplo de form/dialog
```


## 📝 Regras de Implementação

### 1. Fluxo Obrigatório

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. CONSULTAR DOCUMENTAÇÃO                                       │
│    - Ler PDR para entender o requisito                          │
│    - Ver epics_and_user_stories.md para User Story              │
│    - Ver pendencias_v2.md para código de referência             │
│    - Consultar MCPs para documentação técnica                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. IMPLEMENTAR                                                  │
│    - Seguir padrões do implementacao.md                         │
│    - Usar hooks Supabase (ou criar se não existir)              │
│    - Usar componentes shadcn existentes                         │
│    - Tipar tudo com TypeScript                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. TESTAR                                                       │
│    - Verificar se `npm run dev` funciona                        │
│    - Testar no browser se possível                              │
│    - Verificar console por erros                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. ATUALIZAR DOCUMENTAÇÃO                                       │
│    - Adicionar entrada em walkthrough.md                        │
│    - Marcar [x] em epics_and_user_stories.md                    │
│    - Atualizar changelog em implementacao.md                    │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Regras de Código

#### ✅ SEMPRE FAÇA

```typescript
// 1. Use alias @/ para imports
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useClients } from "@/hooks/useClients";

// 2. Use tipos do database.ts
import type { Database } from "@/types/database";
type Client = Database['public']['Tables']['clients']['Row'];

// 3. Use TanStack Query para dados
const { data, isLoading, error } = useClients();

// 4. Use componentes shadcn existentes
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

// 5. Use Tailwind para estilização
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

#### ❌ NUNCA FAÇA

```typescript
// 1. NÃO hardcode dados
const clients = [{ id: '1', name: 'Test' }]; // ❌ ERRADO
const { data: clients } = useClients(); // ✅ CERTO

// 2. NÃO use CSS inline
<div style={{ display: 'flex' }}> // ❌ ERRADO
<div className="flex"> // ✅ CERTO

// 3. NÃO ignore tipos TypeScript
const data: any = await fetch(); // ❌ ERRADO

// 4. NÃO crie arquivos de tipos avulsos
// Todos os tipos do DB vêm de src/types/database.ts
```

### 3. Estrutura de Pastas

| Tipo | Diretório | Exemplo |
|------|-----------|---------|
| **Hooks Supabase** | `/src/hooks/` | `useClients.ts`, `useTasks.ts` |
| **Componente de Aba** | `/src/components/workspace/` | `CRMTab.tsx` |
| **Dialog/Modal** | `/src/components/{domínio}/` | `CreateClientDialog.tsx` |
| **Componente UI** | `/src/components/ui/` | `glass-card.tsx` |
| **Página** | `/src/pages/` | `Clients.tsx` |
| **Tipo/Interface** | `/src/types/` | Usar `database.ts` |
| **Utilitário** | `/src/lib/` | `workflowEngine.ts` |

---

## 🔄 Template de Hook CRUD

Ao criar um novo hook, siga este template:

```typescript
// src/hooks/useXxx.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Xxx = Database['public']['Tables']['xxx']['Row'];
type XxxInsert = Database['public']['Tables']['xxx']['Insert'];
type XxxUpdate = Database['public']['Tables']['xxx']['Update'];

// LIST
export function useXxxs(filters?: { field?: string }) {
  return useQuery({
    queryKey: ['xxxs', filters],
    queryFn: async () => {
      let query = supabase.from('xxx').select('*');
      if (filters?.field) query = query.eq('field', filters.field);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}

// GET BY ID
export function useXxx(id: string) {
  return useQuery({
    queryKey: ['xxxs', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('xxx')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
}

// CREATE
export function useCreateXxx() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: XxxInsert) => {
      const { data, error } = await supabase
        .from('xxx')
        .insert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['xxxs'] });
    }
  });
}

// UPDATE
export function useUpdateXxx() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: XxxUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('xxx')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['xxxs'] });
      queryClient.invalidateQueries({ queryKey: ['xxxs', data.id] });
    }
  });
}

// DELETE
export function useDeleteXxx() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('xxx').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['xxxs'] });
    }
  });
}
```

---

## ✅ Checklist Antes de Finalizar

### Para Cada Feature

- [ ] Código compila sem erros (`npm run dev`)
- [ ] TypeScript sem erros
- [ ] Responsivo (mobile + desktop)
- [ ] Usa hooks Supabase (não mockData)
- [ ] Loading states implementados
- [ ] Error states implementados
- [ ] Empty states implementados

### Para Documentação

- [ ] Entrada adicionada em `walkthrough.md`
- [ ] User Story marcada em `epics_and_user_stories.md`
- [ ] Changelog atualizado em `implementacao.md`

---

## 🆘 Situações Especiais

### Se precisar de um novo componente shadcn:
```bash
npx shadcn@latest add [nome-componente]
```
Depois, documentar em `implementacao.md`.

### Se precisar de uma nova tabela:
```sql
-- Criar migration em supabase/migrations/
-- Usar Supabase MCP para aplicar
-- Atualizar src/types/database.ts
```

### Se precisar configurar Supabase Storage:
```
1. Criar bucket no Supabase Dashboard
2. Configurar policies do bucket
3. Documentar em implementacao.md
```

### Se encontrar um erro ou inconsistência:
1. Documentar o problema em walkthrough.md
2. Propor solução
3. Perguntar ao usuário se necessário


---

## 📁 Arquivos Principais do Projeto

```
velocity-flow/
├── src/
│   ├── lib/supabase.ts          # Cliente Supabase tipado
│   ├── types/database.ts        # Tipos TypeScript do DB
│   ├── data/mockData.ts         # ⚠️ Dados mock (migrar para hooks)
│   ├── hooks/                   # ⚠️ Hooks a criar
│   ├── components/
│   │   ├── ui/                  # 51 componentes shadcn
│   │   ├── workspace/           # 12 componentes das abas
│   │   ├── layout/              # Layout components
│   │   └── clients/             # ClientsList, ClientWorkspace
│   └── pages/                   # Páginas da aplicação
│
├── supabase/
│   ├── migrations/              # Schema SQL
│   └── seeds/                   # Dados demo
│
└── Docs/                        # Documentação (ver hierarquia acima)
```

---

> [!TIP]
> **REGRA DE OURO:** Antes de implementar qualquer coisa, pergunte-se:
> 1. O PDR especifica isso?
> 2. Existe uma User Story para isso?
> 3. Onde está o código de referência?
> 4. Qual hook/componente preciso criar?