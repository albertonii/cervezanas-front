"use client";

import React from "react";
import AddCPFixedModal from "./AddCPFixedModal";
import { useTranslations } from "next-intl";
import { ListCPFixed } from "./ListCPFixed";
import { ICPFixed } from "../../../../../../lib/types";

interface Props {
  cpsFixed: ICPFixed[];
}

export function CPFixed({ cpsFixed }: Props) {
  const t = useTranslations();

  return (
    <section className="px-4 py-6" aria-label="Products">
      <header className="flex flex-col space-y-4">
        <h2 className="text-4xl">{t("cp_fixed_list")}</h2>
      </header>

      <ListCPFixed cpsFixed={cpsFixed} />
    </section>
  );
}
