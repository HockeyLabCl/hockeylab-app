import NavBar from "@/components/NavBar";
import { createClient } from "@/lib/supabase/server";

export default async function ApoderadoLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let badges = { comunicados: false, pagos: false, asistencia: false };

  if (user) {
    const { data: visitas } = await supabase
      .from("ultimas_visitas")
      .select("*")
      .eq("apoderado_id", user.id)
      .maybeSingle();

    const comunicadosVisto = visitas?.comunicados_visto_at ?? "2000-01-01";
    const pagosVisto = visitas?.pagos_visto_at ?? "2000-01-01";
    const asistenciaVisto = visitas?.asistencia_visto_at ?? "2000-01-01";

    const { data: alumnas } = await supabase
      .from("alumnas")
      .select("id, categoria, pagos(updated_at), asistencia(created_at)")
      .eq("apoderado_id", user.id);

    const categorias = (alumnas ?? []).map((a) => a.categoria);

    const { data: comunicados } = await supabase
      .from("comunicados")
      .select("created_at, categoria_destino")
      .order("created_at", { ascending: false })
      .limit(10);

    const hayComunicadoNuevo = (comunicados ?? []).some(
      (c) =>
        (!c.categoria_destino || categorias.includes(c.categoria_destino)) &&
        c.created_at > comunicadosVisto
    );

    const ultimoPago = (alumnas ?? [])
      .flatMap((a: any) => a.pagos ?? [])
      .reduce((max: string, p: any) => (p.updated_at > max ? p.updated_at : max), "2000-01-01");

    const ultimaAsistencia = (alumnas ?? [])
      .flatMap((a: any) => a.asistencia ?? [])
      .reduce((max: string, r: any) => (r.created_at > max ? r.created_at : max), "2000-01-01");

    badges = {
      comunicados: hayComunicadoNuevo,
      pagos: ultimoPago > pagosVisto,
      asistencia: ultimaAsistencia > asistenciaVisto,
    };
  }

  const links = [
    { href: "/apoderado", label: "Resumen" },
    { href: "/apoderado/alumna", label: "Ficha de mi hija" },
    { href: "/apoderado/pagos", label: "Pagos", nuevo: badges.pagos },
    { href: "/apoderado/asistencia", label: "Asistencia", nuevo: badges.asistencia },
    { href: "/apoderado/comunicados", label: "Comunicados", nuevo: badges.comunicados },
  ];

  return (
    <div>
      <NavBar role="apoderado" links={links} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
