import React from "react";
import HorizontalSections from "../../../../../../components/common/HorizontalSections";
import { DistributionType } from "../../../../../../lib/enums";

type Props = {
  setMenuOption: (opt: string) => void;
};

export default function HorizontalMenu({ setMenuOption }: Props) {
  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  return (
    <>
      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={[
          DistributionType.LOCAL,
          DistributionType.CITY,
          DistributionType.PROVINCE,
          DistributionType.REGION,
          DistributionType.EUROPE,
          DistributionType.INTERNATIONAL,
        ]}
      />
    </>
  );
}
