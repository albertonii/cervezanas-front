"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  IConsumptionPoints,
  ICPFixed,
  ICPMobile,
} from "../../../../../../lib/types";
import HorizontalSections from "../../../../components/common/HorizontalSections";
import { CPMobile } from "./CPMobile";
import { CPFixed } from "./CPFixed";

interface Props {
  cps: IConsumptionPoints[];
}

export function ConsumptionPoints({ cps }: Props) {
  const [cpsFixed, setCPsFixed] = useState<ICPFixed[]>([]);
  const [cpsMobile, setCPsMobile] = useState<ICPMobile[]>([]);

  const [menuOption, setMenuOption] = useState<string>("cp_fixed");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    cps.map((cp) => {
      if (cp.cp_fixed) {
        cp.cp_fixed.map((cpf) => {
          setCPsFixed((prev) => {
            // Avoid cpf that already exists in the array
            const exists = prev && prev.find((cp) => cp.id === cpf.id);

            if (prev && !exists) {
              return [...prev, cpf];
            }
            return [cpf];
          });
        });
      }

      if (cp.cp_mobile) {
        cp.cp_mobile.map((cpm) => {
          setCPsMobile((prev) => {
            // Avoid cpm that already exists in the array
            const exists = prev && prev.find((cp) => cp.id === cpm.id);

            if (prev && !exists) {
              return [...prev, cpm];
            }
            return [cpm];
          });
        });
      }
    });

    setIsLoading(false);
  }, [cps]);

  const renderSwitch = () => {
    if (isLoading) return <div>Loading...</div>;

    switch (menuOption) {
      case "cp_fixed":
        return <CPFixed cpsFixed={cpsFixed} />;
      case "cp_mobile":
        return <CPMobile cpsMobile={cpsMobile} />;
    }
  };

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  return (
    <>
      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={["cp_fixed", "cp_mobile"]}
      />

      {renderSwitch()}
    </>
  );
}
