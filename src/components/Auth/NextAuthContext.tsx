import { Session } from "next-auth";
import { createContext, useContext, useEffect, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { useSession } from "next-auth/react";

export interface AuthSession {
  session: Session | null;
  loading: boolean;
  supabaseClient: SupabaseClient | null;
  status: string;
}

const NextAuthContext = createContext<AuthSession>({
  session: null,
  loading: true,
  supabaseClient: null,
  status: "unauthenticated",
});

export interface Props {
  supabaseClient: SupabaseClient;
  [propName: string]: any;
}

export const NextAuthContextProvider = (props: Props) => {
  const { supabaseClient } = props;
  //   const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  //   useEffect(() => {
  // (async () => {
  //   const session = supabaseClient.auth.session();
  //   setSession(session);
  //   setLoading(false);
  // })();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [session]);

  const value = {
    session,
    loading,
    supabaseClient,
    status,
    // setUser: (user: User | null) => setUser(user),
    // signUp: (data: UserCredentials) => supabaseClient.auth.signUp(data),
    // signIn: (data: UserCredentials) => supabaseClient.auth.signIn(data),
    // signOut: () => signOut(),
  };

  return <NextAuthContext.Provider value={value} {...props} />;
};

export const useNextAuth = () => {
  const context = useContext(NextAuthContext);
  if (context === undefined) {
    throw new Error(
      `useNextAuth must be used within a NextAuthContextProvider.`
    );
  }
  return context;
};
