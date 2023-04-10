import React from "react";

// Consumption Point status is in pending for validation by the admin of the platform
export default function CPAccepted() {
  return (
    <div>
      <div className="text-3xl">¡Petición aceptada!</div>

      <div>
        <div className="text-lg">
          El equipo de cervezanas ha recibido tu solicitud para participar como
          punto de consumo certificado. Estamos revisando la información que nos
          has hecho llegar. ¡Te mantendremos informado lo antes posible!
        </div>
      </div>

      <div className="mt-4">
        <span className="text-3xl">
          ¡Muchas gracias por confiar en nosotros!
        </span>
      </div>
    </div>
  );
}
