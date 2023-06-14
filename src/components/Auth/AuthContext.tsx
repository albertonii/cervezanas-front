"use client";

import useSWR from "swr";
import React, { useEffect, useState, createContext, useMemo } from "react";
import {
  Provider,
  Session,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  SupabaseClient,
} from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useSupabase } from "../Context/SupabaseProvider";
import { ROLE_ENUM } from "../../lib/types.d";
import { useMessage } from "../message";
import { EVENTS, VIEWS } from "../../constants";
import { useLocale, useTranslations } from "next-intl";
import { ROUTE_SIGNIN } from "../../config";

export interface AuthSession {
  initial: boolean;
  user: any;
  error: any;
  role: ROLE_ENUM | null;
  isLoading: boolean;
  signUp: (payload: SignUpWithPasswordCredentials) => void;
  signIn: (email: string, password: string) => void;
  signInWithProvider: (provider: Provider) => void;
  signOut: () => Promise<void>;
  supabase: SupabaseClient | null;
}

export const AuthContext = createContext<AuthSession>({
  initial: true,
  user: null,
  error: null,
  role: null,
  isLoading: false,
  signUp: () => void {},
  signIn: async (email: string, password: string) => null,
  signInWithProvider: async () => void {},
  signOut: async () => void {},
  supabase: null,
});

export const AuthContextProvider = ({
  serverSession,
  children,
}: {
  serverSession?: Session | null;
  children: React.ReactNode;
}) => {
  const t = useTranslations();

  const [initial, setInitial] = useState(true);
  const [view, setView] = useState(VIEWS.SIGN_IN);
  const locale = useLocale();
  const router = useRouter();

  const { supabase } = useSupabase();

  const [role, setRole] = useState<ROLE_ENUM | null>(null);
  const { handleMessage, clearMessages } = useMessage();

  const getUser = async () => {
    const { data: user, error } = await supabase
      .from("users")
      .select(
        `
        *
      `
      )
      .eq("id", serverSession?.user?.id)
      .single();

    if (error) {
      console.error(error);
      return null;
    } else {
      return user;
    }
  };

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(serverSession ? "profile-context" : null, getUser);

  // Refresh the Page to Sync Server and Client
  useEffect(() => {
    async function getActiveSession() {
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();
      // Set role for the user and load different layouts
      setRole(activeSession?.user?.user_metadata?.access_level);
    }
    getActiveSession();

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event: any, currentSession: any) => {
      if (
        !serverSession ||
        !currentSession ||
        currentSession?.access_token !== serverSession?.access_token
      ) {
        router.refresh();
      }
      switch (event) {
        case EVENTS.INITIAL_SESSION:
          setInitial(false);
          break;
        case EVENTS.PASSWORD_RECOVERY:
          setView(VIEWS.UPDATE_PASSWORD);
          break;
        case EVENTS.SIGNED_OUT:
          setView(VIEWS.SIGN_IN);
          router.push(`/${locale}/${ROUTE_SIGNIN}`);
          break;
        case EVENTS.USER_UPDATED:
          setView(VIEWS.SIGN_IN);
          break;
        default:
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [supabase, serverSession, router]);

  const signUp = async (payload: SignInWithPasswordCredentials) => {
    try {
      // setLoading(true);

      const { error } = await supabase.auth.signUp(payload);
      if (error) {
        handleMessage({ message: error.message, type: "error" });
      } else {
        clearMessages();
        handleMessage({
          message: t("sign_up_successfully"),
          type: "success",
        });
      }
    } catch (error: any) {
      handleMessage({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      // setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    // setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      handleMessage({ message: error.message, type: "error" });
      // setLoading(false);
      return error;
    }

    router.push(`/${locale}`);

    // TODO: VOLVER PARA INSERTAR ROLE
    /*
    await supabase.rpc("google_auth", {
      email: user?.email,
      token: user?.aud,
    });

    // Send user role producer to the server
    await supabase.rpc("set_claim", {
      uid: user?.id,
      claim: "role",
      value: ROLE_ENUM.Cervezano,
    });

    // Get my claim by role
    await supabase.rpc("get_my_claim", {
      claim: "role",
    });
    */

    // setLoading(false);
  };

  const signInWithProvider = async (provider: Provider) => {
    let isAccessLevel = false;
    let user = null;
    await supabase.auth.signInWithOAuth({ provider }).then(async (res: any) => {
      user = res.user;
      if (user?.user_metadata && user.user_metadata?.access_level) {
        isAccessLevel = user.user_metadata?.access_level ? true : false;
      } else {
        isAccessLevel = false;
      }
    });

    // Check if access level is null or invalid
    if (!isAccessLevel && user) {
      // Send user role producer to the server
      await supabase.rpc("set_claim", {
        // uid: user.id,
        uid: "",
        claim: "access_level",
        value: ROLE_ENUM.Cervezano,
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo(() => {
    return {
      initial,
      user,
      error,
      role,
      isLoading,
      mutate,
      signUp,
      signIn,
      signInWithProvider,
      signOut,
      supabase,
    };
  }, [
    initial,
    user,
    error,
    role,
    isLoading,
    mutate,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    supabase,
  ]);

  return <AuthContext.Provider value={value}> {children}</AuthContext.Provider>;
};
