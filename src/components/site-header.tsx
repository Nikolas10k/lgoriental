import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 flex items-center gap-3 bg-gradient-to-b from-black/60 to-transparent px-6 py-4 sm:px-12">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/brand/logo.jpg"
          alt="Luiz Oriental"
          width={40}
          height={40}
          className="rounded-full"
          preload
        />
        <span className="text-lg font-semibold tracking-tight text-white">
          Luiz Oriental
        </span>
      </Link>
    </header>
  );
}
