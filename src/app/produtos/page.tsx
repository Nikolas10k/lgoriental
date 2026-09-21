import type { Origem } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { origemLabel } from "@/lib/labels";
import { ProductCard } from "@/components/product-card";

export const metadata = {
  title: "Catálogo — Luiz Oriental",
};

const origensValidas = Object.keys(origemLabel) as Origem[];

export default async function ProdutosPage({
  searchParams,
}: PageProps<"/produtos">) {
  const { origem: origemParam } = await searchParams;
  const origem = origensValidas.includes(origemParam as Origem)
    ? (origemParam as Origem)
    : undefined;

  const produtos = await prisma.produto.findMany({
    where: { ativo: true, ...(origem ? { origem } : {}) },
    orderBy: { nomePt: "asc" },
    include: {
      variacoes: {
        where: { ativo: true },
        orderBy: { precoCentavos: "asc" },
        take: 1,
      },
    },
  });

  const produtosComPreco = produtos.filter((p) => p.variacoes.length > 0);

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 sm:px-8 sm:pt-28 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {origem ? `Catálogo — ${origemLabel[origem]}` : "Catálogo"}
        </h1>
        <p className="mt-2 text-sm text-white/60">
          {produtosComPreco.length} produtos disponíveis.
        </p>

        {produtosComPreco.length === 0 ? (
          <p className="mt-10 text-white/60">
            Nenhum produto disponível no momento.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {produtosComPreco.map((produto) => (
              <ProductCard
                key={produto.id}
                produto={{
                  slug: produto.slug,
                  nomePt: produto.nomePt,
                  nomeOriginal: produto.nomeOriginal,
                  origem: produto.origem,
                  conservacao: produto.conservacao,
                  precoDesdeCentavos: produto.variacoes[0].precoCentavos,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
