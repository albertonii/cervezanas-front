import { ScreenMenu, MobileMenu } from "./index";
import { useMediaQuery } from "react-responsive";

export function Header() {
  // const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isTiny = useMediaQuery({ query: "(max-width: 640px)" });
  const isSM = useMediaQuery({ query: "(min-width: 640px)" });
  const isMD = useMediaQuery({ query: "(min-width: 768px)" });
  const isLG = useMediaQuery({ query: "(min-width: 1024px)" });
  const isXL = useMediaQuery({ query: "(min-width: 1280px)" });
  const is2XL = useMediaQuery({
    query: "(min-width: 1536px)",
  });

  return (
    <>
      <header className="header absolute z-40 w-full bg-beer-foam bg-transparent sm:z-20">
        {(isTiny || isSM) && <MobileMenu />}
        {(isMD || isLG || isXL || is2XL) && <ScreenMenu />}
      </header>
    </>
  );
}
