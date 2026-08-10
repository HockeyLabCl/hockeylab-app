import { createClient } from "@/lib/supabase/server";
import FichaForm from "./FichaForm";

export default async function FichaAlumnaPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: alumnas } = await supabase
    .from("alumnas")
    .select("*")
    .eq("apoderado_id", user!.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-rink-900">Ficha de mi hija</h1>
        <p className="text-rink-700/70 text-sm mt-1">
          Mantén al día los datos de contacto de emergencia y observaciones médicas.
        </p>
      </div>

      {alumnas?.map((a) => (
        <FichaForm key={a.id} alumna={a} />
      ))}

      {(!alumnas || alumnas.length === 0) && (
        <p className="text-rink-700/60 text-sm">
          No hay ninguna alumna asociada a tu cuenta todavía.
        </p>
      )}
    </div>
  );
}
