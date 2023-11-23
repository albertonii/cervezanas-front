"use client";

import React from "react";
import { redirect, RedirectType } from "next/navigation";
import { createBrowserClient } from "../../../utils/supabaseBrowser";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function layout({ children }: LayoutProps) {
  //  const { supabase } = useAuth();
  // const { data: session } = await supabase.auth.getSession();
  const supabase = createBrowserClient();
  const data = await supabase.auth.getSession();

  if (!data) {
    redirect("/signin", RedirectType.push);
  }

  return <>{children}</>;
}
