"use client";

import { useAuth } from "../../components/Auth";
import { MobileMenu } from "./MobileMenu";
import { ScreenMenu } from "./ScreenMenu";

export function Header() {
  const { isLoading } = useAuth();

  if (isLoading) return <></>;

  return (
    <header className="header absolute z-40 w-full bg-beer-foam bg-transparent sm:z-30">
      <nav>
        <MobileMenu />
        <ScreenMenu />
      </nav>
    </header>
  );
}
