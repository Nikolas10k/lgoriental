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

## Comandos

```bash
pnpm install          # instala dependências
pnpm dev              # ambiente de desenvolvimento
pnpm build            # build de produção
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest (unidade)
pnpm test:e2e         # playwright (fluxo de compra)
pnpm prisma migrate dev   # aplica migrações em dev
pnpm prisma studio        # inspeciona o banco
pnpm db:seed          # popula ~40 produtos reais do ramo
```

(Scripts serão adicionados ao `package.json` na Fase 1.)

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

Ver plano de fases na raiz da conversa com o usuário. Fase atual:
**Fase 0 — planejamento** (aguardando aprovação do plano antes de
iniciar a Fase 1).
