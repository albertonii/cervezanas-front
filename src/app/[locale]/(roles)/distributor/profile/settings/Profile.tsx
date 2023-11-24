"use client";

import HorizontalSections from "../../../../components/common/HorizontalSections";
import React, { useEffect, useState } from "react";
import { Spinner } from "../../../../components/common/Spinner";
import { IDistributorUser } from "../../../../../../lib/types";
import { Account } from "./Account";

interface Props {
  profile: IDistributorUser;
}

export default function Profile({ profile }: Props) {
  const [loading, setLoading] = useState<boolean>(true);

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
    }
  };

  return (
    <>
      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={["account"]}
      />

      {loading ? (
        <Spinner color="beer-blonde" size={"medium"} />
      ) : (
        <>{renderSwitch()}</>
      )}
    </>
  );
}
