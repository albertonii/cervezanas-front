import { useTranslation } from "react-i18next";

export const Factories = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="py-6 px-4 " aria-label="Factories">
        <div className="flex flex-col">
          <div className="text-4xl pr-12">{t("factories")}</div>
        </div>
      </div>
    </>
  );
};
