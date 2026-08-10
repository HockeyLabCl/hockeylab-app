import { createClient } from "@/lib/supabase/server";
import ComunicadosClient from "./ComunicadosClient";

export default async function AdminComunicadosPage() {
  const supabase = createClient();
  const { data: comunicados } = await supabase
    .from("comunicados")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-rink-900">Comunicados</h1>
        <p className="text-rink-700/70 text-sm mt-1">
          Publica avisos que verán todos los apoderados.
        </p>
      </div>
      <ComunicadosClient comunicados={comunicados ?? []} />
    </div>
  );
}
