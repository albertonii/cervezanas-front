import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IConsumptionPoints, Profile } from "../../../lib/types";
import { SubmitCPOrganizer } from "../../modals";
import CPAccepted from "./CPAccepted";
import CPPending from "./CPPending";
import CPRejected from "./CPRejected";

interface Props {
  profile: Profile;
  cps: IConsumptionPoints;
}

export function ConsumptionPoints({
  profile: { cp_organizer_status },
  cps,
}: Props) {
  const { t } = useTranslation();

  const [cpOrganizerStatus, setCPOrganizerStatus] =
    useState(cp_organizer_status);

  const handleCPOrganizerStatus = (status: number) => {
    setCPOrganizerStatus(status);
  };

  const handleClick = () => {};

  return (
    <div className="py-6 px-4 " aria-label="ConsumptionPoints">
      <div className="flex flex-col">
        <div className="text-4xl pr-12">{t("consumption_points")}</div>

        {cpOrganizerStatus === -1 ? (
          <div>
            <div className="text-lg text-beer-dark bg-beer-foam p-2 mt-4">
              {t("consumption_points_description")}
            </div>

            <div>
              <p>
                Date de alta a través de nuestro formulario para obtener el
                título de organizador de puntos cervezanas.{" "}
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
              <SubmitCPOrganizer
                handleCPOrganizerStatus={handleCPOrganizerStatus}
              />
            </div>
          </div>
        ) : (
          <>
            {cpOrganizerStatus === 0 ? (
              <CPPending />
            ) : (
              <>
                <>
                  {cpOrganizerStatus === 1 ? (
                    <CPAccepted cps={cps} />
                  ) : (
                    <CPRejected />
                  )}
                </>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
