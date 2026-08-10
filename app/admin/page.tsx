import { createClient } from "@/lib/supabase/server";
import { situacionAlumna } from "@/lib/pagos";

export default async function AdminResumen() {
  const supabase = createClient();

  const { data: alumnas } = await supabase
    .from("alumnas")
    .select("id, nombre, pagos(periodo, estado)")
    .eq("activa", true);

  const { count: totalComunicados } = await supabase
    .from("comunicados")
    .select("id", { count: "exact", head: true });

  const conDeuda = (alumnas || []).filter(
    (a) => situacionAlumna(a.pagos as any).estado === "atrasado"
  ).length;
  const alDia = (alumnas || []).filter(
    (a) => situacionAlumna(a.pagos as any).estado === "al_dia"
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-rink-900">Resumen</h1>
        <p className="text-rink-700/70 text-sm mt-1">Vista general de la academia.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Alumnas activas" value={alumnas?.length ?? 0} />
        <Stat label="Al día" value={alDia} accent="text-turf-500" />
        <Stat label="Con deuda" value={conDeuda} accent="text-alert-red" />
        <Stat label="Comunicados" value={totalComunicados ?? 0} />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <p className={`font-display text-4xl tracking-wide ${accent ?? "text-rink-900"}`}>
        {value}
      </p>
      <p className="text-sm text-rink-700/60 mt-1">{label}</p>
    </div>
  );
}
