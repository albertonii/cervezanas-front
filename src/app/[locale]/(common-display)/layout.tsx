import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
  return (
    <section className="container mx-auto mt-6 flex h-full w-full transform items-center justify-between transition lg:flex-wrap">
      {children}
    </section>
  );
}
