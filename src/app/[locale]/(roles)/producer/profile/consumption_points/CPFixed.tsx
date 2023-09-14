"use client";

import React from "react";
import AddCPFixedModal from "./AddCPFixedModal";
import { useTranslations } from "next-intl";
import { ListCPFixed } from "./ListCPFixed";

interface Props {
  cpsId: string;
}

export function CPFixed({ cpsId }: Props) {
  const t = useTranslations();

  return (
    <>
      <AddCPFixedModal cpsId={cpsId} />

      {/* Section displaying all the Mobile consumption points created by the organizer  */}
      <section className="mt-4 flex flex-col space-y-4">
        <h2 className="text-2xl">{t("cp_mobile_list")}</h2>

        <ListCPFixed cpsId={cpsId} />
      </section>
    </>
  );
}
