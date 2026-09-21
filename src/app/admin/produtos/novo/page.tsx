import { prisma } from "@/lib/prisma";
import { ProdutoForm } from "./produto-form";

export default async function NovoProdutoPage() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
    select: { id: true, nome: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Novo produto</h1>
      <p className="mt-2 text-sm text-white/60">
        Cria o produto com uma variação de venda e um lote inicial de
        estoque.
      </p>

      <div className="mt-6 max-w-2xl">
        <ProdutoForm categorias={categorias} />
      </div>
    </div>
  );
}
