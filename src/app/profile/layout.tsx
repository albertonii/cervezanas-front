import React from "react";
import { Sidebar } from "../../components/customLayout";

type LayoutProps = {
  children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}
