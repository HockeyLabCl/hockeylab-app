"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "checking" | "login" | "set-password" | "invite-error";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>("checking");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  // Al cargar, revisa si esto viene de un link de invitación o de
  // recuperación de contraseña (llega con ?code=... o con tokens en
  // el hash de la URL, según el correo que haya generado Supabase).
  useEffect(() => {
    async function checkInviteLink() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          window.history.replaceState({}, "", "/login");
          setMode("set-password");
          return;
        }
      }

      // Da un instante para que el cliente de Supabase procese el
      // hash (#access_token=...) si es que viene por ahí.
      await new Promise((r) => setTimeout(r, 300));
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && (url.hash.includes("type=invite") || url.hash.includes("type=recovery"))) {
        window.history.replaceState({}, "", "/login");
        setMode("set-password");
        return;
      }

      setMode("login");
    }

    checkInviteLink();
  }, [supabase]);

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

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== newPassword2) {
      setError("Las dos contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      setError("No se pudo guardar la contraseña. Vuelve a pedir la invitación.");
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
          <p className="text-rink-100/70 text-sm mt-1">Academia HockeyLab</p>
        </div>

        {mode === "checking" && (
          <div className="bg-white rounded-2xl shadow-xl p-7 text-center text-sm text-rink-700/60">
            Verificando enlace...
          </div>
        )}

        {mode === "set-password" && (
          <form
            onSubmit={handleSetPassword}
            className="bg-white rounded-2xl shadow-xl p-7 space-y-5"
          >
            <div>
              <h1 className="font-display text-2xl text-rink-900 tracking-wide">
                Crea tu contraseña
              </h1>
              <p className="text-sm text-rink-700/60 mt-1">
                Es la primera vez que entras — define una contraseña para tu cuenta.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-rink-700">Nueva contraseña</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-rink-700/20 px-3 py-2.5 text-rink-900 focus:border-turf-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-rink-700">Repite la contraseña</label>
              <input
                type="password"
                required
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
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
              {loading ? "Guardando..." : "Guardar y entrar"}
            </button>
          </form>
        )}

        {mode === "login" && (
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
        )}
      </div>
    </div>
  );
}
