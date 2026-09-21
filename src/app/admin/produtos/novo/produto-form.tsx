"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { criarProduto } from "@/lib/actions/produtos";
import {
  alergenoLabel,
  conservacaoLabel,
  origemLabel,
  unidadeVendaLabel,
} from "@/lib/labels";

const alergenosDisponiveis = Object.keys(alergenoLabel) as Array<
  keyof typeof alergenoLabel
>;
const origensDisponiveis = Object.keys(origemLabel) as Array<
  keyof typeof origemLabel
>;
const conservacoesDisponiveis = Object.keys(conservacaoLabel) as Array<
  keyof typeof conservacaoLabel
>;
const tiposVariacaoDisponiveis = Object.keys(unidadeVendaLabel) as Array<
  keyof typeof unidadeVendaLabel
>;

const formSchema = z.object({
  sku: z.string().min(1, "Obrigatório"),
  nomeOriginal: z.string().min(1, "Obrigatório"),
  nomePt: z.string().min(1, "Obrigatório"),
  slug: z.string().min(1, "Obrigatório").regex(/^[a-z0-9-]+$/, "Só letras minúsculas, números e hífen"),
  categoriaId: z.string().min(1, "Selecione uma categoria"),
  origem: z.enum(
    origensDisponiveis as [
      keyof typeof origemLabel,
      ...(keyof typeof origemLabel)[],
    ],
  ),
  conservacao: z.enum(
    conservacoesDisponiveis as [
      keyof typeof conservacaoLabel,
      ...(keyof typeof conservacaoLabel)[],
    ],
  ),
  descricao: z.string().min(1, "Obrigatório"),
  ingredientes: z.string().min(1, "Obrigatório"),
  origemImportador: z.string().min(1, "Obrigatório"),
  numeroRegistro: z.string().optional(),
  alergenos: z.array(
    z.enum(
      alergenosDisponiveis as [
        keyof typeof alergenoLabel,
        ...(keyof typeof alergenoLabel)[],
      ],
    ),
  ),
  variacaoNome: z.string().min(1, "Obrigatório"),
  variacaoTipo: z.enum(
    tiposVariacaoDisponiveis as [
      keyof typeof unidadeVendaLabel,
      ...(keyof typeof unidadeVendaLabel)[],
    ],
  ),
  variacaoPrecoReais: z.coerce.number().positive("Informe um preço válido"),
  variacaoUnidadesConsumidas: z.coerce.number().int().min(1),
  loteCodigo: z.string().min(1, "Obrigatório"),
  loteQuantidade: z.coerce.number().int().min(0),
  loteValidade: z.string().min(1, "Obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProdutoForm({
  categorias,
}: {
  categorias: { id: string; nome: string }[];
}) {
  const router = useRouter();
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      origem: "JAPONESA",
      conservacao: "SECO",
      variacaoTipo: "UNIDADE",
      variacaoUnidadesConsumidas: 1,
      loteQuantidade: 0,
      alergenos: [],
    },
  });

  const alergenosSelecionados = watch("alergenos");

  async function onSubmit(values: FormValues) {
    setErroEnvio(null);

    const validado = formSchema.safeParse(values);
    if (!validado.success) {
      for (const issue of validado.error.issues) {
        const campo = issue.path[0];
        if (typeof campo === "string") {
          setError(campo as keyof FormValues, { message: issue.message });
        }
      }
      return;
    }

    const resultado = await criarProduto(validado.data);
    if (!resultado.ok) {
      setErroEnvio(resultado.erro);
      return;
    }
    router.push("/admin/produtos");
    router.refresh();
  }

  function toggleAlergeno(alergeno: keyof typeof alergenoLabel) {
    const atual = alergenosSelecionados ?? [];
    setValue(
      "alergenos",
      atual.includes(alergeno)
        ? atual.filter((a) => a !== alergeno)
        : [...atual, alergeno],
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold">Identificação</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Campo label="SKU" erro={errors.sku?.message}>
            <input {...register("sku")} className={inputClasses} />
          </Campo>
          <Campo label="Categoria" erro={errors.categoriaId?.message}>
            <select {...register("categoriaId")} className={inputClasses}>
              <option value="">Selecione</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Nome (português)" erro={errors.nomePt?.message}>
            <input
              {...register("nomePt", {
                onChange: (e) => setValue("slug", slugify(e.target.value)),
              })}
              className={inputClasses}
            />
          </Campo>
          <Campo label="Nome original" erro={errors.nomeOriginal?.message}>
            <input {...register("nomeOriginal")} className={inputClasses} />
          </Campo>
          <Campo label="Slug (URL)" erro={errors.slug?.message}>
            <input {...register("slug")} className={inputClasses} />
          </Campo>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold">Classificação</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Campo label="Origem">
            <select {...register("origem")} className={inputClasses}>
              {origensDisponiveis.map((o) => (
                <option key={o} value={o}>
                  {origemLabel[o]}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Conservação">
            <select {...register("conservacao")} className={inputClasses}>
              {conservacoesDisponiveis.map((c) => (
                <option key={c} value={c}>
                  {conservacaoLabel[c]}
                </option>
              ))}
            </select>
          </Campo>
        </div>
        <div className="flex flex-wrap gap-2">
          {alergenosDisponiveis.map((alergeno) => (
            <button
              type="button"
              key={alergeno}
              onClick={() => toggleAlergeno(alergeno)}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                alergenosSelecionados?.includes(alergeno)
                  ? "border-white bg-white text-black"
                  : "border-white/20 text-white/70"
              }`}
            >
              {alergenoLabel[alergeno]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold">Rótulo</legend>
        <Campo label="Descrição" erro={errors.descricao?.message}>
          <textarea {...register("descricao")} rows={2} className={inputClasses} />
        </Campo>
        <Campo label="Ingredientes" erro={errors.ingredientes?.message}>
          <textarea
            {...register("ingredientes")}
            rows={2}
            className={inputClasses}
          />
        </Campo>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Campo
            label="Origem / importador"
            erro={errors.origemImportador?.message}
          >
            <input {...register("origemImportador")} className={inputClasses} />
          </Campo>
          <Campo label="Nº de registro (opcional)">
            <input {...register("numeroRegistro")} className={inputClasses} />
          </Campo>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold">
          Variação de venda inicial
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Campo label="Nome" erro={errors.variacaoNome?.message}>
            <input {...register("variacaoNome")} className={inputClasses} />
          </Campo>
          <Campo label="Tipo">
            <select {...register("variacaoTipo")} className={inputClasses}>
              {tiposVariacaoDisponiveis.map((t) => (
                <option key={t} value={t}>
                  {unidadeVendaLabel[t]}
                </option>
              ))}
            </select>
          </Campo>
          <Campo
            label="Preço (R$)"
            erro={errors.variacaoPrecoReais?.message}
          >
            <input
              type="number"
              step="0.01"
              {...register("variacaoPrecoReais")}
              className={inputClasses}
            />
          </Campo>
          <Campo label="Unidades consumidas do estoque">
            <input
              type="number"
              {...register("variacaoUnidadesConsumidas")}
              className={inputClasses}
            />
          </Campo>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold">Lote inicial de estoque</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Campo label="Código do lote" erro={errors.loteCodigo?.message}>
            <input {...register("loteCodigo")} className={inputClasses} />
          </Campo>
          <Campo label="Quantidade">
            <input
              type="number"
              {...register("loteQuantidade")}
              className={inputClasses}
            />
          </Campo>
          <Campo label="Validade" erro={errors.loteValidade?.message}>
            <input
              type="date"
              {...register("loteValidade")}
              className={inputClasses}
            />
          </Campo>
        </div>
      </fieldset>

      {erroEnvio && <p className="text-sm text-red-400">{erroEnvio}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
      >
        {isSubmitting ? "Salvando..." : "Salvar produto"}
      </button>
    </form>
  );
}

const inputClasses =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-base text-white outline-none focus:border-white/40";

function Campo({
  label,
  erro,
  children,
}: {
  label: string;
  erro?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-white/80">
      {label}
      {children}
      {erro && <span className="text-xs text-red-400">{erro}</span>}
    </label>
  );
}
