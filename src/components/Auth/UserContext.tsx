import React, { useEffect, useState, createContext, useContext } from "react";
import {
  SupabaseClient,
  Session,
  User,
  UserCredentials,
} from "@supabase/supabase-js";

export interface AuthSession {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const UserContext = createContext<AuthSession>({
  user: null,
  session: null,
  loading: true,
});

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
      const session = supabaseClient.auth.session();
      setSession(session);

      setUser(session?.user ?? null);
      setLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const value = {
    session,
    user,
    loading,
    setUser: (user: User) => setUser(user),
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
