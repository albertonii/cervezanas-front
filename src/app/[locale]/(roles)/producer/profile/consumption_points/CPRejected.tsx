import React from "react";

// Consumption Point status is in pending for validation by the admin of the platform
export function CPRejected() {
  return (
    <div className="space-y-6">
      <div className="text-3xl">Petición denegada</div>

      <div>
        <div className="text-lg">
          El equipo de cervezanas ha recibido tu solicitud para participar como
          punto de consumo certificado y, lamentablemente no ha sido posible su
          aprobación.
        </div>

        <div className="text-lg">
          Si crees que se trata de un error, por favor, ponte en contacto con
          nosotros a través de nuestro formulario de contacto.
        </div>

        <div className="text-lg">
          Gracias por tu interés en Cervezanas y esperamos que pronto puedas
          formar parte de nuestra comunidad como Punto de Consumo Certificado.
        </div>
      </div>
    </div>
  );
}
