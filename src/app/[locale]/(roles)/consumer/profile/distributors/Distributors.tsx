"use client";

import { useTranslations } from "next-intl";
import React from "react";
import LinkDistributor from "./LinkDistributor";
import ListAssociatedDistributors from "./ListAssociatedDistributors";

export default function Distributors() {
  const t = useTranslations();

  return (
    <>
      <LinkDistributor />

      {/* Section displaying all asociated distributors */}
      <section className="mt-4 flex flex-col space-y-4">
        <ListAssociatedDistributors />
      </section>
    </>
  );
}
