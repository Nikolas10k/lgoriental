"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function HeaderNav() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center gap-4 text-sm text-white sm:gap-6">
      <Link href="/produtos" className="hover:text-white/80">
        Catálogo
      </Link>
      {status === "authenticated" ? (
        <div className="flex items-center gap-3">
          {(session.user?.perfil === "DONO" ||
            session.user?.perfil === "ESTOQUE") && (
            <Link href="/admin/produtos" className="hover:text-white/80">
              Admin
            </Link>
          )}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="hover:text-white/80"
          >
            Sair
          </button>
        </div>
      ) : (
        <Link href="/entrar" className="hover:text-white/80">
          Entrar
        </Link>
      )}
    </nav>
  );
}
