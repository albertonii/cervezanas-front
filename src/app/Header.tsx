import { MobileMenu } from "./MobileMenu";
import { ScreenMenu } from "./ScreenMenu";

export function Header() {
  return (
    <>
      <header className="header absolute z-40 w-full bg-beer-foam bg-transparent sm:z-20">
        <nav>
          <MobileMenu />
          <ScreenMenu />
        </nav>
      </header>
    </>
  );
}
