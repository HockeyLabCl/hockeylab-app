import { createClient } from "@/lib/supabase/server";
import {
  situacionAlumna,
  formatCLP,
  nombreMes,
  BADGE_TEXT,
  BADGE_CLASS,
} from "@/lib/pagos";
import QRCode from "@/components/QRCode";

export default async function PagosApoderadoPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: alumnas } = await supabase
    .from("alumnas")
    .select("id, nombre, monto_mensualidad, pagos(periodo, estado, monto, fecha_pago, metodo)")
    .eq("apoderado_id", user!.id);

  const { data: datosPago } = await supabase.from("datos_pago").select("*").single();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-rink-900">Pagos</h1>
        <p className="text-rink-700/70 text-sm mt-1">
          Los pagos se registran manualmente por la administración una vez recibida tu transferencia.
        </p>
      </div>

      {alumnas?.map((a) => {
        const pagos = ((a.pagos as any[]) || []).sort((x, y) => (x.periodo < y.periodo ? 1 : -1));
        const sit = situacionAlumna(pagos);

        return (
          <div key={a.id} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-rink-900">{a.nombre}</p>
              <span className={BADGE_CLASS[sit.estado]}>{BADGE_TEXT[sit.estado]}</span>
            </div>

            <div className="divide-y border-t border-rink-100">
              {pagos.map((p) => (
                <div key={p.periodo} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-rink-900">{nombreMes(p.periodo)}</span>
                  <span className="text-rink-700/60">{formatCLP(p.monto)}</span>
                  <span
                    className={
                      p.estado === "pagado"
                        ? "text-turf-500 font-medium"
                        : "text-alert-amber font-medium"
                    }
                  >
                    {p.estado === "pagado" ? `Pagado ✓ ${p.fecha_pago ?? ""}` : "Sin registrar"}
                  </span>
                </div>
              ))}
              {pagos.length === 0 && (
                <p className="text-sm text-rink-700/60 py-2.5">
                  Todavía no hay meses registrados para esta alumna.
                </p>
              )}
            </div>
          </div>
        );
      })}

      <div className="bg-rink-900 text-white rounded-xl shadow-sm p-6">
        <h2 className="font-display text-xl tracking-wide mb-4">Datos para transferencia</h2>
        <div className="grid sm:grid-cols-2 gap-6 items-start">
          <dl className="space-y-2 text-sm">
            <Row label="Nombre / titular" value={datosPago?.nombre_titular} />
            <Row label="RUT" value={datosPago?.rut_titular} />
            <Row label="Banco" value={datosPago?.banco} />
            <Row label="Tipo de cuenta" value={datosPago?.tipo_cuenta} />
            <Row label="N° de cuenta" value={datosPago?.numero_cuenta} />
            <Row label="Correo para comprobante" value={datosPago?.email_pago} />
            {datosPago?.instrucciones_adicionales && (
              <p className="pt-2 text-rink-100/70">{datosPago.instrucciones_adicionales}</p>
            )}
          </dl>
          <div className="bg-white rounded-lg p-4 flex flex-col items-center gap-2 justify-self-start">
            {datosPago?.qr_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={datosPago.qr_image_url} alt="Código QR de pago" className="w-40 h-40 object-contain" />
            ) : (
              <QRCode
                value={
                  datosPago?.numero_cuenta
                    ? `Cuenta ${datosPago.numero_cuenta} - ${datosPago.banco ?? ""}`
                    : "Datos de pago no configurados"
                }
              />
            )}
            <p className="text-xs text-rink-900/60">Escanea para copiar los datos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-rink-100/60">{label}</dt>
      <dd className="font-medium">{value || "—"}</dd>
    </div>
  );
}
