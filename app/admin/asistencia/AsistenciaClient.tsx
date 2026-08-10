"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AsistenciaClient({
  alumnas,
  registros,
  fecha,
}: {
  alumnas: any[];
  registros: any[];
  fecha: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const porAlumna = new Map(registros.map((r) => [r.alumna_id, r]));

  async function toggle(alumnaId: string, presente: boolean) {
    const existente = porAlumna.get(alumnaId);
    if (existente) {
      await supabase.from("asistencia").update({ presente }).eq("id", existente.id);
    } else {
      await supabase.from("asistencia").insert({ alumna_id: alumnaId, fecha, presente });
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm px-5 py-3 flex items-center gap-3">
        <label className="text-sm font-medium text-rink-700">Fecha del entrenamiento</label>
        <input
          type="date"
          defaultValue={fecha}
          onChange={(e) => router.push(`/admin/asistencia?fecha=${e.target.value}`)}
          className="border border-rink-700/20 rounded-lg px-3 py-1.5 text-sm"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {alumnas.map((a) => {
          const r = porAlumna.get(a.id);
          return (
            <div key={a.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="font-medium text-rink-900 text-sm">{a.nombre}</p>
                <p className="text-xs text-rink-700/60">{a.categoria}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggle(a.id, true)}
                  className={
                    r?.presente === true
                      ? "badge badge-ok"
                      : "badge bg-rink-100 text-rink-700/60"
                  }
                >
                  Presente
                </button>
                <button
                  onClick={() => toggle(a.id, false)}
                  className={
                    r?.presente === false
                      ? "badge badge-atrasado"
                      : "badge bg-rink-100 text-rink-700/60"
                  }
                >
                  Ausente
                </button>
              </div>
            </div>
          );
        })}
        {alumnas.length === 0 && (
          <p className="px-5 py-4 text-sm text-rink-700/60">No hay alumnas registradas.</p>
        )}
      </div>
    </div>
  );
}
