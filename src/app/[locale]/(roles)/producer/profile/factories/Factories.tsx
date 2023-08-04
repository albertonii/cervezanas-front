"use client";

import { useTranslations } from "next-intl";

export const Factories = () => {
  const t = useTranslations();

  return (
    <>
      <div className="px-4 py-6 " aria-label="Factories">
        <div className="flex flex-col space-y-4">
          <div className="text-4xl">{t("factories")}</div>
        </div>
      </div>
    </>
  );
};
