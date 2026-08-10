"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatCLP, nombreMes } from "@/lib/pagos";

export default function PagosClient({
  alumnas,
  pagosDelMes,
  periodo,
}: {
  alumnas: any[];
  pagosDelMes: any[];
  periodo: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [generando, setGenerando] = useState(false);

  const pagosPorAlumna = new Map(pagosDelMes.map((p) => [p.alumna_id, p]));
  const faltantes = alumnas.filter((a) => !pagosPorAlumna.has(a.id));

  async function generarCobros() {
    setGenerando(true);
    const nuevos = faltantes.map((a) => ({
      alumna_id: a.id,
      periodo,
      monto: a.monto_mensualidad,
      estado: "pendiente",
    }));
    if (nuevos.length > 0) await supabase.from("pagos").insert(nuevos);
    setGenerando(false);
    router.refresh();
  }

  async function marcarPagado(pagoId: string, alumnaId: string, monto: number) {
    const metodo = prompt("¿Cómo pagó? (transferencia / efectivo / otro)", "transferencia");
    if (metodo === null) return;
    if (pagoId) {
      await supabase
        .from("pagos")
        .update({
          estado: "pagado",
          fecha_pago: new Date().toISOString().slice(0, 10),
          metodo,
        })
        .eq("id", pagoId);
    } else {
      await supabase.from("pagos").insert({
        alumna_id: alumnaId,
        periodo,
        monto,
        estado: "pagado",
        fecha_pago: new Date().toISOString().slice(0, 10),
        metodo,
      });
    }
    router.refresh();
  }

  async function marcarPendiente(pagoId: string) {
    await supabase
      .from("pagos")
      .update({ estado: "pendiente", fecha_pago: null, metodo: null })
      .eq("id", pagoId);
    router.refresh();
  }

  function cambiarMes(delta: number) {
    const [y, m] = periodo.split("-").map(Number);
    const fecha = new Date(y, m - 1 + delta, 1);
    const nuevo = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-01`;
    router.push(`/admin/pagos?periodo=${nuevo}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm px-5 py-3">
        <button onClick={() => cambiarMes(-1)} className="text-rink-700 hover:text-rink-900">
          ← Mes anterior
        </button>
        <p className="font-display text-lg tracking-wide text-rink-900">{nombreMes(periodo)}</p>
        <button onClick={() => cambiarMes(1)} className="text-rink-700 hover:text-rink-900">
          Mes siguiente →
        </button>
      </div>

      {faltantes.length > 0 && (
        <button
          onClick={generarCobros}
          disabled={generando}
          className="bg-turf-500 hover:opacity-90 transition text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          {generando
            ? "Generando..."
            : `Generar cobro de ${nombreMes(periodo)} para ${faltantes.length} alumna(s)`}
        </button>
      )}

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {alumnas.map((a) => {
          const pago = pagosPorAlumna.get(a.id);
          const pagado = pago?.estado === "pagado";
          return (
            <div key={a.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="font-medium text-rink-900 text-sm">{a.nombre}</p>
                <p className="text-xs text-rink-700/60">
                  {a.categoria} · {formatCLP(a.monto_mensualidad)}
                </p>
              </div>
              {pagado ? (
                <button
                  onClick={() => marcarPendiente(pago.id)}
                  className="badge badge-ok"
                  title="Click para deshacer"
                >
                  Pagado ✓
                </button>
              ) : (
                <button
                  onClick={() => marcarPagado(pago?.id, a.id, a.monto_mensualidad)}
                  className="badge badge-pendiente hover:opacity-80"
                >
                  Marcar como pagado
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
