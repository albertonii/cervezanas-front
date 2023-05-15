"use client";

import type { Session } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useState } from "react";
// import { TypedSupabaseClient } from "../../app/layout";

type SupabaseContext = {
  supabase: any;
  session: any | null;
};

// @ts-ignore
const Context = createContext<SupabaseContext>();

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any | null;
}) {
  const [supabase] = useState(() => createBrowserClient());

  return (
    <Context.Provider value={{ supabase, session }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => useContext(Context);
function createBrowserClient() {
  throw new Error("Function not implemented.");
}
