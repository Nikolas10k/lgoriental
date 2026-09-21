"use server";

import { EmailJaCadastradoError, registrarUsuario } from "@/lib/users";
import type { CadastroInput } from "@/lib/users";

export type CadastrarResult = { ok: true } | { ok: false; erro: string };

export async function cadastrar(
  input: CadastroInput,
): Promise<CadastrarResult> {
  try {
    await registrarUsuario(input);
    return { ok: true };
  } catch (error) {
    if (error instanceof EmailJaCadastradoError) {
      return { ok: false, erro: error.message };
    }
    return {
      ok: false,
      erro: error instanceof Error ? error.message : "Erro ao criar conta.",
    };
  }
}
