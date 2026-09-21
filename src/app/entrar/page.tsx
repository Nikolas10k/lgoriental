import { Suspense } from "react";
import { EntrarForm } from "./entrar-form";

export default function EntrarPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-24 sm:px-6">
      <Suspense fallback={null}>
        <EntrarForm />
      </Suspense>
    </main>
  );
}
