"use client";

import React, { ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  handleMenuClick: ComponentProps<any>;
  tabs: string[];
}

export default function HorizontalSections({ handleMenuClick, tabs }: Props) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  const { t } = useTranslation();

  const handleClick = (tab: string) => {
    setActiveTab(tab);
    handleMenuClick(tab);
  };

  return (
    <div className="" aria-label="">
      <ul className="hidden divide-x divide-gray-200 rounded-lg pb-6 pl-72 pr-6 text-center text-sm font-medium text-gray-500 shadow dark:divide-gray-700 dark:text-gray-400 sm:flex">
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
          active flex w-full items-center justify-center p-4 hover:cursor-pointer hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-beer-blonde dark:bg-gray-700 dark:text-white`}
            onClick={() => handleClick(tab)}
          >
            {t(tab)}
          </li>
        ))}
      </ul>
    </div>
  );
}
