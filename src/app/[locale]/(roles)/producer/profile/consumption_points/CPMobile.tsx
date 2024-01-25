"use client";

import AddCPMobileModal from "./AddCPMobileModal";
import React from "react";
import { useTranslations } from "next-intl";
import { ListCPMobile } from "./ListCPMobile";

interface Props {
  cpsId: string;
}

export function CPMobile({ cpsId }: Props) {
  const t = useTranslations();

  return (
    <section className="px-4 py-6" aria-label="Products">
      <header className="flex flex-col space-y-4">
        <h2 className="text-4xl">{t("cp_mobile_list")}</h2>

        <div className="w-40">
          <AddCPMobileModal cpsId={cpsId} />
        </div>
      </header>

      <ListCPMobile cpsId={cpsId} />
    </section>
  );
}
