"use client";

import { useAuth } from "./Auth/useAuth";
import { MobileMenu } from "./MobileMenu";
import { ScreenMenu } from "./ScreenMenu";

export default function Header() {
  const { isLoading } = useAuth();

  if (isLoading) return <></>;

  return (
    <header className="header absolute w-full bg-beer-foam bg-transparent">
      <nav>
        <MobileMenu />
        <ScreenMenu />
      </nav>
    </header>
  );
}
