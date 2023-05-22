"use client";

import AddNewEvent from "./AddNewEvent";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ICPMobile, IEvent } from "../../../../lib/types.d";
import EventList from "./EventList";

interface Props {
  events: IEvent[];
  cpsMobile: ICPMobile[];
}

export default function Events({ events, cpsMobile }: Props) {
  const { t } = useTranslation();
  const [eList, setEList] = useState<IEvent[]>(events);
  const handleEList = (list: IEvent[]) => {
    setEList(list);
  };

  return (
    <>
      <AddNewEvent
        eList={eList}
        handleEList={handleEList}
        cpsMobile={cpsMobile}
      />

      {/* Section displaying all the fixed consumption points created by the organizer  */}
      <section className="mt-4 flex flex-col space-y-4 ">
        <h2 className="text-2xl">{t("events_list")}</h2>

        <EventList events={events} handleEList={handleEList} />
      </section>
    </>
  );
}
