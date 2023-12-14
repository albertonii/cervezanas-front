"use client";

import dynamic from "next/dynamic";

interface Props {
  deviceType: string;
}

export default function Header({ deviceType }: Props) {
  return (
    <header className="header absolute w-full bg-beer-foam bg-transparent">
      <nav>
        {deviceType === "mobile"
          ? (() => {
              const DynamicMobileMenu = dynamic(() => import("./MobileMenu"), {
                loading: () => <p>Loading...</p>,
              });
              return <DynamicMobileMenu />;
            })()
          : (() => {
              const DynamicScreenMenu = dynamic(() => import("./ScreenMenu"), {
                loading: () => <p>Loading...</p>,
              });
              return <DynamicScreenMenu />;
            })()}
      </nav>
    </header>
  );
}
