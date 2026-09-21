"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { cadastrar } from "@/lib/actions/auth";

export function CadastroForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    const resultado = await cadastrar({ name, email, senha });

    if (!resultado.ok) {
      setCarregando(false);
      setErro(resultado.erro);
      return;
    }

    await signIn("credentials", { email, senha, redirect: false });
    setCarregando(false);
    window.location.href = callbackUrl;
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white/5 p-6 text-white sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
      <p className="mt-2 text-sm text-white/70">
        Cadastre-se na Luiz Oriental.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm text-white/80">
            Nome completo
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-base text-white outline-none focus:border-white/40"
            autoComplete="name"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm text-white/80">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-base text-white outline-none focus:border-white/40"
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="senha" className="text-sm text-white/80">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            required
            minLength={8}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-base text-white outline-none focus:border-white/40"
            autoComplete="new-password"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmarSenha" className="text-sm text-white/80">
            Confirmar senha
          </label>
          <input
            id="confirmarSenha"
            type="password"
            required
            minLength={8}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-base text-white outline-none focus:border-white/40"
            autoComplete="new-password"
          />
        </div>

        {erro && <p className="text-sm text-red-400">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="mt-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-opacity disabled:opacity-60"
        >
          {carregando ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className="mt-3 w-full rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/5"
      >
        Continuar com Google
      </button>

      <p className="mt-4 text-center text-sm text-white/60">
        Já tem conta?{" "}
        <Link href="/entrar" className="text-white underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
