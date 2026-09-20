-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('DONO', 'ESTOQUE', 'ATENDIMENTO', 'CLIENTE');

-- CreateEnum
CREATE TYPE "Origem" AS ENUM ('JAPONESA', 'COREANA', 'CHINESA', 'TAILANDESA', 'OUTRA');

-- CreateEnum
CREATE TYPE "Conservacao" AS ENUM ('SECO', 'RESFRIADO', 'CONGELADO');

-- CreateEnum
CREATE TYPE "Alergeno" AS ENUM ('GLUTEN', 'SOJA', 'CRUSTACEOS', 'AMENDOIM', 'LEITE', 'PEIXE', 'GERGELIM');

-- CreateEnum
CREATE TYPE "UnidadeVenda" AS ENUM ('UNIDADE', 'PACOTE', 'CAIXA');

-- CreateEnum
CREATE TYPE "TipoMovimentoEstoque" AS ENUM ('ENTRADA', 'SAIDA_VENDA', 'AJUSTE', 'DEVOLUCAO', 'PERDA');

-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('AGUARDANDO_PAGAMENTO', 'PAGO', 'SEPARANDO', 'ENVIADO', 'ENTREGUE', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MetodoPagamento" AS ENUM ('PIX', 'CARTAO', 'BOLETO');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'APROVADO', 'RECUSADO', 'ESTORNADO');

-- CreateEnum
CREATE TYPE "TipoDesconto" AS ENUM ('PERCENTUAL', 'FIXO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "senhaHash" TEXT,
    "cpfCnpj" TEXT,
    "perfil" "PerfilUsuario" NOT NULL DEFAULT 'CLIENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "excluidoEm" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas_oauth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "contas_oauth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessoes" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_verificacao" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apelido" TEXT,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" CHAR(2) NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "diasValidadeMinimos" INTEGER NOT NULL DEFAULT 7,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "nomeOriginal" TEXT NOT NULL,
    "nomePt" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "origem" "Origem" NOT NULL,
    "conservacao" "Conservacao" NOT NULL,
    "ingredientes" TEXT NOT NULL,
    "tabelaNutricional" JSONB NOT NULL,
    "origemImportador" TEXT NOT NULL,
    "numeroRegistro" TEXT,
    "diasValidadeMinimosOverride" INTEGER,
    "pesoVariavel" BOOLEAN NOT NULL DEFAULT false,
    "pesoNominalGramas" INTEGER,
    "isKit" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto_apelidos" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "termo" TEXT NOT NULL,

    CONSTRAINT "produto_apelidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto_alergenos" (
    "produtoId" TEXT NOT NULL,
    "alergeno" "Alergeno" NOT NULL,

    CONSTRAINT "produto_alergenos_pkey" PRIMARY KEY ("produtoId","alergeno")
);

-- CreateTable
CREATE TABLE "kit_itens" (
    "id" TEXT NOT NULL,
    "kitId" TEXT NOT NULL,
    "componenteProdutoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "kit_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variacoes" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "tipo" "UnidadeVenda" NOT NULL,
    "nome" TEXT NOT NULL,
    "skuVariacao" TEXT NOT NULL,
    "precoCentavos" INTEGER NOT NULL,
    "unidadesConsumidas" INTEGER NOT NULL DEFAULT 1,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "variacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lotes_estoque" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "codigoLote" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "validade" TIMESTAMP(3) NOT NULL,
    "custoCentavos" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lotes_estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentacoes_estoque" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "loteId" TEXT,
    "tipo" "TipoMovimentoEstoque" NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "pedidoId" TEXT,
    "criadoPorId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacoes_estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrinhos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carrinhos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_carrinho" (
    "id" TEXT NOT NULL,
    "carrinhoId" TEXT NOT NULL,
    "variacaoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "itens_carrinho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enderecoId" TEXT NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'AGUARDANDO_PAGAMENTO',
    "subtotalCentavos" INTEGER NOT NULL,
    "freteCentavos" INTEGER NOT NULL,
    "totalCentavos" INTEGER NOT NULL,
    "cupomId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remessas" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "conservacao" "Conservacao" NOT NULL,
    "freteCentavos" INTEGER NOT NULL,
    "transportadora" TEXT,
    "codigoRastreio" TEXT,
    "prazoEstimadoDias" INTEGER,

    CONSTRAINT "remessas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_pedido" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "remessaId" TEXT NOT NULL,
    "variacaoId" TEXT NOT NULL,
    "nomeProdutoSnapshot" TEXT NOT NULL,
    "precoUnitarioCentavosSnapshot" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "pesoNominalGramas" INTEGER,
    "pesoRealGramas" INTEGER,
    "ajusteValorCentavos" INTEGER,

    CONSTRAINT "itens_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "provedor" TEXT NOT NULL DEFAULT 'MERCADO_PAGO',
    "metodo" "MetodoPagamento" NOT NULL,
    "status" "StatusPagamento" NOT NULL DEFAULT 'PENDENTE',
    "externalId" TEXT NOT NULL,
    "valorCentavos" INTEGER NOT NULL,
    "payloadWebhook" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cupons" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipoDesconto" "TipoDesconto" NOT NULL,
    "valor" INTEGER NOT NULL,
    "validoAte" TIMESTAMP(3),
    "usoMaximo" INTEGER,
    "usosRealizados" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracao_loja" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "pedidoMinimoCentavos" INTEGER NOT NULL DEFAULT 0,
    "freteGratisAcimaDeCentavos" INTEGER,
    "prazoMaximoResfriadoDias" INTEGER NOT NULL DEFAULT 3,
    "prazoMaximoCongeladoDias" INTEGER NOT NULL DEFAULT 5,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracao_loja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpfCnpj_key" ON "usuarios"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "contas_oauth_provider_providerAccountId_key" ON "contas_oauth"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessoes_sessionToken_key" ON "sessoes"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_verificacao_token_key" ON "tokens_verificacao"("token");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_verificacao_identifier_token_key" ON "tokens_verificacao"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_sku_key" ON "produtos"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_slug_key" ON "produtos"("slug");

-- CreateIndex
CREATE INDEX "produtos_categoriaId_idx" ON "produtos"("categoriaId");

-- CreateIndex
CREATE INDEX "produtos_origem_idx" ON "produtos"("origem");

-- CreateIndex
CREATE INDEX "produtos_conservacao_idx" ON "produtos"("conservacao");

-- CreateIndex
CREATE INDEX "produto_apelidos_termo_idx" ON "produto_apelidos"("termo");

-- CreateIndex
CREATE UNIQUE INDEX "produto_apelidos_produtoId_termo_key" ON "produto_apelidos"("produtoId", "termo");

-- CreateIndex
CREATE UNIQUE INDEX "kit_itens_kitId_componenteProdutoId_key" ON "kit_itens"("kitId", "componenteProdutoId");

-- CreateIndex
CREATE UNIQUE INDEX "variacoes_skuVariacao_key" ON "variacoes"("skuVariacao");

-- CreateIndex
CREATE INDEX "variacoes_produtoId_idx" ON "variacoes"("produtoId");

-- CreateIndex
CREATE INDEX "lotes_estoque_produtoId_validade_idx" ON "lotes_estoque"("produtoId", "validade");

-- CreateIndex
CREATE UNIQUE INDEX "lotes_estoque_produtoId_codigoLote_key" ON "lotes_estoque"("produtoId", "codigoLote");

-- CreateIndex
CREATE INDEX "movimentacoes_estoque_produtoId_idx" ON "movimentacoes_estoque"("produtoId");

-- CreateIndex
CREATE INDEX "movimentacoes_estoque_pedidoId_idx" ON "movimentacoes_estoque"("pedidoId");

-- CreateIndex
CREATE UNIQUE INDEX "carrinhos_userId_key" ON "carrinhos"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "itens_carrinho_carrinhoId_variacaoId_key" ON "itens_carrinho"("carrinhoId", "variacaoId");

-- CreateIndex
CREATE INDEX "pedidos_userId_idx" ON "pedidos"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_pedidoId_key" ON "pagamentos"("pedidoId");

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_externalId_key" ON "pagamentos"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "cupons_codigo_key" ON "cupons"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_produtoId_userId_key" ON "avaliacoes"("produtoId", "userId");

-- AddForeignKey
ALTER TABLE "contas_oauth" ADD CONSTRAINT "contas_oauth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_apelidos" ADD CONSTRAINT "produto_apelidos_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_alergenos" ADD CONSTRAINT "produto_alergenos_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_itens" ADD CONSTRAINT "kit_itens_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_itens" ADD CONSTRAINT "kit_itens_componenteProdutoId_fkey" FOREIGN KEY ("componenteProdutoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variacoes" ADD CONSTRAINT "variacoes_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lotes_estoque" ADD CONSTRAINT "lotes_estoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_estoque" ADD CONSTRAINT "movimentacoes_estoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_estoque" ADD CONSTRAINT "movimentacoes_estoque_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "lotes_estoque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_estoque" ADD CONSTRAINT "movimentacoes_estoque_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_estoque" ADD CONSTRAINT "movimentacoes_estoque_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrinhos" ADD CONSTRAINT "carrinhos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_carrinho" ADD CONSTRAINT "itens_carrinho_carrinhoId_fkey" FOREIGN KEY ("carrinhoId") REFERENCES "carrinhos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_carrinho" ADD CONSTRAINT "itens_carrinho_variacaoId_fkey" FOREIGN KEY ("variacaoId") REFERENCES "variacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cupomId_fkey" FOREIGN KEY ("cupomId") REFERENCES "cupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remessas" ADD CONSTRAINT "remessas_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_remessaId_fkey" FOREIGN KEY ("remessaId") REFERENCES "remessas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_variacaoId_fkey" FOREIGN KEY ("variacaoId") REFERENCES "variacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
