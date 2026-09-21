import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCentavos } from "@/lib/format";
import {
  alergenoLabel,
  conservacaoLabel,
  origemLabel,
  unidadeVendaLabel,
} from "@/lib/labels";
import { ProductPlaceholder } from "@/components/product-placeholder";

export default async function ProdutoPage({
  params,
}: PageProps<"/produtos/[slug]">) {
  const { slug } = await params;

  const produto = await prisma.produto.findUnique({
    where: { slug, ativo: true },
    include: {
      categoria: true,
      alergenos: true,
      variacoes: { where: { ativo: true }, orderBy: { precoCentavos: "asc" } },
    },
  });

  if (!produto) notFound();

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 sm:px-8 sm:pt-28 lg:px-12">
      <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
        <div className="sm:sticky sm:top-24 sm:self-start">
          <ProductPlaceholder conservacao={produto.conservacao} />
        </div>

        <div className="text-white">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/50">
            <span>{produto.categoria.nome}</span>
            <span aria-hidden="true">·</span>
            <span>{origemLabel[produto.origem]}</span>
            <span aria-hidden="true">·</span>
            <span>{conservacaoLabel[produto.conservacao]}</span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {produto.nomePt}
          </h1>
          <p className="text-white/50">{produto.nomeOriginal}</p>

          <p className="mt-4 text-sm leading-6 text-white/80">
            {produto.descricao}
          </p>

          <div className="mt-6 flex flex-col gap-2">
            {produto.variacoes.map((variacao) => (
              <div
                key={variacao.id}
                className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3"
              >
                <span className="text-sm">
                  {variacao.nome}{" "}
                  <span className="text-white/50">
                    ({unidadeVendaLabel[variacao.tipo]})
                  </span>
                </span>
                <span className="font-semibold">
                  {formatCentavos(variacao.precoCentavos)}
                </span>
              </div>
            ))}
          </div>

          {produto.alergenos.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold">Contém</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {produto.alergenos.map((a) => (
                  <span
                    key={a.alergeno}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80"
                  >
                    {alergenoLabel[a.alergeno]}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-sm font-semibold">Ingredientes</h2>
            <p className="mt-1 text-sm text-white/70">
              {produto.ingredientes}
            </p>
          </div>

          <p className="mt-6 text-xs text-white/40">
            {produto.origemImportador}
            {produto.numeroRegistro ? ` · Registro ${produto.numeroRegistro}` : ""}
          </p>
        </div>
      </div>
    </main>
  );
}
