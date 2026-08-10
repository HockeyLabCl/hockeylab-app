export function formatCLP(monto: number) {
  return monto.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

export function nombreMes(periodo: string) {
  const [year, month] = periodo.split("-");
  const fecha = new Date(Number(year), Number(month) - 1, 1);
  const nombre = fecha.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

export function periodoActual() {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-01`;
}

/**
 * Dado un listado de pagos de una alumna, determina su situación general:
 * - "atrasado": tiene al menos un mes anterior al actual sin pagar
 * - "pendiente": el mes actual no está pagado (pero no hay deuda previa)
 * - "al_dia": el mes actual está pagado
 */
export function situacionAlumna(pagos: { periodo: string; estado: string }[]) {
  const hoyPeriodo = periodoActual();
  const atrasados = pagos.filter((p) => p.periodo < hoyPeriodo && p.estado !== "pagado");
  const pagoMesActual = pagos.find((p) => p.periodo === hoyPeriodo);

  if (atrasados.length > 0) return { estado: "atrasado" as const, meses: atrasados.length };
  if (!pagoMesActual || pagoMesActual.estado !== "pagado")
    return { estado: "pendiente" as const, meses: 0 };
  return { estado: "al_dia" as const, meses: 0 };
}

export const BADGE_TEXT: Record<string, string> = {
  al_dia: "Al día",
  pendiente: "Pendiente",
  atrasado: "Con deuda",
};

export const BADGE_CLASS: Record<string, string> = {
  al_dia: "badge badge-ok",
  pendiente: "badge badge-pendiente",
  atrasado: "badge badge-atrasado",
};
