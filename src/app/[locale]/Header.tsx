"use client";

import { useAuth } from "./Auth/useAuth";
import { MobileMenu } from "./MobileMenu";
import { ScreenMenu } from "./ScreenMenu";

export function Header() {
  const { isLoading } = useAuth();

  if (isLoading) return <></>;

  return (
    <header className="header relative w-full bg-beer-foam bg-transparent">
      <nav>
        <MobileMenu />
        <ScreenMenu />
      </nav>
    </header>
  );
}
