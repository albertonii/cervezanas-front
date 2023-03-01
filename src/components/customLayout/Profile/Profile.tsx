import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../Auth/useAuth";
import { Account, Details, Values, History } from "../../customLayout/index";

export function Profile() {
  const { t } = useTranslation();

  const { user, loggedIn } = useAuth();

  const [menuOption, setMenuOption] = useState<string>("account");
  const [activeTab, setActiveTab] = useState<string>("account");

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
    setActiveTab(opt);
  };

  const renderSwitch = () => {
    switch (menuOption) {
      case "account":
        return <Account user={user} />;
      case "details":
        return <Details />;
      case "values":
        return <Values />;
      case "origin":
        return <History user={user} />;
    }
  };

  if (!user) {
    return <div>{t("loading")}</div>;
  }

  return (
    <>
      <div className="" aria-label="Profile Submenu">
        <ul className="pl-72 pr-6 pb-6 hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
          <li
            className={`
          ${
            activeTab === "account"
              ? "bg-gray-100  text-gray-900"
              : "bg-beer-foam"
          }
          w-full flex items-center justify-center p-4 rounded-l-lg focus:ring-4 hover:cursor-pointer focus:ring-beer-blonde hover:bg-gray-50 hover:text-gray-700 active focus:outline-none dark:bg-gray-700 dark:text-white`}
            onClick={() => handleMenuClick("account")}
          >
            {t("account")}
          </li>

          <li
            className={`
          ${
            activeTab === "details"
              ? "bg-gray-100 text-gray-900"
              : "bg-beer-foam"
          }
          w-full flex items-center justify-center p-4 hover:cursor-pointer hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-beer-blonde focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
            onClick={() => handleMenuClick("details")}
          >
            {t("details")}
          </li>

          <li
            className={`
          ${
            activeTab === "values"
              ? "bg-gray-100 text-gray-900"
              : "bg-beer-foam"
          }
          w-full flex items-center justify-center p-4 hover:cursor-pointer hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-beer-blonde focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
            onClick={() => handleMenuClick("values")}
          >
            {t("values")}
          </li>

          <li
            className={`
          ${
            activeTab === "origin"
              ? "bg-gray-100 text-gray-900"
              : "bg-beer-foam"
          }
          w-full rounded-r-lg flex items-center justify-center p-4 hover:cursor-pointer hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-beer-blonde focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
            onClick={() => handleMenuClick("origin")}
          >
            {t("origin")}
          </li>
        </ul>
      </div>

      {!loggedIn ? (
        <div>{t("loading")}</div>
      ) : (
        <div className="container">{renderSwitch()}</div>
      )}
    </>
  );
}
