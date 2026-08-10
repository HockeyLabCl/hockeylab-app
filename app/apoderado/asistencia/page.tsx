import { createClient } from "@/lib/supabase/server";

export default async function AsistenciaApoderadoPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: alumnas } = await supabase
    .from("alumnas")
    .select("id, nombre, asistencia(fecha, presente, comentario)")
    .eq("apoderado_id", user!.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-rink-900">Asistencia</h1>
        <p className="text-rink-700/70 text-sm mt-1">
          Registro de entrenamientos a los que ha asistido tu hija.
        </p>
      </div>

      {alumnas?.map((a) => {
        const registros = ((a.asistencia as any[]) || []).sort((x, y) =>
          x.fecha < y.fecha ? 1 : -1
        );
        const totalPresente = registros.filter((r) => r.presente).length;

        return (
          <div key={a.id} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-rink-900">{a.nombre}</p>
              <span className="text-sm text-rink-700/60">
                {totalPresente} de {registros.length} entrenamientos
              </span>
            </div>
            <div className="divide-y border-t border-rink-100">
              {registros.map((r) => (
                <div key={r.fecha} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-rink-900">
                    {new Date(r.fecha + "T00:00:00").toLocaleDateString("es-CL", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span
                    className={r.presente ? "text-turf-500 font-medium" : "text-alert-red font-medium"}
                  >
                    {r.presente ? "Presente ✓" : "Ausente"}
                  </span>
                  {r.comentario && <span className="text-rink-700/50 text-xs">{r.comentario}</span>}
                </div>
              ))}
              {registros.length === 0 && (
                <p className="text-sm text-rink-700/60 py-2.5">
                  Todavía no hay registros de asistencia.
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
