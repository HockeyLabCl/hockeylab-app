"use client";

import { useState } from "react";

export default function CopiarDatosPago({ datosPago }: { datosPago: any }) {
  const [copiado, setCopiado] = useState(false);

  async function handleCopiar() {
    const texto = [
      datosPago?.nombre_titular && `Nombre: ${datosPago.nombre_titular}`,
      datosPago?.rut_titular && `RUT: ${datosPago.rut_titular}`,
      datosPago?.banco && `Banco: ${datosPago.banco}`,
      datosPago?.tipo_cuenta && `Tipo de cuenta: ${datosPago.tipo_cuenta}`,
      datosPago?.numero_cuenta && `N° de cuenta: ${datosPago.numero_cuenta}`,
      datosPago?.email_pago && `Correo para comprobante: ${datosPago.email_pago}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      alert("No se pudo copiar automáticamente. Puedes seleccionar y copiar los datos a mano.");
    }
  }

  return (
    <button
      onClick={handleCopiar}
      className="text-sm font-medium bg-white/10 hover:bg-white/20 transition text-white rounded-lg px-4 py-2"
    >
      {copiado ? "Copiado ✓" : "Copiar todos los datos"}
    </button>
  );
}
