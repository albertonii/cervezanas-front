import { User } from "@supabase/supabase-js";
import { Button } from "@supabase/ui";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../utils/supabaseClient";
import { useAuth } from "../../Auth/useAuth";
import { Account } from "./Account";
import Details from "./Details";
import { History } from "./History";
import Values from "./Values";

interface Props {}

export const Profile = (props: Props) => {
  const { t } = useTranslation();

  const { user, loggedIn } = useAuth();

  const [profileData, setProfileData] = useState<any>();
  const [historyData, setHistoryData] = useState<any>();
  const [loading, setLoading] = useState(true);

  const [menuOption, setMenuOption] = useState<string>();

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  const renderSwitch = () => {
    switch (menuOption) {
      case "account":
        return <Account />;
      case "details":
        return <Details />;
      case "values":
        return <Values />;
      case "origin":
        return <History user={user} historyData={historyData} />;
    }
  };

  useEffect(() => {
    if (loggedIn) {
      setMenuOption("account");
      setLoading(false);
    }
  }, [loggedIn, user?.id]);

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

      {loading ? (
        <div>{t("loading")}</div>
      ) : (
        <div className="container">{renderSwitch()}</div>
      )}
    </>
  );
};
