"use client";

import React from "react";
import { redirect, RedirectType } from "next/navigation";
import { useAuth } from "../Auth/useAuth";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function layout({ children }: LayoutProps) {
  const { supabase } = useAuth();

  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    redirect("/signin", RedirectType.push);
  }

  return <>{children}</>;
}
