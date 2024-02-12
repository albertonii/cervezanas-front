"use client";
import Image from "next/image";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="flex h-full min-h-screen bg-white">{children}</div>

      {/* Image Hero  */}
      <div className="hidden h-screen w-full lg:relative lg:flex ">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/barriles.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
      </div>
    </div>
  );
}
