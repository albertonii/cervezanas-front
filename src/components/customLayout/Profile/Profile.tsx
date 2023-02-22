import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../Auth/useAuth";
import { Button } from "../../common";
import { Account, Details, Values, History } from "../../customLayout/index";

export function Profile() {
  const { t } = useTranslation();

  const { user, loggedIn } = useAuth();

  const [menuOption, setMenuOption] = useState<string>("account");

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  const renderSwitch = () => {
    switch (menuOption) {
      case "account":
        return <Account user={user} />;
      case "details":
        return <Details />;
      case "values":
        return <Values />;
      case "origin":
        return <History user={user} />;
    }
  };

  if (!user) {
    return <div>{t("loading")}</div>;
  }

  return (
    <>
      <div className="" aria-label="Profile Submenu">
        <ul className="pl-72 h-12 flex items-center ">
          <li className="flex-1">
            <Button onClick={() => handleMenuClick("account")} class={""}>
              Cuenta
            </Button>
          </li>
          <li className="flex-1">
            <Button onClick={() => handleMenuClick("details")} class={""}>
              Detalles
            </Button>
          </li>
          <li className="flex-1">
            <Button onClick={() => handleMenuClick("values")} class={""}>
              Valores
            </Button>
          </li>
          <li className="flex-1">
            <Button onClick={() => handleMenuClick("origin")} class={""}>
              Origen
            </Button>
          </li>
        </ul>
      </div>

      {!loggedIn ? (
        <div>{t("loading")}</div>
      ) : (
        <div className="container">{renderSwitch()}</div>
      )}
    </>
  );
}
