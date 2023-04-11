import HorizontalSections from "../../common/HorizontalSections";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Profile } from "../../../lib/types";
import { useAuth } from "../../Auth/useAuth";
import { Account, Details, Values } from "../../customLayout/index";

interface Props {
  profile: Profile;
}

export function Profile({ profile }: Props) {
  const { t } = useTranslation();

  const { user, loggedIn } = useAuth();

  const [menuOption, setMenuOption] = useState<string>("account");

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  const renderSwitch = () => {
    switch (menuOption) {
      case "account":
        return <Account profile={profile} />;
      case "details":
        return <Details />;
      case "values":
        return <Values />;
    }
  };

  if (!user) {
    return <div>{t("loading")}</div>;
  }

  return (
    <>
      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={["account", "details", "values"]}
      />

      {!loggedIn ? (
        <div>{t("loading")}</div>
      ) : (
        <div className="container">{renderSwitch()}</div>
      )}
    </>
  );
}
