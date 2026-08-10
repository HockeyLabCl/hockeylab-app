"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIAS = ["Sub10", "Sub12", "Sub14", "Sub16", "Primera"];

export default function AlumnasClient({
  alumnas,
  apoderados,
}: {
  alumnas: any[];
  apoderados: any[];
}) {
  const supabase = createClient();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    fecha_nacimiento: "",
    categoria: CATEGORIAS[0],
    apoderado_id: apoderados[0]?.id ?? "",
    monto_mensualidad: 0,
    contacto_emergencia_nombre: "",
    contacto_emergencia_telefono: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("alumnas").insert(form);
    setSaving(false);
    setShowForm(false);
    setForm({ ...form, nombre: "", fecha_nacimiento: "" });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta alumna? Esta acción no se puede deshacer.")) return;
    await supabase.from("alumnas").delete().eq("id", id);
    router.refresh();
  }

  if (apoderados.length === 0) {
    return (
      <p className="text-sm bg-alert-amber/10 text-alert-amber rounded-lg px-4 py-3">
        Primero debes crear cuentas de apoderados desde Supabase (Authentication → Users →
        Invite user) para poder asignarles una alumna aquí.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-rink-900 hover:bg-rink-700 transition text-white text-sm font-medium rounded-lg px-4 py-2"
      >
        {showForm ? "Cancelar" : "+ Nueva alumna"}
      </button>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm p-6 grid sm:grid-cols-2 gap-4">
          <Field label="Nombre completo">
            <input
              required
              className="input"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </Field>
          <Field label="Fecha de nacimiento">
            <input
              type="date"
              className="input"
              value={form.fecha_nacimiento}
              onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
            />
          </Field>
          <Field label="Categoría">
            <select
              className="input"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Apoderado">
            <select
              className="input"
              value={form.apoderado_id}
              onChange={(e) => setForm({ ...form, apoderado_id: e.target.value })}
            >
              {apoderados.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Mensualidad (CLP)">
            <input
              type="number"
              className="input"
              value={form.monto_mensualidad}
              onChange={(e) =>
                setForm({ ...form, monto_mensualidad: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Contacto de emergencia">
            <input
              className="input"
              value={form.contacto_emergencia_nombre}
              onChange={(e) =>
                setForm({ ...form, contacto_emergencia_nombre: e.target.value })
              }
            />
          </Field>
          <Field label="Teléfono de emergencia">
            <input
              className="input"
              value={form.contacto_emergencia_telefono}
              onChange={(e) =>
                setForm({ ...form, contacto_emergencia_telefono: e.target.value })
              }
            />
          </Field>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-turf-500 hover:opacity-90 transition text-white font-medium rounded-lg px-5 py-2 text-sm"
            >
              {saving ? "Guardando..." : "Crear alumna"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {alumnas.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="font-medium text-rink-900 text-sm">{a.nombre}</p>
              <p className="text-xs text-rink-700/60">
                {a.categoria} · Apoderado: {a.profiles?.nombre ?? "—"}
              </p>
            </div>
            <button
              onClick={() => handleDelete(a.id)}
              className="text-xs text-alert-red hover:underline"
            >
              Eliminar
            </button>
          </div>
        ))}
        {alumnas.length === 0 && (
          <p className="px-5 py-4 text-sm text-rink-700/60">No hay alumnas registradas.</p>
        )}
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid rgba(19, 78, 74, 0.2);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
        }
      `}</style>
    </div>
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
