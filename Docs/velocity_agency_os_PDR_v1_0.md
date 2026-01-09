# Velocity Agency OS — PDR (exportado do PDF)
> Observação: este arquivo foi gerado automaticamente a partir do PDF. Caso você queira, eu também posso entregar uma versão *nativa* em Markdown (mais limpa) com a mesma estrutura.

---

## Página 1

# Velocity Agency OS
Product Design Requirements (PDR)
Documento interno para padronização operacional e construção do software
Owner do Produto: Agência Velocity
Versão: 1.0
Data: 09/01/2026
Escopo: Uso interno (agência) - foco em playbook de clínicas (harmonização facial)
Confidencial - Não distribuir externamente

---

## Página 2

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
Sumário
Sumário 2
1. Controle do documento 6
### 1.1 Histórico de versões . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
2. Resumo executivo 7
### 2.1 Problemas que o produto resolve . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
### 2.2 Objetivos do produto . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
### 2.3 O que esta fora do escopo (fase inicial) . . . . . . . . . . . . . . . . . . . . . . . . 7
3. Visao, principios e definicoes 8
### 3.1 Visao . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
### 3.2 Principios de produto . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
### 3.3 Framework QFD aplicado . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
### 3.4 Glossario . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
4. Usuarios, papeis e permissoes 9
### 4.1 Perfis de usuario (Agencia) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
### 4.2 Perfis de usuario (Cliente) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
### 4.3 Matriz de permissao (resumo) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
5. Escopo, roadmap e criterios de sucesso 10
### 5.1 Escopo funcional por releases . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
### 5.2 Metricas de sucesso (produto e operacao) . . . . . . . . . . . . . . . . . . . . . . 10
### 5.3 Premissas e restricoes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
6. Jornadas principais e fluxos 11
### 6.1 Fluxo macro do metodo . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
### 6.2 Jornada A - Novo cliente (Agencia) . . . . . . . . . . . . . . . . . . . . . . . . . . 11
### 6.3 Jornada B - Aprovacoes e insumos (Cliente) . . . . . . . . . . . . . . . . . . . . . 11
Uso interno - Agência Velocity Página 2

---

## Página 3

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
### 6.4 Jornada C - Operacao semanal (Sprint) . . . . . . . . . . . . . . . . . . . . . . . 11
7. Arquitetura de informacao 13
### 7.1 Estrutura de navegacao . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
### 7.2 Sitemap (Portal da Agencia) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
### 7.3 Abas do Workspace do Cliente . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
### 7.4 Sitemap (Portal do Cliente) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
8. Requisitos funcionais (FR) 14
9. Especificacao de Workflows, Gates e SLAs 16
### 9.1 Workflow A - Novo Cliente (End-to-End) . . . . . . . . . . . . . . . . . . . . . . . 16
#### 9.1.1 Modulos e gates . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 16
#### 9.1.2 Steps chave (exemplos com checklists) . . . . . . . . . . . . . . . . . . . . . . . 16
### 9.2 Workflow B - Sprint Semanal . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 18
### 9.3 Workflow C - MBR Mensal . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 18
### 9.4 Workflow D - Renovacao e Offboarding . . . . . . . . . . . . . . . . . . . . . . . 18
10. UX e Wireframes textuais 19
### 10.1 Padrões de layout . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 19
### 10.2 Tela - Agency Today View (/agency/dashboard) . . . . . . . . . . . . . . . . . . 19
### 10.3 Tela - Lista de Clientes (/agency/clients) . . . . . . . . . . . . . . . . . . . . . . 19
### 10.4 Tela - Workspace Overview (/agency/clients/:id/overview) . . . . . . . . . . . . . 19
### 10.5 Tela - Workflows (/agency/clients/:id/workflows) . . . . . . . . . . . . . . . . . . 19
### 10.6 Tela - Step Detail + Focus Mode . . . . . . . . . . . . . . . . . . . . . . . . . . 20
### 10.7 Tela - Approvals (Agencia) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 20
### 10.8 Tela - Assets (Agencia) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 20
### 10.9 Telas - Portal do Cliente . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 20
Client Dashboard (/client/dashboard) . . . . . . . . . . . . . . . . . . . . . . . . . . . 20
Approvals (/client/approvals) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 20
Assets (/client/assets) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 20
Uso interno - Agência Velocity Página 3

---

## Página 4

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
Reports (/client/reports) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 21
11. Modelo de dados (Supabase) e RLS 22
### 11.1 Diagrama conceitual de arquitetura (alto nivel) . . . . . . . . . . . . . . . . . . 22
### 11.2 Entidades principais e relacionamentos . . . . . . . . . . . . . . . . . . . . . . 22
### 11.3 Tabelas (resumo) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 22
### 11.4 Storage (Supabase Storage) . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23
### 11.5 Politicas RLS (pseudo-SQL) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23
### 11.6 Indices e performance . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 24
12. Integracoes e automacoes (n8n) 25
### 12.1 Principios de integracao . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 25
### 12.2 Fluxos obrigatorios (MVP) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 25
### 12.3 Webhooks e contratos de payload . . . . . . . . . . . . . . . . . . . . . . . . . 25
### 12.4 Notificacoes (canais) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 25
### 12.5 Regras de escalonamento (SLA) . . . . . . . . . . . . . . . . . . . . . . . . . . 25
13. Dados, KPIs, Health Score e Relatorios 27
### 13.1 KPIs padrao - Clinica (harmonizacao facial) . . . . . . . . . . . . . . . . . . . . . 27
### 13.2 KPIs operacionais - Agencia . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 27
### 13.3 Health Score (ok/warn/risk) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 27
### 13.4 Relatorios . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 27
14. Requisitos nao funcionais (NFR) e seguranca 29
### 14.1 NFRs . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 29
### 14.2 Seguranca - Controles . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 29
### 14.3 Compliance e conteudo (clinicas) . . . . . . . . . . . . . . . . . . . . . . . . . . 29
15. Qualidade, testes e observabilidade 30
### 15.1 Estrategia de testes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30
### 15.2 Cenarios de aceite (exemplos) . . . . . . . . . . . . . . . . . . . . . . . . . . . 30
Uso interno - Agência Velocity Página 4

---

## Página 5

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
### 15.3 Observabilidade . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30
16. Plano de rollout (uso interno da agencia) 31
### 16.1 Estrategia de implantacao . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 31
### 16.2 Migracao de dados (minimo viavel) . . . . . . . . . . . . . . . . . . . . . . . . . 31
### 16.3 Treinamento e governanca . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 31
17. RACI (Responsavel, Aprovador, Consultado, Informado) 32
18. Riscos, mitigacoes e perguntas em aberto 33
### 18.1 Registro de riscos . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 33
### 18.2 Perguntas em aberto (para decisao) . . . . . . . . . . . . . . . . . . . . . . . . 33
19. Apêndices (templates operacionais) 34
### 19.1 Template - Kickoff (campos) . . . . . . . . . . . . . . . . . . . . . . . . . . . . 34
### 19.2 Template - Diagnostico 360 . . . . . . . . . . . . . . . . . . . . . . . . . . . . 34
### 19.3 Template - Blueprint 30/60/90 . . . . . . . . . . . . . . . . . . . . . . . . . . . 34
### 19.4 Template - Sprint Semanal . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 34
### 19.5 Template - MBR Mensal . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 34
### 19.6 Checklist - Conteudo Premium (anti-guerra de preco) . . . . . . . . . . . . . . . 35
20. Encerramento 36
Uso interno - Agência Velocity Página 5

---

## Página 6

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
1. Controle do documento
Campo Valor
Título Velocity Agency OS - Product Design Requirements (PDR)
Versão 1.0
Data 09/01/2026
Escopo Uso interno (Agência Velocity).
Público Produto, engenharia, operação (CS/Conteúdo/Mídia/Dados) e liderança.
Confidencialidade Confidencial - não distribuir externamente sem autorização.
Owner Agência Velocity
### 1.1 Histórico de versões
Versão Data Autor Mudanças principais
### 1.0 09/01/2026 ChatGPT (consultoria) Versão inicial completa do PDR (workflows, dados, RLS, automações, UX, wireframes e RACI).
Uso interno - Agência Velocity Página 6

---

## Página 7

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
2. Resumo executivo
O Velocity Agency OS e um sistema operacional interno para padronizar a operacao da
Agencia Velocity, garantindo que o metodo seja executado de forma consistente,
auditavel e escalavel. O produto substitui a dependencia de pessoas por processos,
checklists e gates (Definition of Done), viabilizando crescimento com qualidade mesmo
com equipe pequena ou rotativa.
O foco inicial e o nicho de clinicas (harmonizacao facial), onde a diferenca competitiva e
posicionamento premium (valor e metodo), e nao guerra de preco. O sistema incorpora o
framework QFD (Quadro, Furadeira, Decorado) como arquitetura de mensagem e como
estrutura de oferta (resultado final e metodo, nao insumo).
### 2.1 Problemas que o produto resolve
• Operacao desorganizada, com tarefas dispersas em WhatsApp, planilhas e
ferramentas soltas.
• Dificuldade de concluir atividades (execucao interrompida), com perda de padrao e
retrabalho.
• Onboarding inconsistente: cada cliente entra de um jeito, gerando atrasos e falhas de
acesso.
• Falta de visibilidade: nao se sabe o que destrava resultado (gargalo do funil) nem o
status real do cliente.
• Aprovacoes e insumos do cliente atrasam a operacao sem controle de SLA.
• Ausencia de metodo replicavel para formar equipe e escalar entregas.
### 2.2 Objetivos do produto
• Padronizar o ciclo de vida do cliente (comercial ate renovacao) com workflows guiados.
• Implementar gates bloqueantes (DoD) para reduzir falhas e evitar avancar sem
requisitos.
• Centralizar tarefas, SLAs, aprovacoes e ativos em um workspace por cliente.
• Operacao TDAH-friendly: Today View com Top 5 acoes e Focus Mode por etapa.
• Integrar automacoes via n8n (notificacoes, rotinas recorrentes, ingestao de metricas).
• Garantir seguranca e multi-tenant via Supabase RLS (agency_id e client_id).
### 2.3 O que esta fora do escopo (fase inicial)
• Publicacao automatica em redes sociais dentro do produto (pode ser fase futura).
• Gestao financeira completa (cobranca, NF, fluxo de caixa).
• IA generativa como dependencia critica do core (pode existir como opcional futuro).
• Marketplace publico de playbooks (por enquanto uso interno).
Uso interno - Agência Velocity Página 7

---

## Página 8

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
3. Visao, principios e definicoes
### 3.1 Visao
Construir o 'McDonald’s operacional' da Agencia Velocity: qualquer pessoa treinada no
sistema consegue executar o metodo com a mesma qualidade, usando processos e
evidencias objetivas (checklists, gates, logs e KPIs).
### 3.2 Principios de produto
• Processo acima de pessoa: o sistema deve guiar e bloquear o que gera falha previsivel.
• Menos clique, mais decisao: interfaces com poucas escolhas e foco em proxima acao.
• Tudo auditavel: historico de mudancas, aprovacoes e responsabilidades.
• Metrica como lingua: toda decisao operacional deve ter medicao minima.
• Separacao clara Agencia vs Cliente: portal do cliente para insumos e aprovacoes,
reduzindo ruido em WhatsApp.
• Templates primeiro: toda etapa critica tem modelo padrao (Kickoff, Diagnostico,
Blueprint, Sprint, MBR).
### 3.3 Framework QFD aplicado
Decorado = resultado final desejado (o sentimento e a transformacao). Furadeira = o
mecanismo (metodo/planejamento em fases). Quadro = os meios (procedimentos,
anuncios, criativos).
No software, QFD aparece em: (a) arquitetura de mensagem e oferta (Strategy), (b)
templates de scripts e criativos (Content/CRM), e (c) definicao de sucesso e KPIs (Data).
### 3.4 Glossario
Termo Definicao operacional
Workflow Conjunto de modulos e etapas guiadas para uma finalidade (ex.: Novo Cliente, Sprint Semanal).
Modulo Bloco logico dentro de um workflow (ex.: Kickoff, Diagnostico 360).
Step (Etapa) Unidade executavel com checklist, owner e SLA.
Checklist Lista de itens required/optional que evidenciam execucao.
Gate (DoD) Regra bloqueante que valida se o modulo/etapa esta pronto para avancar.
SLA Prazo maximo para uma etapa ou aprovacao (em horas/dias).
Health Score Sinalizacao do risco do cliente (ok/warn/risk) com base em KPIs e operacao.
Uso interno - Agência Velocity Página 8

---

## Página 9

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
4. Usuarios, papeis e permissoes
### 4.1 Perfis de usuario (Agencia)
O produto deve suportar papeis distintos para separar responsabilidade e reduzir risco.
Permissoes sao aplicadas via RLS (dados) e regras no frontend (UI).
Papel Responsabilidades principais Acesso
Admin Configura sistema, usuarios, clientes, playbooks e integrTaocotaels (.agencia)
CS/Manager Owner de clientes, conduz kickoff, aprova gates, garanteW SoLrAkss pea rcees ucoltmadpoles.to (exceto config global)
Editor (Conteudo)Planeja e produz criativos, briefs e calendario. Conteudo/Approvals/Assets/Tasks
Media Buyer Estrutura campanhas, otimiza, controla budget. Media/Data/Tasks
Analyst Tracking, KPIs, health score, dashboards e diagnostico. Data/Strategy/Reports
Viewer (Agencia) Leitura e acompanhamento. Read-only
### 4.2 Perfis de usuario (Cliente)
Papel Permissoes Nao pode
Client Admin Enviar ativos, fornecer acessos, aprovar/reprovar, Vviesru taalirzeafra sre ilnatteorrnioass ,e v KePr Ids addoo sp rdoep roiou tcrolies nctleie.ntes, editar playbooks.
Client Viewer Apenas leitura (KPIs, relatorios, calendario aprovadAop)r.ovar, enviar ativos, alterar configuracoes.
### 4.3 Matriz de permissao (resumo)
Abaixo um resumo pratico. Detalhes de RLS estao na secao 11.
Modulo Admin CS Editor Media Analyst Cliente
Workflows/Gates CRUD Editar/ValidaLrer Ler Editar/ValidaLrer (status)
Tasks CRUD CRUD CRUD (relacCioRnUaDda (sr)elacCioRnUaDda (sr)elacNioanoadas)
Approvals CRUD CRUD Criar Criar Criar Aprovar/Reprovar
Assets CRUD CRUD Ler Ler Ler Enviar/Atualizar
CRM Leads CRUD CRUD Ler Ler Ler Nao
Media CRUD Ler Ler CRUD Ler Nao
Dashboards Ler Ler Ler Ler CRUD/ConfigLer (simplificado)
Uso interno - Agência Velocity Página 9

---

## Página 10

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
5. Escopo, roadmap e criterios de sucesso
### 5.1 Escopo funcional por releases
Release Objetivo Inclui Nao inclui
MVP (Core) Operacao consistente eC laieundtietasv/Welorkspaces, Workflow EngineP (umbolidcaucleaso/s stoecpisa/lc nhaetcikvlais, tBsI/ gaavtaensc),a Tdaos, kIAs+ cSoLmAo, Pdoerpteanl ddoe nCcliiae nctoer e(Approvals+Assets), Today View + Focus Mode, Audit Logs
R1.1 Operacao comercial e CPiRpMel imnein CimRMo/WhatsApp, templates de Amuetnomsaagceanos ,c aoumtpomletaac odees W dhiaartiasAs p(fpo (lldoewp-eunpd),e p dlaey pbrooovkid celirn)ica premium completo
R1.2 Performance e dados Tracking checklist, ingestao de metricaMs ovdiae lno8s np,r deadsithivboosards KPI, health score automatico
R2.0 Conteudo e midia maisB raicnocso de criativos, variacoes A/B, bibliMotaerckae tdpel apcreo veaxste, rensotrutura de campanhas e naming
### 5.2 Metricas de sucesso (produto e operacao)
• Tempo medio de onboarding reduzido em 40% (da entrada ate Go-live).
• Reducao de retrabalho operacional em 60% (medida por reabertura de tasks e
rejeicoes de aprovacao).
• SLA de aprovacao do cliente cumprido em 85% dos casos (com alertas e
escalonamento).
• Aderencia ao metodo: 90%+ dos workflows concluidos sem 'bypass' de gate.
• Visibilidade: 100% dos clientes ativos com health score atualizado semanalmente.
• Para clinicas: aumento de show rate e conversao, com baseline definido no Diagnostico
360.
### 5.3 Premissas e restricoes
• Uso interno da agencia: prioridade e velocidade de operacao, nao funcionalidades
SaaS completas (billing, marketplace, multi-agency publico).
• Integracoes com WhatsApp e redes sociais variam por provider e permissao; no MVP,
focar em templates, pipeline e automacao via n8n onde possivel.
• O nicho inicial (clinicas) exige cuidado com comunicacao e compliance; o sistema deve
permitir regras de conteudo e aprovacao.
Uso interno - Agência Velocity Página 10

---

## Página 11

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
6. Jornadas principais e fluxos
### 6.1 Fluxo macro do metodo
A operacao segue um fluxo unico e sempre igual. Gates de qualidade bloqueiam a
passagem entre fases quando requisitos nao estao atendidos.
Comercial Onboarding Estratégia Setup Go-live Sprints MBR Renovação
Fluxo macro do método operacional. Gates de qualidade bloqueiam avanço entre fases.
### 6.2 Jornada A - Novo cliente (Agencia)
• Comercial registra lead e conduz diagnostico comercial (fit).
• Fechamento cria workspace e dispara checklist de acessos e ativos.
• Kickoff coleta objetivos, capacidade, oferta e personas.
• Diagnostico 360 identifica gargalo e top 3 alavancas.
• Blueprint 30/60/90 define metas, backlog ICE, mensagem e plano de canal.
• Setups (Tracking, CRM, Conteudo, Midia) rodam em paralelo com DoD claro.
• Gate Go-live: somente libera lancamento quando tracking+CRM+criativos+campanhas
estao OK.
• Inicio de operacao semanal (sprints) com relatorio e decisao semanal.
### 6.3 Jornada B - Aprovacoes e insumos (Cliente)
• Cliente acessa portal e ve pendencias: aprovacoes e ativos faltantes.
• Aprovacao: aprovar ou reprovar com motivo e sugestao (obrigatorio na reprova).
• Envio de ativos: upload guiado e checklist de acessos (status
missing/uploaded/validated).
• SLA: sistema notifica antes do vencimento e escala para CS quando estoura.
### 6.4 Jornada C - Operacao semanal (Sprint)
• Segunda 09:00: sistema cria sprint semanal (tarefas padrao + backlog ICE priorizado).
• Rotina diaria: CRM follow-up, pendencias de aprovacao, criativos em producao.
• Otimizacao: midia e criativos com base em KPIs.
• Reuniao semanal: pauta auto-gerada, decisoes registradas e convertidas em tasks.
Uso interno - Agência Velocity Página 11

---

## Página 12

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
• Fechamento: relatorio semanal e atualizacao do health score.
Uso interno - Agência Velocity Página 12

---

## Página 13

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
7. Arquitetura de informacao
### 7.1 Estrutura de navegacao
A navegacao deve ser mobile-first: barra inferior no mobile e sidebar no desktop. O
usuario alterna entre: (a) visao global (Today/Dashboard/Clientes) e (b) workspace do
cliente.
### 7.2 Sitemap (Portal da Agencia)
• /agency/dashboard - Today View
• /agency/clients - Lista de clientes
• /agency/clients/:id/overview - Workspace (abas)
• /agency/settings - Usuarios, clientes, playbooks, templates, integracoes
### 7.3 Abas do Workspace do Cliente
• Overview: KPIs, health, gates bloqueados, proximas acoes
• Workflows: linha do tempo por fases e detalhes por step
• Strategy: Kickoff, Diagnostico 360, Blueprint 30/60/90, QFD
• Operations: Sprint semanal, reuniao semanal, relatorios e MBR
• CRM: pipeline e templates de mensagens
• Content: calendario editorial, criativos, aprovacao
• Media: campanhas, budget, checklists de otimizacao
• Data: tracking, UTMs, dashboards
• Approvals: fila de aprovacoes
• Assets: inventario de ativos e acessos
• Notes: atas, decisoes, historico
### 7.4 Sitemap (Portal do Cliente)
• /client/dashboard - Pendencias + KPIs simples
• /client/approvals - Aprovar/reprovar itens
• /client/assets - Enviar ativos e acessos
• /client/reports - Relatorio semanal e MBR
Uso interno - Agência Velocity Página 13

---

## Página 14

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
8. Requisitos funcionais (FR)
Requisitos funcionais sao identificados por codigo (FR-XXX) e usados para planejar
implementacao e testes.
ID Nome Descricao (criterio de aceite resumido)
FR-001 Autenticacao via Supabase Login, logout, reset de senha, sessao persistente
Auth segura.
FR-002 Multi-tenant por agency_id Todo dado pertence a uma agencia; usuarios nao
acessam outras agencias.
FR-003 Workspace por cliente Cada cliente tem um workspace com fase atual, owner
e health.
FR-004 Workflow Engine - templates Criar templates (globais) e instancias por cliente.
e instancias
FR-005 Modules/Steps/Checklist Etapas ordenadas com checklist required/optional,
owner e SLA.
FR-006 Gates (DoD) bloqueantes Regras configuraveis em JSON; bloqueia avancar se
falhar.
FR-007 Tasks vinculadas a steps Criacao manual e automatica; status; due_at; owner;
relacionamentos.
FR-008 Today View Exibir Top 5 acoes, SLAs, gates bloqueados e proximas
reunioes.
FR-009 Focus Mode Modo de execucao por etapa, reduzindo distracao e
exibindo somente o necessario.
FR-010 Portal do cliente - Approvals Cliente aprova/reprova com motivo; SLA e historico.
FR-011 Portal do cliente - Assets Checklist de ativos/acessos; upload em Supabase
Storage; validacao.
FR-012 Audit log Registrar mudancas relevantes (gates, aprovacoes,
deletions, alteracoes criticas).
FR-013 Templates operacionais Kickoff, Diagnostico 360, Blueprint, Pauta semanal,
Relatorio, MBR.
FR-014 Playbooks por nicho Aplicar playbook ao criar cliente e instanciar workflows
e templates.
FR-015 CRM pipeline basico Leads com estagios
(new/qualified/scheduled/showed/closed/lost).
FR-016 Message templates Scripts WhatsApp por categoria; variacoes por cliente.
FR-017 Automacao de SLA via n8n Notificar cliente/CS quando SLA estiver proximo ou
vencido.
FR-018 Rotinas recorrentes Criar sprint toda segunda com tarefas padrao por
(semanal) cliente.
Uso interno - Agência Velocity Página 14

---

## Página 15

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
ID Nome Descricao (criterio de aceite resumido)
FR-019 Ingestao de metricas Receber via webhook (n8n) e persistir em
KPIs/creatives/campaigns.
FR-020 Dashboards de KPIs KPIs por periodo (7/30 dias) e funil de conversao.
FR-021 Health score Calcular status ok/warn/risk com regras configuraveis.
FR-022 Exportacao de relatorios Gerar relatorio semanal/MBR para envio.
(PDF/CSV) - opcional
FR-023 Notificacoes in-app Fila de notificacoes para eventos criticos (aprovacao,
gate fail, SLA).
FR-024 Controle de configuracoes Configurar SLA por tipo de aprovacao e por step.
de SLA
FR-025 Naming conventions de Padrao de nomes para facilitar operacao e auditoria.
campanhas/ativos
Uso interno - Agência Velocity Página 15

---

## Página 16

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
9. Especificacao de Workflows, Gates e SLAs
Esta secao define o metodo como software. Cada workflow contem modulos. Cada
modulo contem steps com checklist e gate DoD. O sistema cria tasks a partir dos steps e
exige evidencia minima para liberar avancos.
### 9.1 Workflow A - Novo Cliente (End-to-End)
Objetivo: levar um cliente do fechamento ate Go-live com medicao, conversao e rotina
operacional pronta.
#### 9.1.1 Modulos e gates
Modulo Objetivo Gate (DoD) - condicao de passagem
Onboarding Interno Criar workspace, aplicar Workspace criado + owner definido +
playbook e preparar tarefas iniciais geradas.
solicitacoes.
Kickoff Capturar negocio, metas, Metas numericas + capacidade +
capacidade, persona, oferta e oferta + persona preenchidas.
restricoes.
Acessos e Ativos Garantir acessos e materiais Acessos criticos validados
essenciais para operar. (IG/BM/Ads/Google) + ativos minimos
recebidos.
Diagnostico 360 Identificar gargalo e baseline de Gargalo declarado + baseline + top 3
funil. alavancas registradas.
Blueprint 30/60/90 Definir metas semanais, Backlog ICE priorizado + plano de
backlog ICE e arquitetura de canal + QFD finalizados.
mensagem (QFD).
Setup Tracking UTM, eventos, pixel/CAPI Checklist tracking 100% required =
quando aplicavel. done.
Setup CRM/WhatsApp Pipeline e scripts; follow-up Pipeline criado + templates essenciais
minimo. publicados.
Setup Primeiro lote de criativos e Criativos do lote 1 aprovados pelo
Conteudo/Criativos copys para lancamento. cliente.
Setup Midia Campanhas estruturadas Campanhas em draft com naming
(principal + remarketing). padrao + QA realizado.
Gate Go-live Validacao final antes de lancar. Tracking OK + CRM OK + Criativos
aprovados + Campanhas prontas.
Handover Operacao Iniciar sprints semanais e rotina Sprint 1 criada + reuniao semanal
diaria. agendada + dashboard baseline.
#### 9.1.2 Steps chave (exemplos com checklists)
Abaixo, exemplos de steps com checklist required. O motor de workflow deve permitir
expandir ou adaptar por playbook.
Uso interno - Agência Velocity Página 16

---

## Página 17

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
Step Owner SLA Checklist required (minimo)
Kickoff - Objetivos e metas CS 48h apos Objetivo principal; meta de
fechamento leads/agendamentos; meta de
show rate; meta de conversao;
capacidade semanal; restricoes.
Kickoff - Oferta e mensagem CS + Analyst 72h Decorado (transformacao);
(QFD) Metodo (fases); Quadro
(procedimentos); prova social;
limites/compliance.
Acessos - Meta/Ads e IG Cliente + CS 72h BM/Ads acesso; pixel; IG
conectado; permissoes
confirmadas; storage de ativos
basicos.
Tracking - UTM e eventos Analyst 48h Padrao UTM; eventos chave; teste
de disparo; dashboard baseline
criado.
CRM - Pipeline e scripts CS 48h Etapas pipeline; 1a resposta;
triagem; fechamento; follow-ups
D1/D3; lembrete de agenda.
Criativos Lote 1 Editor 5 dias 3-5 criativos (A/B); copies; CTA;
provas; aprovacao cliente.
Midia - Estrutura inicial Media 48h Campanha principal; remarketing;
naming; orcamento; QA; checklist
risco.
Uso interno - Agência Velocity Página 17

---

## Página 18

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
### 9.2 Workflow B - Sprint Semanal
Objetivo: transformar backlog e dados em execucao semanal com alinhamento, registro
de decisoes e melhoria continua.
Modulo/Step Entrada Saida/DoD
Planejamento (Seg 09:00B)acklog ICE + KPIs semana anterior Sprint criada com owners, prazos e prioridades.
Execucao diaria Tasks da sprint + pendencias de aproAvvaacnacoo de tasks; SLA controlado; bloqueios registrados.
Reuniao semanal Pauta automatica + dados Decisoes registradas; tasks criadas; mudancas aprovadas.
Relatorio semanal KPIs + resumo Relatorio publicado no portal do cliente; health recalculado.
### 9.3 Workflow C - MBR Mensal
Objetivo: revisar performance e operacao mensalmente, decidir correcao ou escala, e
alinhar renovacao.
Etapa DoD (criterio)
Consolidar dados KPIs do mes fechados; comparacao vs meta; analise de funil.
Diagnostico de gargalo Gargalo do mes definido; top 3 hipoteses; riscos.
Decisao Plano de correcao (ICE) ou escala (budget/canais) aprovado.
Plano do proximo mes Metas e backlog priorizados; calendario macro; responsabilidades.
Registro e comunicacao Ata publicada; tarefas geradas; health atualizado.
### 9.4 Workflow D - Renovacao e Offboarding
Objetivo: encerrar ou renovar com entrega limpa (acessos, ativos, aprendizado) e sem
perda de reputacao.
Etapa DoD
Revisao de valor Resumo de resultados e aprendizados; recomendacao clara (continuar/pausar).
Entrega final Relatorio final; biblioteca de ativos; exports; documentacao entregue.
Revogacao/TransferenciaAcessos e ownership transferidos; tokens revogados; logs arquivados.
Licoes aprendidas Post-mortem interno; atualizacao de playbook e templates.
Uso interno - Agência Velocity Página 18

---

## Página 19

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
10. UX e Wireframes textuais
Os wireframes abaixo descrevem estrutura, componentes e acoes por tela. Servem
como base para Figma e implementacao. O foco e minimizar friccao e manter operacao
guiada.
### 10.1 Padrões de layout
• Layout responsivo: bottom nav no mobile; sidebar no desktop.
• Cabecalho do workspace: nome do cliente, fase, health, CTA principal (Focus Mode) e
pendencias.
• Listas com filtros simples e busca; evitar excesso de filtros no MVP.
• Estados vazios com CTA (ex.: 'Criar primeiro workflow', 'Solicitar acesso').
• Componentes padrao: Card, Table, Tabs, Drawer (mobile), Dialog, Toast.
### 10.2 Tela - Agency Today View (/agency/dashboard)
• Header: logo, seletor de cliente (opcional), notificacoes, perfil.
• Bloco 1: 'Top 5 Acoes' (lista priorizada com botao 'Abrir no Focus Mode').
• Bloco 2: 'Gates bloqueados' (cards: modulo, motivo, botao 'Resolver').
• Bloco 3: 'SLAs vencendo' (aprovacoes e steps com contagem regressiva).
• Bloco 4: 'Clientes em risco' (health vermelho + ultimo evento).
• Quick actions: 'Criar Sprint semanal', 'Gerar pauta reuniao', 'Solicitar aprovacao'.
### 10.3 Tela - Lista de Clientes (/agency/clients)
• Tabela/Lista: Cliente, Fase, Health, Owner (CS), Ultima reuniao, Proximo gate.
• Filtros rapidos: Health (ok/warn/risk), Fase, Owner.
• Acoes por linha: abrir workspace, abrir pendencias, marcar como pausado.
• CTA: 'Novo cliente' abre wizard de onboarding.
### 10.4 Tela - Workspace Overview
(/agency/clients/:id/overview)
• Header: Nome do cliente + chips (fase, health), botao 'Focus Mode', botao 'Solicitar
aprovacao'.
• Coluna esquerda: KPIs do funil (leads, agendamento, show, conversao).
• Coluna direita: Gate atual (status) + checklist pendente; pendencias de assets;
aprovacoes pendentes.
• Bloco inferior: timeline de workflow com proximo step recomendado.
• Atalhos: abrir CRM pipeline; abrir calendario de conteudo; abrir tracking checklist.
### 10.5 Tela - Workflows (/agency/clients/:id/workflows)
Uso interno - Agência Velocity Página 19

---

## Página 20

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
• Timeline vertical por modulos (com status e gate).
• Expandir modulo mostra steps com owner, SLA e progresso de checklist.
• Botao 'Recalcular gate' e 'Ver evidencia' (checklist + docs).
• Acoes: iniciar step, concluir step, registrar bloqueio, gerar tasks.
### 10.6 Tela - Step Detail + Focus Mode
• Focus Mode abre em tela/overlay: titulo do step, owner, SLA, objetivo e templates.
• Checklist required com toggles e campos de evidencia (links, arquivos, notas).
• Secao 'Entradas esperadas' (inputs) e 'Saidas/DoD'.
• Botao 'Concluir step' somente habilitado quando required = done.
• Botao 'Pedir informacao ao cliente' cria item em Assets/Approvals.
### 10.7 Tela - Approvals (Agencia)
• Fila de aprovacoes com status e SLA.
• Abrir item mostra: preview (arte/copy), contexto, solicitante, historico.
• Acoes: reenviar, editar, comentar, cancelar.
• Ao criar aprovacao: tipo, titulo, payload, anexos, SLA e destinatario.
### 10.8 Tela - Assets (Agencia)
• Inventario por categoria: acessos, logos, fotos, videos, provas, docs.
• Cada item: status (missing/uploaded/validated), responsavel (cliente/agencia), data.
• Acoes: solicitar item, validar, rejeitar (com motivo).
### 10.9 Telas - Portal do Cliente
Client Dashboard (/client/dashboard)
• Pendencias: aprovacoes e assets faltando (com prazos).
• KPIs simples 7/30 dias.
• Proximas acoes solicitadas pela agencia.
Approvals (/client/approvals)
• Lista de itens pendentes e historico.
• Detalhe com preview, contexto e botao Aprovar/Reprovar.
• Ao reprovar: motivo obrigatorio + opcional sugestao.
Assets (/client/assets)
• Checklist guiado com upload direto para Supabase Storage.
• Itens de acesso com instrucoes (passo a passo).
• Status e validacao pela agencia.
Uso interno - Agência Velocity Página 20

---

## Página 21

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
Reports (/client/reports)
• Relatorio semanal (resumo + decisoes + proximos passos).
• MBR mensal com comparativo vs metas e plano do proximo mes.
Uso interno - Agência Velocity Página 21

---

## Página 22

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
11. Modelo de dados (Supabase) e RLS
O modelo de dados e desenhado para multi-tenant: toda linha tem agency_id e, quando
aplicavel, client_id. A seguranca e aplicada no banco via RLS; o frontend nunca depende
apenas de filtros de UI.
### 11.1 Diagrama conceitual de arquitetura (alto nivel)
Frontend Supabase n8n
(Next.js) (Auth + API) (Automations)
Postgres APIs
(RLS) (Meta/Google/WA)
### 11.2 Entidades principais e relacionamentos
• agencies 1:N clients; agencies 1:N users_profile.
• clients 1:1 workspaces (por ciclo ativo) ou 1:N se optar por historico.
• workflows (template) 1:N modules 1:N steps 1:N checklist_items.
• workflows (instance) ligado a client_id; gates ligados a module_id.
• tasks podem referenciar steps (related_step_id) e approvals.
• approvals e assets sao o canal principal de interacao com o cliente.
• crm_leads e message_templates suportam a operacao WhatsApp.
• kpi_definitions e kpi_values suportam dashboards e health score.
• audit_logs registra eventos criticos.
### 11.3 Tabelas (resumo)
Tabela Chave/relacao Observacoes
agencies id (PK) Tenant raiz.
users_profile id (FK auth.users), agency_id Role global da agencia.
clients agency_id Dados do negocio e status.
Uso interno - Agência Velocity Página 22

---

## Página 23

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
Tabela Chave/relacao Observacoes
clients_users client_id, user_id Acesso do cliente ao portal.
workspaces client_id Fase atual, health e owner.
workflows/modules/stepsw/cohrekcflkoliwst__idit/emmosdule_id/step_idEngine do metodo.
gates module_id Regras DoD em JSON; cache de status.
tasks client_id Operacao diaria e sprint.
approvals client_id Aprovacoes do cliente com SLA.
assets client_id Inventario e uploads (Storage).
crm_leads client_id Pipeline e historico de contato.
message_templates client_id opcional Scripts e mensagens.
experiments client_id Backlog ICE e resultados.
campaigns/creatives client_id Estrutura de midia e criativos.
kpi_definitions/kpi_valuesclient_id Metrica e historico.
audit_logs entity/entity_id Trilha de auditoria.
### 11.4 Storage (Supabase Storage)
• Buckets recomendados: assets-public (apenas leitura interna), assets-private
(sensivel), approvals (anexos de aprovacao).
• Paths devem incluir agency_id/client_id para isolamento:
{agency_id}/{client_id}/{type}/{filename}.
• Politicas de acesso do Storage devem seguir mesma logica de RLS: cliente so acessa
seu client_id; agencia acessa todos os seus clients.
### 11.5 Politicas RLS (pseudo-SQL)
A implementacao exata depende da modelagem final, mas o padrao base e:
Exemplo de helper: current_agency_id() obtido via users_profile ligado ao auth.uid().
Regras gerais: - AGENCIA: permitir SELECT/INSERT/UPDATE/DELETE quando agency_id =
current_agency_id(). - CLIENTE: permitir SELECT/UPDATE limitado quando existe registro
em clients_users para (auth.uid(), client_id).
Pseudo-politicas (exemplo para approvals):
-- Acesso da agencia CREATE POLICY "agency_read_approvals" ON approvals FOR SELECT
USING (agency_id = current_agency_id()); -- Acesso do cliente (somente no proprio
client_id) CREATE POLICY "client_read_approvals" ON approvals FOR SELECT USING (
EXISTS ( SELECT 1 FROM clients_users cu WHERE cu.user_id = auth.uid() AND cu.client_id
= approvals.client_id AND cu.agency_id = approvals.agency_id ) ); -- Cliente pode
DECIDIR (aprovar/reprovar) apenas quando status = pending CREATE POLICY
"client_decide_approvals" ON approvals FOR UPDATE USING (EXISTS (SELECT 1 FROM
clients_users cu WHERE cu.user_id = auth.uid() AND cu.client_id =
approvals.client_id)) WITH CHECK (status IN ('approved','rejected'));
Uso interno - Agência Velocity Página 23

---

## Página 24

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
### 11.6 Indices e performance
• Adicionar indices compostos: (agency_id, client_id, status) em tasks/approvals/assets.
• Criar indice em due_at/sla_due_at para consultas de SLA.
• Para logs: (agency_id, created_at desc) e (entity, entity_id).
• Evitar queries sem filtro de agency_id/client_id; sempre filtrar tenant no primeiro
predicado.
Uso interno - Agência Velocity Página 24

---

## Página 25

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
12. Integracoes e automacoes (n8n)
O n8n e o motor de automacao. O produto fornece webhooks (Edge Functions) e tabelas
de fila para disparar notificacoes, rotinas recorrentes e ingestao de metricas.
### 12.1 Principios de integracao
• Idempotencia: todo webhook deve aceitar chave idempotente (event_id) para evitar
duplicidade.
• Retry: n8n deve reprocessar falhas com backoff; Edge Functions devem responder
rapidamente (200/4xx).
• Observabilidade: toda automacao escreve em audit_logs (action = automation_run)
com metadata.
• Seguranca: webhooks com assinatura (token) e allowlist de IP quando possivel.
### 12.2 Fluxos obrigatorios (MVP)
Fluxo Gatilho Acao Saida
SLA Approvals approval pending e sla_dNueo_tiafitc parro cxliimenot/ev e+n CciSd;o escalonanrotificacao + audit log
Daily CRM Follow-uCpron diario Buscar leads sem contato > X htaosrkass ;c crriaiadra tsa +sk salerta
Weekly Sprint Cron semanal (Seg 09:00C)riar sprint e tasks padrao por scplireinntte_i da t+iv otasks
Metrics Ingest Webhook Persistir metricas em kpi_valuedsa es hcbreoaatridvse sa.tpuearlfiozramdoasnce
Health RecomputeCron semanal ou eventoRecalcular health score e gatesw corritkiscpoasce.health atualizado
### 12.3 Webhooks e contratos de payload
Recomenda-se expor Edge Functions com rota unica e tipo no payload. Exemplo:
/functions/v1/ingest.
Payload minimo (exemplo): { "event_id": "uuid-ou-hash", "agency_id": "uuid",
"client_id": "uuid", "type":
"metrics_ingest|lead_ingest|approval_sla|health_recompute", "occurred_at": "ISO-8601",
"data": { ... } }
O Edge Function valida agency_id/client_id, registra audit log e grava em tabelas
correspondentes.
### 12.4 Notificacoes (canais)
• In-app (tabela notifications): sempre, para rastreabilidade.
• WhatsApp: opcional via provider (ex.: Z-API, Gupshup, Twilio) - configuravel.
• Email: fallback e envio de relatorios.
• Slack: interno para time (alertas de SLA e health risk).
### 12.5 Regras de escalonamento (SLA)
• T-24h: lembrete leve (cliente).
Uso interno - Agência Velocity Página 25

---

## Página 26

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
• T-6h: lembrete forte + CS em copia.
• T+0: SLA estourado: notificar CS e criar task de cobranca.
• T+24h: escalonar para Admin (risco de operacao).
Uso interno - Agência Velocity Página 26

---

## Página 27

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
13. Dados, KPIs, Health Score e Relatorios
### 13.1 KPIs padrao - Clinica (harmonizacao facial)
Os KPIs devem ser registrados com periodo (inicio/fim) e fonte. O baseline e definido no
Diagnostico 360.
KPI Definicao Fonte
Leads Qtd de leads validos no periodo CRM/WhatsApp/Form/Ads
Taxa de agendamento Agendamentos / leads CRM/Agenda
Show rate Comparecimentos / agendamentos Agenda/CRM
Conversao em procedimeVnetnodas / comparecimentos CRM/Financeiro (informado)
Ticket medio Receita / vendas Informado pela clinica
Custo por lead (CPL) Gasto / leads Ads
Custo por agendamento (GCaPsAt)o / agendamentos Ads + CRM
Origem (%) Distribuicao por canal CRM + Ads
### 13.2 KPIs operacionais - Agencia
KPI Definicao
SLA compliance % de aprovacoes/steps dentro do SLA
Cycle time onboarding Dias do fechamento ate Go-live
Retrabalho Qtd de reaberturas / rejeicoes por item
Throughput Tasks concluidas por semana por cliente
Bloqueios Qtd e tempo medio de bloqueio por workflow
### 13.3 Health Score (ok/warn/risk)
Health deve combinar sinais de performance e sinais de operacao. Um exemplo de regra
(configuravel):
• WARN se: SLA compliance < 80% na semana OU gate critico bloqueado > 3 dias.
• RISK se: leads caem > 30% vs media 4 semanas OU show rate < meta por 2 semanas
OU cliente sem aprovar por 7 dias.
• OK se: metas semanais em linha e operacao sem gates bloqueados.
O health score deve ser recalculado por automacao semanal e sempre que eventos
criticos ocorrerem (rejeicao, SLA estourado, queda de KPI).
### 13.4 Relatorios
• Relatorio semanal: resumo do que foi feito, KPIs chave, aprendizados, decisoes e
proxima semana (gerado por template).
Uso interno - Agência Velocity Página 27

---

## Página 28

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
• MBR mensal: comparativo vs metas, funil, diagnistico, plano do proximo mes,
aprovacoes necessarias.
• Relatorio de onboarding: checklist final e evidencias (tracking, CRM, criativos,
campanhas).
Uso interno - Agência Velocity Página 28

---

## Página 29

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
14. Requisitos nao funcionais (NFR) e
seguranca
### 14.1 NFRs
ID Requisito Criterio
NFR-001 Disponibilidade 99.5% mensal (MVP) com janelas de manutencao planejadas.
NFR-002 Performance Today View < 2.0s (p95) em conexao media; queries principais indexadas.
NFR-003 Escalabilidade Suportar dezenas de clientes e milhares de tasks sem degradacao significativa.
NFR-004 Seguranca RLS em todas as tabelas; logs; principio do menor privilegio.
NFR-005 Confiabilidade Automacoes idempotentes; retries; trilha de auditoria.
NFR-006 Usabilidade Fluxos guiados; reduz complexidade; foco em proxima acao.
NFR-007 Backup/Restore Backups diarios; restore testado mensalmente (procedimento documentado).
### 14.2 Seguranca - Controles
• Supabase Auth: senha forte, MFA opcional, refresh tokens.
• RLS obrigatorio por tabela; testes automatizados de politicas (casos: agencia, cliente,
negado).
• Storage com politicas equivalentes a RLS (paths com agency_id/client_id).
• Edge Functions com validacao de assinatura para webhooks.
• Audit logs imutaveis (append-only) para eventos criticos.
• Rate limiting em endpoints expostos publicamente.
### 14.3 Compliance e conteudo (clinicas)
• O sistema deve suportar um checklist de compliance por criativo (ex.: termos,
consentimentos, antes/depois quando aplicavel).
• Aprovacao do cliente deve registrar responsavel e timestamp.
• Regras de conteudo proibido devem existir em 'playbook' (ex.: promessas irreais,
precificacao por ml, propaganda enganosa).
• Guardar documentos sensiveis em bucket privado, com acesso limitado.
Uso interno - Agência Velocity Página 29

---

## Página 30

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
15. Qualidade, testes e observabilidade
### 15.1 Estrategia de testes
• Unit: regras de gate, validacoes Zod, utilitarios de data.
• Integration: RLS (policies), Edge Functions, ingestao de webhooks.
• E2E: fluxos criticos (criar cliente -> kickoff -> approvals -> go-live).
• Regression: smoke suite antes de deploy.
• Testes de carga leves: Today View e listas com filtros.
### 15.2 Cenarios de aceite (exemplos)
Cenario Quando Entao
Gate bloqueia avancar Checklist required incompleto Botao concluir desabilitado; gate = fail com motivo.
Cliente reprova aprovacao Cliente seleciona reprovar Motivo obrigatorio; status = rejected; notificar solicitante.
SLA estoura approval passa de sla_due_at Criar task de cobranca; notificar CS e registrar audit log.
RLS impede vazamento Usuario de agencia A tenta acessSaErL cElCieTn tree tdoern aag 0e;n eciraro B de permissao nas operacoes.
### 15.3 Observabilidade
• Logs de aplicacao (frontend) para erros criticos e rastreamento de fluxo (sem dados
sensiveis).
• Logs de Edge Functions com correlation_id (event_id).
• Tabela audit_logs como fonte unica de trilha operacional.
• Dash interno de operacao: gates bloqueados, SLAs, health risk.
Uso interno - Agência Velocity Página 30

---

## Página 31

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
16. Plano de rollout (uso interno da agencia)
### 16.1 Estrategia de implantacao
• Fase 0 (7 dias): configurar playbook clinica, criar templates, definir SLAs e treinar time
no metodo.
• Fase 1 (14 dias): rodar 1 cliente piloto (clinica da esposa) end-to-end no sistema.
• Fase 2 (30 dias): migrar clientes ativos e padronizar rotinas semanais e MBR.
• Fase 3 (continuo): melhoria de playbooks e automacoes; medir adesao e reduzir
bypass.
### 16.2 Migracao de dados (minimo viavel)
• Importar clientes (nome, nicho, owner, status).
• Criar workspace e instanciar workflow 'Novo Cliente' ou 'Operacao' conforme fase
atual.
• Migrar pendencias (aprovacoes e assets) como itens novos; evitar importar historico
sujo.
• Criar baseline de KPIs manualmente no Diagnostico 360 para comecar comparacao.
### 16.3 Treinamento e governanca
• Treinamento curto (2h): conceitos de workflow, gate, SLA, Today View, portal do
cliente.
• Ritual semanal interno: revisar gates bloqueados e SLAs; ajustar playbook.
• Regra: nada critico deve ficar apenas em WhatsApp; registrar no sistema (task, note,
approval).
• Auditoria mensal: amostrar 2 clientes e verificar evidencias de DoD.
Uso interno - Agência Velocity Página 31

---

## Página 32

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
17. RACI (Responsavel, Aprovador,
Consultado, Informado)
RACI garante clareza e evita lacunas. R = executa; A = decide/aprova; C = consultado; I
= informado. Ajuste conforme estrutura de time.
Modulo/Entrega Admin CS Analyst Media Editor Cliente
Criar cliente/workspace A R I I I I
Kickoff (metas/persona/oferta)I R/A C C C C
Acessos e ativos I R C I I A/R
Diagnostico 360 I R A/R C C C
Blueprint 30/60/90 + backlog IICE A/R R C C C
Setup Tracking I C A/R I I I
Setup CRM/WhatsApp I A/R C I C C
Criativos Lote 1 I A C C R A/R
Setup Midia I A C R C I
Gate Go-live A R C C C I
Sprint semanal I A/R C R R I
Relatorio semanal I A/R R C C I
MBR mensal I A/R R C C C/A
Offboarding A R C C C I/A
Uso interno - Agência Velocity Página 32

---

## Página 33

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
18. Riscos, mitigacoes e perguntas em aberto
### 18.1 Registro de riscos
Risco Impacto Prob. Mitigacao
Complexidade do workfloAwt reansgoi nee bugs Media Comecar com template unico (clinica) e evoluir; manter gates simples no MVP.
Dependencia de aprovacaAotr adsoo csl ireenctoerrentesAlta Portal do cliente + SLA + escalonamento automatico; educar no kickoff.
Integracoes instaveis (AdFsa/Wlhhaas tosApeprpa)cionaisMedia Tratar integracao como opcional; fallback manual; logs e retries.
RLS configurado incorretaVmazeanmteento de dadosBaixa Testes automatizados de RLS; revisao por pares; ambientes separados.
Baixa adesao interna Sistema vira mais umMae dfeiarramTeondtaay View + Focus Mode; regra 'se nao esta no sistema, nao existe'; governanca semanal.
### 18.2 Perguntas em aberto (para decisao)
• O CRM sera apenas pipeline interno ou deve integrar com ferramenta externa (ex.: RD
Station, HubSpot)?
• WhatsApp: qual provider sera usado e quais mensagens podem ser automatizadas
sem risco de bloqueio?
• Qual e o conjunto minimo de KPIs que a clinica consegue informar com confiabilidade
(ticket, receita, show)?
• Como lidar com multi-unidade (clinica com mais de uma unidade) no futuro?
• Qual nivel de padronizacao de naming conventions (campanhas, criativos) deve ser
obrigatorio (gate) vs recomendado?
Uso interno - Agência Velocity Página 33

---

## Página 34

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
19. Apêndices (templates operacionais)
Os templates abaixo devem existir no sistema como modelos preenchiveis (forms) e
gerar evidencias para gates.
### 19.1 Template - Kickoff (campos)
• Contexto do negocio: servicos principais; diferenciais; capacidade semanal; restricoes.
• Objetivo e metas: meta de leads; agendamentos; show; conversao; ticket; prazo
(30/60/90).
• Publico e persona: perfil; dores; objecoes; motivacoes (decorado).
• Oferta: avaliacao paga; plano em fases; garantias/limites; forma de pagamento.
• QFD: Decorado (sentimento/transformacao); Furadeira (metodo); Quadro
(procedimentos).
• Compliance: promessas proibidas; antes/depois; orientacoes especificas.
### 19.2 Template - Diagnostico 360
• Baseline do funil: leads -> agendamentos -> show -> vendas -> ticket.
• Gargalo principal: onde quebra (ex.: resposta lenta no WhatsApp; show baixo; oferta
confusa).
• Top 3 alavancas: o que movera o ponteiro em 14-30 dias.
• Hipoteses: por que esta acontecendo; evidencias disponiveis.
• Plano de medicao: quais eventos/UTMs/KPIs serao usados.
### 19.3 Template - Blueprint 30/60/90
• Metas por periodo: 30/60/90 dias com indicadores e metas numericas.
• Backlog ICE: lista priorizada de experimentos (Impact, Confidence, Ease).
• Plano de canal: organico, ads, parcerias, indicacao, Google, etc.
• Mensagens (QFD): narrativas principais; provas; objecoes; CTA.
• Plano operacional: responsabilidades e rotinas (diario/semanal/mensal).
### 19.4 Template - Sprint Semanal
• Objetivo da semana + meta principal.
• Tarefas por area (CRM/Conteudo/Midia/Dados).
• Bloqueios e dependencias (incluindo cliente).
• Decisoes e mudancas aprovadas.
• Relatorio semanal: o que foi feito + KPIs + proximo passo.
### 19.5 Template - MBR Mensal
• Resumo executivo (o que mudou no mes).
Uso interno - Agência Velocity Página 34

---

## Página 35

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
• KPIs vs meta (funil completo).
• Diagnostico do gargalo e analise de causas.
• Decisoes: corrigir ou escalar (budget/canais).
• Plano do proximo mes + pedidos de aprovacao/ativos.
### 19.6 Checklist - Conteudo Premium (anti-guerra de preco)
• Foco no decorado: sentimento/transformacao e historia, nao em ml e preco.
• Explicar metodo (fases) e criterios de avaliacao paga.
• Provas: casos, depoimentos, bastidores, autoridade tecnica (sem promessas irreais).
• CTA: avaliacao com triagem (qualificacao) e nao 'promocao'.
• Compliance: evitar termos proibidos e claims absolutos.
Uso interno - Agência Velocity Página 35

---

## Página 36

# Velocity Agency OS - Product Design Requirements Versão 1.0 - 09/01/2026
20. Encerramento
Este PDR define o Velocity Agency OS como o sistema operacional interno da Agencia
Velocity. O documento deve ser tratado como vivo: ao executar com clientes reais,
ajustar playbooks, gates e templates com base em evidencias (KPIs e retrabalho).
Proximo passo recomendado: implementar o MVP com 1 cliente piloto (clinica) e iterar
semanalmente ate estabilizar onboarding, aprovacoes e rotina de sprint.
Uso interno - Agência Velocity Página 36
