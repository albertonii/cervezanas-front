"use client";

import ModalCPMobile from "./ModalCPMobile";
import React from "react";
import { useTranslations } from "next-intl";
import { ListCPMobile } from "./ListCPMobile";

interface Props {
  cpsId: string;
}

export function CPMobile({ cpsId }: Props) {
  const t = useTranslations();

  return (
    <>
      <ModalCPMobile cpsId={cpsId} />

      {/* Section displaying all the Mobile consumption points created by the organizer  */}
      <section className="mt-4 flex flex-col space-y-4">
        <h2 className="text-2xl">{t("cp_mobile_list")}</h2>

        <ListCPMobile cpsId={cpsId} />
      </section>
    </>
  );
}
