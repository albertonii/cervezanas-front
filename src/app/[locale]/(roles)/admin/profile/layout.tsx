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
      name: t("contracts_cps"),
      icon: "user",
      option: "contracts_cps",
    },
    {
      name: t("monthly_products"),
      icon: "box",
      option: "monthly_products",
    },
    {
      name: t("admin_products"),
      icon: "box",
      option: "products",
    },
    {
      name: t("admin_events"),
      icon: "box",
      option: "events",
    },
    {
      name: t("admin_cps"),
      icon: "box",
      option: "cps",
    },
    {
      name: t("admin_campaigns"),
      icon: "box",
      option: "campaigns",
    },

    {
      name: t("notifications"),
      icon: "bell",
      option: "notifications",
    },
  ];

  return (
    <section className="relative flex w-full">
      <Sidebar sidebarLinks={sidebarLinks} />

      <div
        className="w-full bg-beer-softFoam sm:pt-[5vh] md:pt-[5vh]"
        aria-label="Container Admin settings"
      >
        {children}
      </div>
    </section>
  );
}
