import { createClient } from "@/lib/supabase/server";
import ConfigClient from "./ConfigClient";

export default async function AdminConfigPage() {
  const supabase = createClient();
  const { data: datosPago } = await supabase.from("datos_pago").select("*").single();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-rink-900">Datos de pago</h1>
        <p className="text-rink-700/70 text-sm mt-1">
          Estos datos se muestran a todos los apoderados en su sección de pagos.
        </p>
      </div>
      <ConfigClient datosPago={datosPago} />
    </div>
  );
}
