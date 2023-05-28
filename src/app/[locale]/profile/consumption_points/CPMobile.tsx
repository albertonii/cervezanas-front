"use client";

import ModalCPMobile from "./ModalCPMobile";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ICPMobile } from "../../../../lib/types.d";
import { ListCPMobile } from "./ListCPMobile";

interface Props {
  cpsId: string;
  cpMobile: ICPMobile[];
}

export function CPMobile({ cpsId, cpMobile }: Props) {
  const { t } = useTranslation();

  const [cpList, setCpList] = useState<ICPMobile[]>(cpMobile);

  const handleCPList = (cps: ICPMobile[]) => {
    setCpList(cps);
  };

  return (
    <>
      <ModalCPMobile
        cpsId={cpsId}
        handleCPList={handleCPList}
        cpList={cpList}
      />

      {/* Section displaying all the Mobile consumption points created by the organizer  */}
      <section className="mt-4 flex flex-col space-y-4">
        <h2 className="text-2xl">{t("cp_mobile_list")}</h2>

        <ListCPMobile
          cpMobile={cpList}
          cpsId={cpsId}
          handleCPList={handleCPList}
        />
      </section>
    </>
  );
}
