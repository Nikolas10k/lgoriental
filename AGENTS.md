<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# LG Oriental — E-commerce de alimentos orientais

Loja virtual de produtos alimentícios japoneses, coreanos, chineses e
tailandeses. Este documento é a referência viva do projeto: stack,
convenções, comandos e regras de negócio. Mantenha-o atualizado a cada
fase concluída.

## Stack

- **Framework**: Next.js (App Router) + TypeScript (strict)
- **UI**: Tailwind CSS + shadcn/ui
- **ORM/Banco**: Prisma + PostgreSQL
- **Auth**: NextAuth (credenciais e-mail/senha + Google OAuth)
- **Validação**: Zod (schemas compartilhados entre client/server quando possível)
- **Formulários**: React Hook Form + Zod resolver
- **Pagamento**: Mercado Pago (Pix, cartão, boleto) via webhook
- **Frete**: Melhor Envio (cálculo e emissão de etiqueta)
- **Storage de imagens**: S3-compatível (bucket configurado via env vars)
- **Testes**: Vitest (unidade/integração) + Playwright (e2e do fluxo de compra)
- **Gerenciador de pacotes**: pnpm

## Convenções

- Commits pequenos e mensagens em **português**, no imperativo
  (ex.: "adiciona cálculo de frete por conservação").
- Nunca usar `float`/`number` fracionário para dinheiro: todo valor
  monetário é inteiro em **centavos** (`priceCents`, `totalCents`, etc.).
- Toda mutação de estoque ocorre dentro de uma **transação** do Prisma e
  gera um registro de movimentação (`StockMovement`) com motivo e origem.
- Webhooks (pagamento) são **idempotentes**: gravar o `event.id`/
  `payment.id` processado antes de aplicar efeitos colaterais.
- **Nunca mockar silenciosamente uma integração externa.** Se uma
  variável de ambiente ou credencial (Mercado Pago, Melhor Envio, S3,
  Google OAuth) não estiver configurada, a chamada correspondente deve
  falhar de forma explícita (erro claro nos logs e, em dev, na tela),
  nunca simular sucesso ou retornar dado fictício.
- Server Actions / Route Handlers validam entrada com Zod antes de
  qualquer acesso ao banco.
- Nomes de domínio em português no código de negócio (ex.: `lote`,
  `validade`, `conservacao`), nomes técnicos genéricos em inglês
  (ex.: `CartItem`, `OrderStatus`).
- Acessibilidade: todo componente interativo deve ser navegável por
  teclado; respeitar contraste mínimo AA.
- Antes de usar qualquer API do Next.js, confira
  `node_modules/next/dist/docs/` — esta versão (16.x) tem mudanças em
  relação ao treinamento (ex.: `Image`'s `priority` foi depreciado em
  favor de `preload`; `LayoutProps<"/">`/`PageProps<"/rota">` tipam as
  props de layout/page).

## Comandos

```bash
pnpm install          # instala dependências
pnpm dev              # ambiente de desenvolvimento
pnpm build            # build de produção
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest (unidade) — a configurar na Fase 1
pnpm test:e2e         # playwright (fluxo de compra) — a configurar na Fase 7
pnpm prisma migrate dev   # aplica migrações em dev — a partir da Fase 1
pnpm prisma studio        # inspeciona o banco
pnpm db:seed          # popula ~40 produtos reais do ramo
```

## Regras de negócio (o coração do projeto)

- **Validade e lote (FEFO)**: todo item de estoque pertence a um lote
  com data de validade. Separação de pedidos usa FEFO (vence primeiro,
  sai primeiro). Categoria define um limite mínimo de dias de validade
  restante (configurável); abaixo disso o lote não pode ser vendido.
- **Conservação (seco/resfriado/congelado)**: resfriados e congelados
  exigem embalagem térmica, têm frete próprio e prazo máximo de entrega.
  Se o prazo estimado para o CEP exceder esse limite, o item é bloqueado
  no carrinho com mensagem clara ao cliente.
- **Carrinho misto**: pedidos com itens secos + resfriados/congelados são
  divididos em remessas distintas, cada uma com seu próprio frete,
  exibidas separadamente no checkout.
- **Peso variável**: produtos como peixe e carne fatiada têm peso
  nominal, peso real (pós-separação) e ajuste de valor correspondente.
- **Unidade de venda**: unidade, pacote e caixa fechada — cada uma com
  preço próprio; a caixa consome N unidades do mesmo estoque físico.
- **Rotulagem obrigatória**: ingredientes, alérgenos (glúten, soja,
  crustáceos, amendoim, leite, peixe, gergelim), tabela nutricional,
  origem/importador e nº de registro quando aplicável. Filtro por
  alérgeno é requisito obrigatório da listagem.
- **Idioma do rótulo/busca**: nome no idioma original + nome em
  português + apelidos/sinônimos (ex.: "shoyu" = "molho de soja",
  "gochujang", "nori", "dashi"). Busca deve encontrar por qualquer um
  desses termos e tolerar erro de digitação.
- **Kits e combos**: SKU próprio que consome estoque dos componentes na
  venda (sem estoque próprio de kit).
- **Pedido mínimo** e **frete grátis acima de valor X**: ambos
  configuráveis (parâmetros de loja, não hardcoded).

## Requisitos não funcionais

- Mobile-first e responsivo (maior parte do tráfego é celular).
- LGPD: consentimento de cookies, exclusão de conta, minimização de dados.
- CPF/CNPJ do cliente com validação real (dígito verificador).
- Acessibilidade: teclado + contraste adequado (AA).
- Seeds com ~40 produtos reais do ramo para testes manuais.

## Status do projeto

- **Fase 0 — planejamento**: concluída, plano aprovado.
- **Fase 1 — setup**: em andamento. Scaffold Next.js + Tailwind criado;
  home com seção de rolagem (hero) usando 4 fotos de pratos como fundo,
  trocando por seção via `IntersectionObserver`
  (`src/components/scroll-hero.tsx`). Faltam: Prisma/PostgreSQL, schema,
  seeds, NextAuth, scripts de test/typecheck no `package.json`.
