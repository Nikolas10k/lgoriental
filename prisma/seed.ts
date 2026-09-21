import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { seedDatabase } from "../src/lib/seed";

seedDatabase()
  .then((resumo) => {
    console.log(`Seed concluído: ${resumo.totalProdutos} produtos cadastrados.`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
