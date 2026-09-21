import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { ReactNode } from "react";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/entrar?callbackUrl=/admin/produtos");
  }

  const perfil = session.user?.perfil;
  if (perfil !== "DONO" && perfil !== "ESTOQUE") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-8 sm:pt-28">
        {children}
      </div>
    </div>
  );
}
