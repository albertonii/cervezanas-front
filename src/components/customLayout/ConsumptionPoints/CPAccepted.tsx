import React, { useState } from "react";
import HorizontalSections from "../../common/HorizontalSections";
import CPFixed from "./CPFixed";
import CPMobile from "./CPMobile";
import AutoComplete from "react-google-autocomplete";
import CPGoogleMap from "./CPGoogleMap";

// Consumption Point status is in pending for validation by the admin of the platform
export default function CPAccepted() {
  const [menuOption, setMenuOption] = useState<string>("cp_fixed");

  const renderSwitch = () => {
    switch (menuOption) {
      case "cp_fixed":
        return <CPFixed />;
      case "cp_mobile":
        return <CPMobile />;
    }
  };

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  return (
    <div className="h-[50vh]">
      <div className="text-3xl">¡Petición aceptada!</div>

      <div>
        <div className="text-lg max-w-3xl">
          El equipo de cervezanas ha recibido tu solicitud para participar como
          punto de consumo certificado y has sido admitido. Ahora podrás usar
          los paneles de control para gestionar tu punto de consumo.
        </div>
      </div>
      {/* 
      <AutoComplete
        apiKey={"AIzaSyAKy3WmKXNpusaPjszA5IZA-jABYT5lHss"}
        onPlaceSelected={(place: any) => console.log(place)}
      /> */}

      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={["cp_fixed", "cp_mobile"]}
      />

      <div className="container">{renderSwitch()}</div>

      <CPGoogleMap />
    </div>
  );
}
