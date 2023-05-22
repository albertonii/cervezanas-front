"use client";

import HorizontalSections from "../../../../components/common/HorizontalSections";
import React, { useEffect, useState } from "react";
import { Spinner } from "../../../../components/common";
import { Account, Details, Values } from "../../../../components/customLayout";
import { IProfile } from "../../../../lib/types.d";

interface Props {
  profile: IProfile;
}

export default function Profile({ profile }: Props) {
  console.log("profile", profile);
  const [loading, setLoading] = useState<boolean>(true);
  console.log(profile);

  const [menuOption, setMenuOption] = useState<string>("account");

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

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

  return (
    <>
      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={["account", "details", "values"]}
      />

      {loading ? (
        <Spinner color="beer-blonde" size={"medium"} />
      ) : (
        <>{renderSwitch()}</>
      )}
    </>
  );
}
