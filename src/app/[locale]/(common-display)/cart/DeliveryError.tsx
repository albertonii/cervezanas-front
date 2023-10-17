import React from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DeliveryError() {
  return (
    <section className="flex max-w-xs items-center gap-6 rounded border-red-800 bg-red-100 px-4 py-2 shadow-md ring-1 ring-red-800 sm:max-w-lg lg:max-w-3xl">
      <FontAwesomeIcon
        icon={faCircleExclamation}
        style={{ color: "red", height: "50px", width: "50px" }}
        title={"Delivery not allowed"}
      />

      <span className="sm:text-md text-balance text-sm text-red-800">
        Lo sentimos, este artículo no se puede enviar a la dirección
        seleccionada. Cambia la dirección de envío o elimina el artículo de tu
        pedido.
      </span>
    </section>
  );
}
