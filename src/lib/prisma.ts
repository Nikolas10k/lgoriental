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
  if (!globalForPrisma.prisma) {
    const client = createPrismaClient();
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
    return client;
  }
  return globalForPrisma.prisma;
}

// Proxy: só valida DATABASE_URL e conecta quando `prisma.<algo>` é
// realmente acessado. Isso evita que o build do Next (que importa as
// rotas para coletar metadados) quebre em ambientes sem banco
// configurado ainda — o erro continua explícito, só que em runtime.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getPrismaClient(), prop, receiver);
  },
});
