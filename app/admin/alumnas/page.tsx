import { createClient } from "@/lib/supabase/server";
import AlumnasClient from "./AlumnasClient";

export default async function AdminAlumnasPage() {
  const supabase = createClient();

  const { data: alumnas } = await supabase
    .from("alumnas")
    .select("*, profiles!alumnas_apoderado_id_fkey(nombre)")
    .order("nombre");

  const { data: apoderados } = await supabase
    .from("profiles")
    .select("id, nombre")
    .eq("role", "apoderado")
    .order("nombre");

  const { data: logins } = await supabase.rpc("admin_ultimos_logins");
  const loginsPorId = new Map((logins ?? []).map((l: any) => [l.id, l.last_sign_in_at]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-rink-900">Alumnas</h1>
        <p className="text-rink-700/70 text-sm mt-1">
          Crea fichas de alumnas y asígnalas a la cuenta de su apoderado.
        </p>
      </div>
      <AlumnasClient
        alumnas={alumnas ?? []}
        apoderados={apoderados ?? []}
        loginsPorId={Object.fromEntries(loginsPorId)}
      />
    </div>
  );
}
