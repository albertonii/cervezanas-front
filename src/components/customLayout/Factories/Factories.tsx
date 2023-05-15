"use client";

import { useTranslation } from "react-i18next";

export const Factories = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="px-4 py-6 " aria-label="Factories">
        <div className="flex flex-col">
          <div className="pr-12 text-4xl">{t("factories")}</div>
        </div>
      </div>
    </>
  );
};
