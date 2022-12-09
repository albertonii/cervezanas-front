import { User } from "@supabase/supabase-js";
import { Button } from "@supabase/ui";
import { useEffect, useState } from "react";
import { Account } from "./Account";

interface Props {
  user: User | null;
}

export const Profile = (props: Props) => {
  const {user} = props;

  const [menuOption, setMenuOption] = useState<string>();

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  const renderSwitch = () => {
    switch (menuOption) {
      case "account":
        return <Account user={user} />;
      case "details":
        return "details";
      case "values":
        return "values";
      case "origin":
        return "origin";
    }
  };

  useEffect(() => {
    setMenuOption("account");
  }, []);

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
