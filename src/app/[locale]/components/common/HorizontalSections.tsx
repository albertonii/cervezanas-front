"use client";

import React, { ComponentProps, useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  handleMenuClick: ComponentProps<any>;
  tabs: string[];
}

export default function HorizontalSections({ handleMenuClick, tabs }: Props) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  const t = useTranslations();

  const handleClick = (tab: string) => {
    setActiveTab(tab);
    handleMenuClick(tab);
  };

  return (
    <>
      <ul className="text-md grid grid-cols-2 divide-x divide-gray-200 rounded-lg pb-6 text-center font-medium text-gray-500 dark:divide-gray-700 dark:text-gray-400 sm:grid-cols-3 lg:pr-6 lg:pl-72 xl:flex">
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={`
          ${activeTab === tab ? "bg-gray-100  text-beer-gold" : "bg-beer-foam"}
          ${index === 0 ? "rounded-l-lg" : ""}
          ${index === tabs.length - 1 ? "rounded-r-lg" : ""}
          active flex w-full items-center justify-center p-4 shadow hover:cursor-pointer hover:bg-gray-50 hover:text-beer-draft focus:outline-none focus:ring-4 focus:ring-beer-blonde dark:bg-gray-700 dark:text-white`}
            onClick={() => handleClick(tab)}
          >
            {t(tab)}
          </li>
        ))}
      </ul>
    </>
  );
}
