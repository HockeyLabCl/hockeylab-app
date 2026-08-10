import NavBar from "@/components/NavBar";

const links = [
  { href: "/apoderado", label: "Resumen" },
  { href: "/apoderado/alumna", label: "Ficha de mi hija" },
  { href: "/apoderado/pagos", label: "Pagos" },
  { href: "/apoderado/asistencia", label: "Asistencia" },
  { href: "/apoderado/comunicados", label: "Comunicados" },
];

export default function ApoderadoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavBar role="apoderado" links={links} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
