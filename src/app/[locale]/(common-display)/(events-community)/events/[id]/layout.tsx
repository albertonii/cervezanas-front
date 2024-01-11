"use client";

import React, { useEffect, useState } from "react";
import EventCart from "../../EventCart";

type LayoutProps = {
  children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <>
      {isReady && (
        <>
          <EventCart />
          {children}
        </>
      )}
    </>
  );
}
