import { MobileMenu } from "./MobileMenu";
import { useState } from "react";
import ScreenMenu from "./ScreenMenu";

export function Header() {
  const [openHamburguer, setOpenHamburger] = useState(false);

  const handleClickOutsideCallback = () => {
    setOpenHamburger(false);
  };
  return (
    <>
      <header className="header absolute z-40 w-full bg-beer-foam bg-transparent sm:z-20">
        <ScreenMenu setOpenHamburger={setOpenHamburger} />

        {/* Mobile menu  */}
        <MobileMenu
          openHamburguer={openHamburguer}
          handleClickOutsideCallback={handleClickOutsideCallback}
        />
      </header>
    </>
  );
}
