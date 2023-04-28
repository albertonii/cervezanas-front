import React, { useState } from "react";
import { IConsumptionPoints } from "../../../lib/types.d";
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
        return <CPMobile cpsId={cps.id} cpMobile={cps.cp_mobile} />;
    }
  };

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  return (
    <>
      <div className="text-3xl">¡Petición aceptada!</div>

      <div>
        <div className="max-w-3xl text-lg">
          El equipo de cervezanas ha recibido tu solicitud para participar como
          punto de consumo certificado y has sido admitido. Ahora podrás usar
          los paneles de control para gestionar tu punto de consumo.
        </div>
      </div>

      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={["cp_fixed", "cp_mobile"]}
      />

      {renderSwitch()}
    </>
  );
}
