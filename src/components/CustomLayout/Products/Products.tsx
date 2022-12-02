import { Button } from "@supabase/ui";
import { useState } from "react";

export const Products = () => {
  const [menuOption, setMenuOption] = useState<string>("account");

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  const renderSwitch = () => {
    switch (menuOption) {
      case "account":
        return "";
      case "details":
        return "details";
      case "values":
        return "values";
      case "origin":
        return "origin";
    }
  };

  return (
    <>
      <div className="" aria-label="Profile Submenu">
        <ul className="pl-72 h-12 flex items-center ">
          <li className="flex-1">
            <Button onClick={() => handleMenuClick("account")}>Cuenta</Button>
          </li>
          <li className="flex-1">
            <Button onClick={() => handleMenuClick("details")}>Detalles</Button>
          </li>
          <li className="flex-1">
            <Button onClick={() => handleMenuClick("values")}>Valores</Button>
          </li>
          <li className="flex-1">
            <Button onClick={() => handleMenuClick("origin")}>Origen</Button>
          </li>
        </ul>
      </div>

      <div className="container">{renderSwitch()}</div>
    </>
  );
};
