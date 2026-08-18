"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MarcarVisto({
  seccion,
}: {
  seccion: "comunicados" | "pagos" | "asistencia";
}) {
  useEffect(() => {
    async function marcar() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("ultimas_visitas")
        .upsert(
          { apoderado_id: user.id, [`${seccion}_visto_at`]: new Date().toISOString() },
          { onConflict: "apoderado_id" }
        );
    }
    marcar();
  }, [seccion]);

  return null;
}
