"use client";

import EventList from "./EventList";
import AddEvent from "../../../../components/modals/AddEvent";
import React from "react";
import { useTranslations } from "next-intl";
import { ICPMobile } from "../../../../../../lib/types";

interface Props {
  cpsMobile: ICPMobile[];
  counter: number;
}

export default function Events({ cpsMobile, counter }: Props) {
  const t = useTranslations();

  return (
    <section className="px-4 py-6" aria-label="Events">
      <header className="flex flex-col space-y-4">
        <h2 className="text-4xl">{t("events")}</h2>

        <div className="w-40">
          <AddEvent cpsMobile={cpsMobile} />
        </div>
      </header>

      <EventList counter={counter} />
    </section>
  );
}
