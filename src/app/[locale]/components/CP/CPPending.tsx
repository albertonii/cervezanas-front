import React from "react";

// Consumption Point status is in pending for validation by the admin of the platform
export function CPPending() {
  return (
    <section className="space-y-4">
      <p className="mt-4 text-3xl">¡Muchas gracias por confiar en nosotros!</p>

      <p className="text-3xl">Petición pendiente de validación</p>

      <p className="text-lg">
        El equipo de cervezanas ha recibido tu solicitud para participar como
        punto de consumo certificado. Estamos revisando la información que nos
        has hecho llegar. ¡Te mantendremos informado lo antes posible!
      </p>
    </section>
  );
}
