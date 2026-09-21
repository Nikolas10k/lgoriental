import type { Conservacao } from "@/generated/prisma/enums";

const estiloPorConservacao: Record<Conservacao, { classe: string; icone: string }> = {
  SECO: { classe: "from-amber-900 to-amber-700", icone: "🌾" },
  RESFRIADO: { classe: "from-sky-900 to-sky-700", icone: "❄️" },
  CONGELADO: { classe: "from-cyan-950 to-cyan-800", icone: "🧊" },
};

export function ProductPlaceholder({
  conservacao,
}: {
  conservacao: Conservacao;
}) {
  const estilo = estiloPorConservacao[conservacao];
  return (
    <div
      className={`flex aspect-square w-full items-center justify-center rounded-lg bg-gradient-to-br ${estilo.classe}`}
      aria-hidden="true"
    >
      <span className="text-3xl sm:text-4xl">{estilo.icone}</span>
    </div>
  );
}
