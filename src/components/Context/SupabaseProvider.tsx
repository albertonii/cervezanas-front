"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useState } from "react";
import { createClient } from "../../utils/supabaseBrowser";

type SupabaseContext = {
  supabase: SupabaseClient<any>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClient());

  return (
    <Context.Provider value={{ supabase }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};
