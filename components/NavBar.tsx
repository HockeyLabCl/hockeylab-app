"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NavBar({
  role,
  links,
}: {
  role: "admin" | "apoderado";
  links: { href: string; label: string }[];
}) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="bg-rink-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <p className="font-display text-2xl tracking-wide text-turf-500">HOCKEYLAB</p>
        <button
          onClick={handleLogout}
          className="text-sm text-rink-100/70 hover:text-white transition"
        >
          Cerrar sesión
        </button>
      </div>
      <nav className="bg-rink-700">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-rink-100/80 hover:text-white hover:bg-white/5 transition"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
