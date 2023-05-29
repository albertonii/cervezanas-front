"use client";

import HorizontalSections from "../../common/HorizontalSections";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { IProfile } from "../../../lib/types.d";
import { useAuth } from "../../Auth/useAuth";
import { Account, Details, Values } from "../../customLayout/index";

interface Props {
  profile: IProfile;
}

export function Profile({ profile }: Props) {
  const t = useTranslations();

  const { user } = useAuth();

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

      {!user ? (
        <div>{t("loading")}</div>
      ) : (
        <div className="container">{renderSwitch()}</div>
      )}
    </>
  );
}
