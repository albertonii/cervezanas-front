"use client";

import EventList from "./EventList";
import AddNewEvent from "./AddNewEvent";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ICPMobile, IEvent } from "../../../../lib/types";

interface Props {
  events: IEvent[];
  cpsMobile: ICPMobile[];
}

export default function ProfileEvents({ events, cpsMobile }: Props) {
  const t = useTranslations();
  const [eList, setEList] = useState<IEvent[]>(events);
  const handleEList = (list: IEvent[]) => {
    setEList(list);
  };

  return (
    <div className="px-6 py-4">
      <AddNewEvent
        eList={eList}
        handleEList={handleEList}
        cpsMobile={cpsMobile}
      />

      {/* Section displaying all the fixed consumption points created by the organizer  */}
      <section className="mt-4 flex flex-col space-y-4">
        <h2 className="text-2xl">{t("events_list")}</h2>

        <EventList events={events} handleEList={handleEList} />
      </section>
    </div>
  );
}
