"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/Avatar";

function formatFecha(fecha?: string | null) {
  if (!fecha) return "No registrada";
  return new Date(fecha + "T00:00:00").toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function FichaForm({ alumna }: { alumna: any }) {
  const supabase = createClient();
  const [form, setForm] = useState({
    contacto_emergencia_nombre: alumna.contacto_emergencia_nombre ?? "",
    contacto_emergencia_telefono: alumna.contacto_emergencia_telefono ?? "",
    alergias_observaciones: alumna.alergias_observaciones ?? "",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await supabase.from("alumnas").update(form).eq("id", alumna.id);
    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
      <div className="flex items-center gap-4">
        <Avatar src={alumna.foto_url} size="lg" />
        <div>
          <p className="font-semibold text-lg text-rink-900">{alumna.nombre}</p>
          <p className="text-sm text-rink-700/60">{alumna.categoria}</p>
          <p className="text-sm text-rink-700/60">
            Nacimiento: {formatFecha(alumna.fecha_nacimiento)}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-rink-700">
            Contacto de emergencia (nombre)
          </label>
          <input
            className="w-full rounded-lg border border-rink-700/20 px-3 py-2"
            value={form.contacto_emergencia_nombre}
            onChange={(e) =>
              setForm({ ...form, contacto_emergencia_nombre: e.target.value })
            }
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-rink-700">Teléfono de emergencia</label>
          <input
            className="w-full rounded-lg border border-rink-700/20 px-3 py-2"
            value={form.contacto_emergencia_telefono}
            onChange={(e) =>
              setForm({ ...form, contacto_emergencia_telefono: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-rink-700">
          Alergias / observaciones médicas
        </label>
        <textarea
          className="w-full rounded-lg border border-rink-700/20 px-3 py-2"
          rows={3}
          value={form.alergias_observaciones}
          onChange={(e) => setForm({ ...form, alergias_observaciones: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-rink-900 hover:bg-rink-700 transition text-white font-medium rounded-lg px-5 py-2 text-sm disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
        {saved && <span className="text-sm text-turf-500">Guardado ✓</span>}
      </div>
    </form>
  );
}
