"use client";

// import { MobileMenu } from "./MobileMenu";
// import { ScreenMenu } from "./ScreenMenu";
import dynamic from "next/dynamic";

const DynamicMobileMenu = dynamic(() => import("./MobileMenu"), {
  loading: () => <p>Loading...</p>,
});
const DynamicScreenMenu = dynamic(() => import("./ScreenMenu"), {
  loading: () => <p>Loading...</p>,
});

interface Props {
  deviceType: string;
}

export default function Header({ deviceType }: Props) {
  return (
    <header className="header absolute w-full bg-beer-foam bg-transparent">
      <nav>
        {deviceType === "mobile" ? (
          <DynamicMobileMenu />
        ) : (
          <DynamicScreenMenu />
        )}
      </nav>
    </header>
  );
}
