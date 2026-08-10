import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { situacionAlumna, BADGE_TEXT, BADGE_CLASS } from "@/lib/pagos";

export default async function ApoderadoResumen() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: alumnas } = await supabase
    .from("alumnas")
    .select("id, nombre, categoria, pagos(periodo, estado)")
    .eq("apoderado_id", user!.id);

  const { data: ultimosComunicados } = await supabase
    .from("comunicados")
    .select("id, titulo, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-rink-900">Resumen</h1>
        <p className="text-rink-700/70 text-sm mt-1">
          Estado general de tu{alumnas && alumnas.length > 1 ? "s hijas" : " hija"} en la academia.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {alumnas?.map((a) => {
          const sit = situacionAlumna(a.pagos as any);
          return (
            <div key={a.id} className="bg-white rounded-xl shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-rink-900">{a.nombre}</p>
                  <p className="text-sm text-rink-700/60">{a.categoria}</p>
                </div>
                <span className={BADGE_CLASS[sit.estado]}>{BADGE_TEXT[sit.estado]}</span>
              </div>
              <div className="flex gap-3 text-sm">
                <Link href="/apoderado/pagos" className="text-turf-500 font-medium hover:underline">
                  Ver pagos →
                </Link>
                <Link href="/apoderado/asistencia" className="text-turf-500 font-medium hover:underline">
                  Ver asistencia →
                </Link>
              </div>
            </div>
          );
        })}
        {(!alumnas || alumnas.length === 0) && (
          <p className="text-rink-700/60 text-sm">
            Aún no hay ninguna alumna asociada a tu cuenta. Contacta a la administración.
          </p>
        )}
      </div>

      <div>
        <h2 className="font-display text-xl tracking-wide text-rink-900 mb-3">
          Últimos comunicados
        </h2>
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {ultimosComunicados?.map((c) => (
            <Link
              key={c.id}
              href="/apoderado/comunicados"
              className="block px-5 py-3.5 hover:bg-rink-100/50 transition"
            >
              <p className="font-medium text-rink-900 text-sm">{c.titulo}</p>
              <p className="text-xs text-rink-700/50">
                {new Date(c.created_at).toLocaleDateString("es-CL")}
              </p>
            </Link>
          ))}
          {(!ultimosComunicados || ultimosComunicados.length === 0) && (
            <p className="px-5 py-4 text-sm text-rink-700/60">No hay comunicados todavía.</p>
          )}
        </div>
      </div>
    </div>
  );
}
