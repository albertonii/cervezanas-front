"use client";

import React from "react";
import { useTranslations } from "next-intl";
import EventList from "./EventList";

export default function ProfileEvents() {
  const t = useTranslations();

  return (
    <div className="px-6 py-4">
      <section className="mt-4 flex flex-col space-y-4">
        <h2 className="text-2xl">{t("events_list")}</h2>

        <EventList />
      </section>
    </div>
  );
}
