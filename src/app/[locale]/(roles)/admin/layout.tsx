"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Sidebar } from "../../components/common/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
  const t = useTranslations();

  const sidebarLinks = [
    {
      name: t("cps"),
      icon: "user",
      option: "cps",
    },
    {
      name: t("monthly_products"),
      icon: "box",
      option: "monthly_products",
    },
    {
      name: t("admin_products"),
      icon: "box",
      option: "admin_products",
    },
    {
      name: t("admin_events"),
      icon: "box",
      option: "admin_events",
    },
    {
      name: t("admin_cps"),
      icon: "box",
      option: "admin_cps",
    },
    {
      name: t("admin_campaigns"),
      icon: "box",
      option: "admin_campaigns",
    },
    {
      name: t("notifications"),
      icon: "box",
      option: "notifications",
    },
  ];

  return (
    <section className="relative flex w-full">
      <Sidebar sidebarLinks={sidebarLinks} />

      {/* Client Information */}
      <div
        className="bg-beer-softFoam sm:pt-[5vh] md:pt-[5vh]"
        aria-label="Container Client Information"
      >
        {children}
      </div>
    </section>
  );
}
