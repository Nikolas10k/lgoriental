import type {
  Alergeno,
  Conservacao,
  Origem,
  UnidadeVenda,
} from "@/generated/prisma/enums";

export const origemLabel: Record<Origem, string> = {
  JAPONESA: "Japonesa",
  COREANA: "Coreana",
  CHINESA: "Chinesa",
  TAILANDESA: "Tailandesa",
  OUTRA: "Outra",
};

export const conservacaoLabel: Record<Conservacao, string> = {
  SECO: "Seco",
  RESFRIADO: "Resfriado",
  CONGELADO: "Congelado",
};

export const alergenoLabel: Record<Alergeno, string> = {
  GLUTEN: "Glúten",
  SOJA: "Soja",
  CRUSTACEOS: "Crustáceos",
  AMENDOIM: "Amendoim",
  LEITE: "Leite",
  PEIXE: "Peixe",
  GERGELIM: "Gergelim",
};

export const unidadeVendaLabel: Record<UnidadeVenda, string> = {
  UNIDADE: "Unidade",
  PACOTE: "Pacote",
  CAIXA: "Caixa",
};
