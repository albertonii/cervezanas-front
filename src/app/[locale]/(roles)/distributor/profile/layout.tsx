"use client";

import React from "react";
import { Sidebar } from "./Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
  return (
    <section className="relative flex w-full">
      <Sidebar />

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
