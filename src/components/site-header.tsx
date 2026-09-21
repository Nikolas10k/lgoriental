import Image from "next/image";
import Link from "next/link";
import { HeaderNav } from "@/components/header-nav";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between gap-3 bg-gradient-to-b from-black/60 to-transparent px-4 py-3 sm:px-12 sm:py-4">
      <Link href="/" className="flex items-center gap-2 sm:gap-3">
        <Image
          src="/brand/logo.jpg"
          alt="Luiz Oriental"
          width={36}
          height={36}
          className="rounded-full sm:h-10 sm:w-10"
          preload
        />
        <span className="text-base font-semibold tracking-tight text-white sm:text-lg">
          Luiz Oriental
        </span>
      </Link>
      <HeaderNav />
    </header>
  );
}
