"use client";

import { ScreenMenu, MobileMenu } from "../components/index";
import { useMediaQuery } from "react-responsive";

export function Header() {
  // const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isTiny = useMediaQuery({ query: "(max-width: 639px)" });
  const isSM = useMediaQuery({
    query: "(min-width: 640px) and (max-width: 767px)",
  });
  const isMD = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1023px)",
  });
  const isLG = useMediaQuery({
    query: "(min-width: 1024px) && (max-width: 1279px)",
  });
  const isXL = useMediaQuery({
    query: "(min-width: 1280px) && (max-width: 1535px)",
  });
  const is2XL = useMediaQuery({
    query: "(min-width: 1536px)",
  });

  return (
    <>
      <header className="header absolute z-40 w-full bg-beer-foam bg-transparent sm:z-20">
        <nav>
          {(isTiny || isSM) && <MobileMenu />}
          {(isMD || isLG || isXL || is2XL) && <ScreenMenu />}
        </nav>
      </header>
    </>
  );
}
