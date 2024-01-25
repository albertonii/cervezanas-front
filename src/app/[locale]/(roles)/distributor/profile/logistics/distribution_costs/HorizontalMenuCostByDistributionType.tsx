import React from "react";
import { DistributionDestinationType } from "../../../../../../../lib/enums";
import HorizontalSections from "../../../../../components/common/HorizontalSections";

type Props = {
  setMenuOption: (opt: string) => void;
};

export default function HorizontalMenuCostByDistributionType({
  setMenuOption,
}: Props) {
  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  return (
    <>
      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={[
          DistributionDestinationType.CITY,
          DistributionDestinationType.PROVINCE,
          DistributionDestinationType.REGION,
          DistributionDestinationType.EUROPE,
          DistributionDestinationType.INTERNATIONAL,
        ]}
      />
    </>
  );
}
