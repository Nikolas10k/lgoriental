import { Suspense } from "react";
import { CadastroForm } from "./cadastro-form";

export default function CadastroPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-24 sm:px-6">
      <Suspense fallback={null}>
        <CadastroForm />
      </Suspense>
    </main>
  );
}
