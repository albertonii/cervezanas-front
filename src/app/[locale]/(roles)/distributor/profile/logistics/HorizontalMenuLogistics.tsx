import React from "react";
import HorizontalSections from "../../../../components/common/HorizontalSections";
import { DistributionOption } from "../../../../../../lib/enums";

type Props = {
  setMenuOption: (opt: string) => void;
};

export default function HorizontalMenuLogistics({ setMenuOption }: Props) {
  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  return (
    <>
      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={[
          DistributionOption.COST,
          DistributionOption.DESTINATION,
          DistributionOption.ORIGIN_INFORMATION,
        ]}
      />
    </>
  );
}
