import { createClient } from "@/lib/supabase/server";
import MarcarVisto from "@/components/MarcarVisto";

export default async function ComunicadosApoderadoPage() {
  const supabase = createClient();

  const { data: comunicados } = await supabase
    .from("comunicados")
    .select("id, titulo, contenido, categoria_destino, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <MarcarVisto seccion="comunicados" />
      <div>
        <h1 className="font-display text-3xl tracking-wide text-rink-900">Comunicados</h1>
        <p className="text-rink-700/70 text-sm mt-1">Noticias y avisos de la academia.</p>
      </div>

      <div className="space-y-4">
        {comunicados?.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-rink-900">{c.titulo}</p>
              <span className="text-xs text-rink-700/50">
                {new Date(c.created_at).toLocaleDateString("es-CL")}
              </span>
            </div>
            {c.categoria_destino && (
              <span className="badge badge-pendiente mb-2">{c.categoria_destino}</span>
            )}
            <p className="text-sm text-rink-700 whitespace-pre-line">{c.contenido}</p>
          </div>
        ))}
        {(!comunicados || comunicados.length === 0) && (
          <p className="text-sm text-rink-700/60">No hay comunicados publicados todavía.</p>
        )}
      </div>
    </div>
  );
}
