"use client";

import React, { useEffect, useState } from "react";
import EventCart from "./(cart)/EventCart";

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

  // useEffect(() => {
  //   // Comprueba si estamos en el lado del cliente
  //   if (typeof window !== "undefined") {
  //     const savedCarts = localStorage.getItem("event-carts");
  //     console.log("En Cliente: ", savedCarts);
  //     if (savedCarts) {
  //       setEventCarts(JSON.parse(savedCarts));
  //     }
  //   }
  // }, []);

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
