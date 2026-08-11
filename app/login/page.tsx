"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Correo o contraseña incorrectos. Inténtalo de nuevo.");
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-rink-900 pitch-stripes flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="HockeyLab" className="w-40 h-auto mx-auto" />
          <p className="text-rink-100/70 text-sm mt-1">Academia Hockey Greenhouse</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-7 space-y-5"
        >
          <h1 className="font-display text-2xl text-rink-900 tracking-wide">
            Ingresa a tu cuenta
          </h1>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-rink-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-rink-700/20 px-3 py-2.5 text-rink-900 focus:border-turf-500"
              placeholder="apoderado@correo.cl"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-rink-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-rink-700/20 px-3 py-2.5 text-rink-900 focus:border-turf-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-alert-red text-sm bg-alert-red/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rink-900 hover:bg-rink-700 transition text-white font-semibold rounded-lg py-2.5 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="text-xs text-center text-rink-700/60">
            ¿No tienes cuenta? Pídele a la administración de la academia que te la cree.
          </p>
        </form>
      </div>
    </div>
  );
}
