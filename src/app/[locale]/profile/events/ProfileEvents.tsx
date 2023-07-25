"use client";

import EventList from "./EventList";
import AddEvent from "./AddEvent";
import React from "react";
import { useTranslations } from "next-intl";
import { ICPMobile } from "../../../../lib/types.d";

interface Props {
  cpsMobile: ICPMobile[];
}

export default function ProfileEvents({ cpsMobile }: Props) {
  const t = useTranslations();

  return (
    <div className="px-6 py-4">
      <AddEvent cpsMobile={cpsMobile} />

      {/* Section displaying all the fixed consumption points created by the organizer  */}
      <section className="mt-4 flex flex-col space-y-4">
        <h2 className="text-2xl">{t("events_list")}</h2>

        <EventList />
      </section>
    </div>
  );
}
