"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Sidebar } from "../../../components/common/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
  const t = useTranslations();
  const sidebarLinks = [
    {
      name: t("profile"),
      icon: "user",
      option: "settings",
    },
    {
      name: t("logistics"),
      icon: "box",
      option: "logistics",
    },
    {
      name: t("contracts"),
      icon: "box",
      option: "contracts",
    },
    {
      name: t("online_orders"),
      icon: "box",
      option: "orders",
    },
    {
      name: t("feedback"),
      icon: "box",
      option: "feedback",
    },
  ];

  return (
    <section className="relative flex w-full">
      <Sidebar sidebarLinks={sidebarLinks} />

      <div
        className="w-full bg-beer-softFoam sm:pt-[5vh] md:pt-[5vh]"
        aria-label="Container Distributor settings"
      >
        {children}
      </div>
    </section>
  );
}
