import React from "react";
import { useTranslation } from "react-i18next";
import { Profile } from "../../../lib/types";
import { Button } from "../../common";
import { SubmitCPOrganizer } from "../../modals";

interface props {
  profile: Profile;
}

export function ConsumptionPoints({ profile: { isCPOrganizer } }: props) {
  const { t } = useTranslation();

  const handleClick = () => {};

  return (
    <div className="py-6 px-4 " aria-label="ConsumptionPoints">
      <div className="flex flex-col">
        <div className="text-4xl pr-12">{t("consumption_points")}</div>

        {isCPOrganizer ? (
          <div className="text-2xl pr-12">
            {t("consumption_points_organizer")}
          </div>
        ) : (
          <div>
            <div className="text-lg text-beer-dark bg-beer-foam p-2 mt-4">
              {t("consumption_points_description")}
            </div>

            <div>
              <p>
                Date de alta a través de nuestro formulario para obtener el
                título de organizador de puntos cervezanas{" "}
              </p>
              <p>
                Con él tendrás la potestad de organizar eventos y promociones
                usando la marca de Cervezanas como respaldo. Podrás añadir tus
                propios puntos de consumo a la plataforma haciéndolos públicos
                para los demás cervezanos.
              </p>
            </div>

            {/* Modal with form to register as a consumption point organizer  */}
            <div className="pr-12 pt-6">
              <SubmitCPOrganizer />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
