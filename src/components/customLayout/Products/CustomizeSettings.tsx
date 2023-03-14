import React from "react";
import { useTranslation } from "react-i18next";

export function CustomizeSettings() {
  const { t } = useTranslation();

  return (
    <>
      <div className="py-6 px-4 " aria-label="CustomizeSettings">
        <div className="flex items-center">
          <div className="text-4xl pr-12">
            {t("products_customize_settings")}
          </div>
        </div>
      </div>
    </>
  );
}
