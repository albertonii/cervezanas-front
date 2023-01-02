import React, { useEffect, useState, createContext, useContext } from "react";
import {
  SupabaseClient,
  Session,
  User,
  UserCredentials,
} from "@supabase/supabase-js";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";

export interface AuthSession {
  user: User | null;
  session: Session | null;
}

const UserContext = createContext<AuthSession>({ user: null, session: null });

export interface Props {
  supabaseClient: SupabaseClient;
  [propName: string]: any;
}

export const UserContextProvider = (props: Props) => {
  const { supabaseClient } = props;
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(session?.user ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await supabaseClient.auth.session();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    })();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          updateSupabaseCookie();
        }
      }
    );

    const updateSupabaseCookie = async () => {
      axios.post("/api/set-supabase-cookie", {
        event: user ? "SIGNED_IN" : "SIGNED_OUT",
        session: supabase.auth.session(),
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
      });
    };

    return () => {
      authListener?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {}, [user]);

  const value = {
    session,
    user,
    signUp: (data: UserCredentials) => supabaseClient.auth.signUp(data),
    signIn: (data: UserCredentials) => supabaseClient.auth.signIn(data),
    signOut: () => supabaseClient.auth.signOut(),
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
