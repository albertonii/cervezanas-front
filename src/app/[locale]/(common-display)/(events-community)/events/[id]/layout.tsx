"use client";

import React, { useEffect, useState } from "react";
import EventCart from "./EventCart";

type LayoutProps = {
  children: React.ReactNode;
  params: any;
};

export default function layout({ children, params }: LayoutProps) {
  const { id: eventId } = params;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <>
      {isReady && (
        <>
          <EventCart eventId={eventId} />
          {children}
        </>
      )}
    </>
  );
}
