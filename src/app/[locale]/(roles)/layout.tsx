"use client";

import React from "react";
import { redirect, RedirectType } from "next/navigation";
import { createBrowserClient } from "../../../utils/supabaseBrowser";
import { VIEWS } from "../../../constants";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function layout({ children }: LayoutProps) {
  const supabase = createBrowserClient();
  const data = await supabase.auth.getSession();

  if (!data) {
    redirect(VIEWS.SIGN_IN, RedirectType.push);
  }

  return <div>{children}</div>;
}
