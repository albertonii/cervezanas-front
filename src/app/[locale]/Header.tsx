"use client";

import dynamic from "next/dynamic";
import useDeviceDetection from "../../hooks/useDeviceDetection";

export default function Header() {
  const device = useDeviceDetection();

  return (
    <header className="header absolute w-full bg-beer-foam bg-transparent">
      <nav>
        {device === "Mobile"
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
