import { createClient } from "@/lib/supabase/server";
import AsistenciaClient from "./AsistenciaClient";

export default async function AdminAsistenciaPage({
  searchParams,
}: {
  searchParams: { fecha?: string };
}) {
  const supabase = createClient();
  const fecha = searchParams.fecha || new Date().toISOString().slice(0, 10);

  const { data: alumnas } = await supabase
    .from("alumnas")
    .select("id, nombre, categoria")
    .eq("activa", true)
    .order("nombre");

  const { data: registros } = await supabase.from("asistencia").select("*").eq("fecha", fecha);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-rink-900">Asistencia</h1>
        <p className="text-rink-700/70 text-sm mt-1">
          Marca la asistencia del entrenamiento del día.
        </p>
      </div>
      <AsistenciaClient alumnas={alumnas ?? []} registros={registros ?? []} fecha={fecha} />
    </div>
  );
}
