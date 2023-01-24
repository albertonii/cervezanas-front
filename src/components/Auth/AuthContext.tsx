import React, { useEffect, useState, createContext } from "react";
import {
  SupabaseClient,
  Session,
  User,
  UserCredentials,
  Provider,
  AuthChangeEvent,
} from "@supabase/supabase-js";
import { useMessage } from "../message";
import Router from "next/router";
import { ROUTE_HOME, ROUTE_AUTH } from "../../config";

export interface SignUpInterface {
  userCredentials: { email: string; password: string; phone: string };
  options: {
    redirectTo?: string;
    data?: object;
    captchaToken?: string;
  };
}

export interface AuthSession {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signUp: (payload: SignUpInterface) => void;
  signIn: (payload: UserCredentials) => void;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => void;
  supabaseClient: SupabaseClient | null;
  userLoading: boolean;
  loggedIn: boolean;
}

export const AuthContext = createContext<AuthSession>({
  user: null,
  setUser: () => {},
  signIn: () => {},
  signUp: () => {},
  signInWithProvider: () => Promise.resolve(),
  signOut: () => {},
  supabaseClient: null,
  loading: false,
  userLoading: false,
  loggedIn: false,
});

export interface Props {
  supabaseClient: SupabaseClient;
  [propName: string]: any;
}

export const AuthContextProvider = (props: Props) => {
  const { supabaseClient: supabase } = props;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const { handleMessage } = useMessage();

  const signUp = async (payload: SignUpInterface) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp(
        payload.userCredentials,
        payload.options
      );
      if (error) {
        handleMessage!({ message: error.message, type: "error" });
        setLoggedIn(false);
      } else {
        handleMessage!({
          message:
            "Signup successful. Please check your inbox for a confirmation email!",
          type: "success",
        });
        setLoggedIn(true);
      }
    } catch (error: any) {
      handleMessage!({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (payload: UserCredentials) => {
    try {
      setLoading(true);

      const { error, user } = await supabase.auth.signIn(payload);
      if (error) {
        setLoggedIn(false);

        handleMessage!({ message: error.message, type: "error" });
      } else {
        handleMessage!({
          message: payload?.password?.length
            ? `Welcome, ${user?.email}`
            : `Please check your email for the magic link`,
          type: "success",
        });

        setLoggedIn(true);
      }
    } catch (error: any) {
      handleMessage!({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    await supabase.auth.signIn({ provider });
  };

  const signOut = async () => {
    setLoggedIn(false);
    return await supabase.auth.signOut();
  };

  const setServerSession = async (event: AuthChangeEvent, session: Session) => {
    await fetch("/api/auth", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ event, session }),
    });
  };

  useEffect(() => {
    const user = supabase.auth.user();

    if (user) {
      setUser(user);
      setUserLoading(false);
      setLoggedIn(true);
      // Router.push(ROUTE_HOME);
    } else {
      setUserLoading(false);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user! ?? null;
        setUserLoading(false);
        await setServerSession(event, session!);
        if (user) {
          setUser(user);
          setLoggedIn(true);
          // Router.push(ROUTE_HOME);
        } else {
          setUser(null);
          Router.push(ROUTE_AUTH);
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    setUser: (user: User | null) => setUser(user),
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    supabaseClient: supabase,
    loggedIn,
    userLoading,
  };

  return <AuthContext.Provider value={value} {...props} />;
};
