import { createClient } from "@/lib/supabase/server";
import { periodoActual } from "@/lib/pagos";
import PagosClient from "./PagosClient";

export default async function AdminPagosPage({
  searchParams,
}: {
  searchParams: { periodo?: string };
}) {
  const supabase = createClient();
  const periodo = searchParams.periodo || periodoActual();

  const { data: alumnas } = await supabase
    .from("alumnas")
    .select("id, nombre, monto_mensualidad, categoria")
    .eq("activa", true)
    .order("nombre");

  const { data: pagosDelMes } = await supabase
    .from("pagos")
    .select("*")
    .eq("periodo", periodo);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-rink-900">Pagos</h1>
        <p className="text-rink-700/70 text-sm mt-1">
          Genera el cobro mensual y marca manualmente quién ha transferido.
        </p>
      </div>
      <PagosClient
        alumnas={alumnas ?? []}
        pagosDelMes={pagosDelMes ?? []}
        periodo={periodo}
      />
    </div>
  );
}
