"use client";

import { useTranslations } from "next-intl";
import React from "react";
import useFetchDistributors from "../../../../../../hooks/useFetchDistributors";
import LinkDistributor from "./LinkDistributor";
import ListAssociatedDistributors from "./ListAssociatedDistributors";

export default function Distributors() {
  const t = useTranslations();

  return (
    <>
      <LinkDistributor />

      {/* Section displaying all asociated distributors */}
      <section className="mt-4 flex flex-col space-y-4">
        <h2 className="text-2xl">{t("cp_mobile_list")}</h2>

        <ListAssociatedDistributors />
      </section>
    </>
  );
}
