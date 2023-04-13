import React, { useState } from "react";
import { IConsumptionPoints } from "../../../lib/types";
import HorizontalSections from "../../common/HorizontalSections";
import CPFixed from "./CPFixed";
import CPMobile from "./CPMobile";

interface Props {
  cps: IConsumptionPoints;
}

// Consumption Point status is in pending for validation by the admin of the platform
export default function CPAccepted({ cps }: Props) {
  const [menuOption, setMenuOption] = useState<string>("cp_fixed");

  const renderSwitch = () => {
    switch (menuOption) {
      case "cp_fixed":
        return <CPFixed cpFixed={cps.cp_fixed} cpsId={cps.id} />;
      case "cp_mobile":
        return <CPMobile />;
    }
  };

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  return (
    <>
      <div className="text-3xl">¡Petición aceptada!</div>

      <div>
        <div className="text-lg max-w-3xl">
          El equipo de cervezanas ha recibido tu solicitud para participar como
          punto de consumo certificado y has sido admitido. Ahora podrás usar
          los paneles de control para gestionar tu punto de consumo.
        </div>
      </div>

      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={["cp_fixed", "cp_mobile"]}
      />

      <div className="container">{renderSwitch()}</div>
    </>
  );
}
