import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL não configurada. Defina no .env (veja .env.example).",
    );
  }
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
}

function getPrismaClient(): PrismaClient {
  // Sempre reaproveita a mesma instância (mesmo processo = mesma pool de
  // conexões). Em dev isso também evita recriar o client a cada hot-reload;
  // em produção é ainda mais crítico — sem isso, cada acesso a `prisma.algo`
  // criaria uma pool nova e esgotaria as conexões do banco em segundos.
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Proxy: só valida DATABASE_URL e conecta quando `prisma.<algo>` é
// realmente acessado. Isso evita que o build do Next (que importa as
// rotas para coletar metadados) quebre em ambientes sem banco
// configurado ainda — o erro continua explícito, só que em runtime.
//
// Métodos são retornados com `bind(client)`: sem isso, `prisma.$transaction(...)`
// executa com `this` apontando para o Proxy (não para o client real), o que
// quebra o rastreamento interno de transação do Prisma ("Transaction not found").
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
