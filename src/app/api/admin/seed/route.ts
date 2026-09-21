import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

// Rota temporária para popular o banco de produção pela primeira vez,
// já que o ambiente de deploy não permite conexão direta ao Postgres
// para rodar o seed via CLI. Remover depois do uso (ver AGENTS.md).
export async function POST(request: Request) {
  const secret = request.headers.get("x-seed-secret");
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const resumo = await seedDatabase();
    return NextResponse.json({ ok: true, resumo });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
