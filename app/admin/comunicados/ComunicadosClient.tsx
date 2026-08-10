"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIAS = ["Todas", "Sub10", "Sub12", "Sub14", "Sub16", "Primera"];

export default function ComunicadosClient({ comunicados }: { comunicados: any[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({ titulo: "", contenido: "", categoria_destino: "Todas" });
  const [saving, setSaving] = useState(false);

  async function handlePublicar(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("comunicados").insert({
      titulo: form.titulo,
      contenido: form.contenido,
      categoria_destino: form.categoria_destino === "Todas" ? null : form.categoria_destino,
      autor_id: user?.id,
    });
    setSaving(false);
    setForm({ titulo: "", contenido: "", categoria_destino: "Todas" });
    router.refresh();
  }

  async function handleEliminar(id: string) {
    if (!confirm("¿Eliminar este comunicado?")) return;
    await supabase.from("comunicados").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handlePublicar} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-rink-700">Título</label>
          <input
            required
            className="w-full rounded-lg border border-rink-700/20 px-3 py-2"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-rink-700">Mensaje</label>
          <textarea
            required
            rows={4}
            className="w-full rounded-lg border border-rink-700/20 px-3 py-2"
            value={form.contenido}
            onChange={(e) => setForm({ ...form, contenido: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-rink-700">Dirigido a</label>
          <select
            className="rounded-lg border border-rink-700/20 px-3 py-2"
            value={form.categoria_destino}
            onChange={(e) => setForm({ ...form, categoria_destino: e.target.value })}
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-rink-900 hover:bg-rink-700 transition text-white font-medium rounded-lg px-5 py-2 text-sm"
        >
          {saving ? "Publicando..." : "Publicar comunicado"}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {comunicados.map((c) => (
          <div key={c.id} className="px-5 py-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-rink-900 text-sm">{c.titulo}</p>
              <button
                onClick={() => handleEliminar(c.id)}
                className="text-xs text-alert-red hover:underline"
              >
                Eliminar
              </button>
            </div>
            <p className="text-xs text-rink-700/50 mt-0.5">
              {new Date(c.created_at).toLocaleDateString("es-CL")}
              {c.categoria_destino ? ` · ${c.categoria_destino}` : " · Todas las categorías"}
            </p>
          </div>
        ))}
        {comunicados.length === 0 && (
          <p className="px-5 py-4 text-sm text-rink-700/60">No hay comunicados publicados.</p>
        )}
      </div>
    </div>
  );
}
