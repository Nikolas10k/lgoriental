import Link from "next/link";
import { formatCentavos } from "@/lib/format";
import { conservacaoLabel, origemLabel } from "@/lib/labels";
import { ProductPlaceholder } from "@/components/product-placeholder";
import type { Conservacao, Origem } from "@/generated/prisma/enums";

export type ProductCardData = {
  slug: string;
  nomePt: string;
  nomeOriginal: string;
  origem: Origem;
  conservacao: Conservacao;
  precoDesdeCentavos: number;
};

export function ProductCard({ produto }: { produto: ProductCardData }) {
  return (
    <Link
      href={`/produtos/${produto.slug}`}
      className="group flex flex-col gap-2 rounded-xl p-2 transition-colors hover:bg-white/5"
    >
      <ProductPlaceholder conservacao={produto.conservacao} />
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/50">
          <span>{origemLabel[produto.origem]}</span>
          <span aria-hidden="true">·</span>
          <span>{conservacaoLabel[produto.conservacao]}</span>
        </div>
        <h3 className="text-sm font-medium text-white sm:text-base">
          {produto.nomePt}
        </h3>
        <p className="text-xs text-white/50">{produto.nomeOriginal}</p>
        <p className="mt-1 text-sm font-semibold text-white">
          a partir de {formatCentavos(produto.precoDesdeCentavos)}
        </p>
      </div>
    </Link>
  );
}
