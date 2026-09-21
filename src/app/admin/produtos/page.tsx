import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCentavos } from "@/lib/format";
import { conservacaoLabel, origemLabel } from "@/lib/labels";

export default async function AdminProdutosPage() {
  const produtos = await prisma.produto.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      categoria: true,
      variacoes: { orderBy: { precoCentavos: "asc" }, take: 1 },
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          Novo produto
        </Link>
      </div>

      <p className="mt-2 text-sm text-white/60">
        {produtos.length} produtos cadastrados.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="flex flex-col gap-1 rounded-lg border border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium">
                {produto.nomePt}{" "}
                <span className="text-white/40">· {produto.sku}</span>
              </p>
              <p className="text-xs text-white/50">
                {produto.categoria.nome} · {origemLabel[produto.origem]} ·{" "}
                {conservacaoLabel[produto.conservacao]}
                {!produto.ativo && " · inativo"}
              </p>
            </div>
            <p className="text-sm font-semibold">
              {produto.variacoes[0]
                ? formatCentavos(produto.variacoes[0].precoCentavos)
                : "sem variação"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
