import React, { ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";

interface props {
  handleMenuClick: ComponentProps<any>;
  tabs: string[];
}

export default function HorizontalSections({ handleMenuClick, tabs }: props) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  const { t } = useTranslation();

  const handleClick = (tab: string) => {
    setActiveTab(tab);
    handleMenuClick(tab);
  };

  return (
    <div className="" aria-label="">
      <ul className="pl-72 pr-6 pb-6 hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={`
          ${
            activeTab === "account"
              ? "bg-gray-100  text-gray-900"
              : "bg-beer-foam"
          }
          ${index === 0 ? "rounded-l-lg" : ""}
          ${index === tabs.length - 1 ? "rounded-r-lg" : ""}
          w-full flex items-center justify-center p-4 focus:ring-4 hover:cursor-pointer focus:ring-beer-blonde hover:bg-gray-50 hover:text-gray-700 active focus:outline-none dark:bg-gray-700 dark:text-white`}
            onClick={() => handleClick(tab)}
          >
            {t(tab)}
          </li>
        ))}
      </ul>
    </div>
  );
}
