import { ScreenMenu, MobileMenu } from "./index";

export function Header() {
  return (
    <>
      <header className="header absolute z-40 w-full bg-beer-foam bg-transparent sm:z-20">
        <MobileMenu />
        <ScreenMenu />
      </header>
    </>
  );
}
