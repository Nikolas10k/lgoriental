"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { NavDropdown } from "@/components/nav-dropdown";

const catalogoItems = [
  { label: "Ver tudo", href: "/produtos" },
  { label: "Japonesa", href: "/produtos?origem=JAPONESA" },
  { label: "Coreana", href: "/produtos?origem=COREANA" },
  { label: "Chinesa", href: "/produtos?origem=CHINESA" },
  { label: "Tailandesa", href: "/produtos?origem=TAILANDESA" },
];

const institucionalItems = [
  { label: "Sobre nós", href: "/institucional/sobre" },
  { label: "Contato", href: "/institucional/contato" },
];

export function HeaderNav() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center gap-3 text-sm text-white sm:gap-6">
      <NavDropdown label="Catálogo" items={catalogoItems} />
      <NavDropdown label="Institucional" items={institucionalItems} />
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
