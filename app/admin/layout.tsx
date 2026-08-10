import NavBar from "@/components/NavBar";

const links = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/alumnas", label: "Alumnas" },
  { href: "/admin/pagos", label: "Pagos" },
  { href: "/admin/asistencia", label: "Asistencia" },
  { href: "/admin/comunicados", label: "Comunicados" },
  { href: "/admin/config", label: "Datos de pago" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavBar role="admin" links={links} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
