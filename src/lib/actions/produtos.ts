"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const criarProdutoSchema = z.object({
  sku: z.string().min(1, "Informe o SKU"),
  nomeOriginal: z.string().min(1, "Informe o nome original"),
  nomePt: z.string().min(1, "Informe o nome em português"),
  slug: z
    .string()
    .min(1, "Informe o slug")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen"),
  categoriaId: z.string().min(1, "Selecione uma categoria"),
  origem: z.enum(["JAPONESA", "COREANA", "CHINESA", "TAILANDESA", "OUTRA"]),
  conservacao: z.enum(["SECO", "RESFRIADO", "CONGELADO"]),
  descricao: z.string().min(1, "Informe a descrição"),
  ingredientes: z.string().min(1, "Informe os ingredientes"),
  origemImportador: z.string().min(1, "Informe a origem/importador"),
  numeroRegistro: z.string().optional(),
  alergenos: z.array(
    z.enum([
      "GLUTEN",
      "SOJA",
      "CRUSTACEOS",
      "AMENDOIM",
      "LEITE",
      "PEIXE",
      "GERGELIM",
    ]),
  ),
  variacaoNome: z.string().min(1, "Informe o nome da variação"),
  variacaoTipo: z.enum(["UNIDADE", "PACOTE", "CAIXA"]),
  variacaoPrecoReais: z.coerce.number().positive("Informe um preço válido"),
  variacaoUnidadesConsumidas: z.coerce.number().int().min(1),
  loteCodigo: z.string().min(1, "Informe o código do lote"),
  loteQuantidade: z.coerce.number().int().min(0),
  loteValidade: z.string().min(1, "Informe a validade"),
});

type CriarProdutoInput = z.infer<typeof criarProdutoSchema>;
export type { CriarProdutoInput };

export type CriarProdutoResult =
  | { ok: true; produtoId: string }
  | { ok: false; erro: string };

async function exigirAcessoAdmin() {
  const session = await getServerSession(authOptions);
  const perfil = session?.user?.perfil;
  if (!session || (perfil !== "DONO" && perfil !== "ESTOQUE")) {
    throw new Error("Sem permissão para esta ação.");
  }
}

export async function criarProduto(
  input: CriarProdutoInput,
): Promise<CriarProdutoResult> {
  await exigirAcessoAdmin();

  const dados = criarProdutoSchema.parse(input);

  try {
    const produto = await prisma.$transaction(async (tx) => {
      const criado = await tx.produto.create({
        data: {
          sku: dados.sku,
          nomeOriginal: dados.nomeOriginal,
          nomePt: dados.nomePt,
          slug: dados.slug,
          descricao: dados.descricao,
          categoriaId: dados.categoriaId,
          origem: dados.origem,
          conservacao: dados.conservacao,
          ingredientes: dados.ingredientes,
          tabelaNutricional: {},
          origemImportador: dados.origemImportador,
          numeroRegistro: dados.numeroRegistro || null,
          alergenos: dados.alergenos.length
            ? { create: dados.alergenos.map((alergeno) => ({ alergeno })) }
            : undefined,
          variacoes: {
            create: {
              tipo: dados.variacaoTipo,
              nome: dados.variacaoNome,
              skuVariacao: `${dados.sku}-${dados.variacaoTipo}`,
              precoCentavos: Math.round(dados.variacaoPrecoReais * 100),
              unidadesConsumidas: dados.variacaoUnidadesConsumidas,
            },
          },
        },
      });

      const lote = await tx.loteEstoque.create({
        data: {
          produtoId: criado.id,
          codigoLote: dados.loteCodigo,
          quantidade: dados.loteQuantidade,
          validade: new Date(dados.loteValidade),
        },
      });

      await tx.movimentacaoEstoque.create({
        data: {
          produtoId: criado.id,
          loteId: lote.id,
          tipo: "ENTRADA",
          quantidade: dados.loteQuantidade,
          motivo: "Cadastro manual (painel admin)",
        },
      });

      return criado;
    });

    revalidatePath("/produtos");
    revalidatePath("/admin/produtos");

    return { ok: true, produtoId: produto.id };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return { ok: false, erro: "Já existe um produto com este SKU ou slug." };
    }
    return {
      ok: false,
      erro: error instanceof Error ? error.message : "Erro ao criar produto.",
    };
  }
}
