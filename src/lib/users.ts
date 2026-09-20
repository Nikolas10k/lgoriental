import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const cadastroSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.email("E-mail inválido"),
  senha: z.string().min(8, "A senha precisa ter no mínimo 8 caracteres"),
});

export type CadastroInput = z.infer<typeof cadastroSchema>;

export class EmailJaCadastradoError extends Error {
  constructor() {
    super("Já existe uma conta com este e-mail.");
    this.name = "EmailJaCadastradoError";
  }
}

export async function registrarUsuario(input: CadastroInput) {
  const dados = cadastroSchema.parse(input);

  const existente = await prisma.user.findUnique({
    where: { email: dados.email },
  });
  if (existente) throw new EmailJaCadastradoError();

  const senhaHash = await bcrypt.hash(dados.senha, 12);

  return prisma.user.create({
    data: {
      name: dados.name,
      email: dados.email,
      senhaHash,
      carrinho: { create: {} },
    },
  });
}
