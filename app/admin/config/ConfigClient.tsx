"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ConfigClient({ datosPago }: { datosPago: any }) {
  const supabase = createClient();
  const [form, setForm] = useState({
    nombre_titular: datosPago?.nombre_titular ?? "",
    rut_titular: datosPago?.rut_titular ?? "",
    banco: datosPago?.banco ?? "",
    tipo_cuenta: datosPago?.tipo_cuenta ?? "",
    numero_cuenta: datosPago?.numero_cuenta ?? "",
    email_pago: datosPago?.email_pago ?? "",
    qr_image_url: datosPago?.qr_image_url ?? "",
    instrucciones_adicionales: datosPago?.instrucciones_adicionales ?? "",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await supabase.from("datos_pago").update(form).eq("id", 1);
    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm p-6 grid sm:grid-cols-2 gap-4">
      <Field label="Nombre / titular">
        <input
          className="input"
          value={form.nombre_titular}
          onChange={(e) => setForm({ ...form, nombre_titular: e.target.value })}
        />
      </Field>
      <Field label="RUT">
        <input
          className="input"
          value={form.rut_titular}
          onChange={(e) => setForm({ ...form, rut_titular: e.target.value })}
        />
      </Field>
      <Field label="Banco">
        <input
          className="input"
          value={form.banco}
          onChange={(e) => setForm({ ...form, banco: e.target.value })}
        />
      </Field>
      <Field label="Tipo de cuenta">
        <input
          className="input"
          value={form.tipo_cuenta}
          onChange={(e) => setForm({ ...form, tipo_cuenta: e.target.value })}
        />
      </Field>
      <Field label="Número de cuenta">
        <input
          className="input"
          value={form.numero_cuenta}
          onChange={(e) => setForm({ ...form, numero_cuenta: e.target.value })}
        />
      </Field>
      <Field label="Correo para comprobante">
        <input
          className="input"
          value={form.email_pago}
          onChange={(e) => setForm({ ...form, email_pago: e.target.value })}
        />
      </Field>
      <Field label="URL de imagen QR (opcional)">
        <input
          className="input"
          placeholder="https://..."
          value={form.qr_image_url}
          onChange={(e) => setForm({ ...form, qr_image_url: e.target.value })}
        />
      </Field>
      <div className="sm:col-span-2 space-y-1.5">
        <label className="text-sm font-medium text-rink-700">Instrucciones adicionales</label>
        <textarea
          className="input"
          rows={2}
          value={form.instrucciones_adicionales}
          onChange={(e) => setForm({ ...form, instrucciones_adicionales: e.target.value })}
        />
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-rink-900 hover:bg-rink-700 transition text-white font-medium rounded-lg px-5 py-2 text-sm"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
        {saved && <span className="text-sm text-turf-500">Guardado ✓</span>}
      </div>
      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid rgba(19, 78, 74, 0.2);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-rink-700">{label}</label>
      {children}
    </div>
  );
}
