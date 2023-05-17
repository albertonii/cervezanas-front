"use client";

import React, { useEffect, useState, createContext, useMemo } from "react";
import { Provider, Session, SupabaseClient } from "@supabase/supabase-js";

import { useRouter } from "next/navigation";
import { useSupabase } from "../Context/SupabaseProvider";
import { ISignUp, IUser, ROLE_ENUM } from "../../lib/types.d";
import useMessage from "../message/useMessage";

export const VIEWS = {
  SIGN_IN: "sign_in",
  SIGN_UP: "sign_up",
  FORGOTTEN_PASSWORD: "forgotten_password",
  MAGIC_LINK: "magic_link",
  UPDATE_PASSWORD: "update_password",
};

export const EVENTS = {
  PASSWORD_RECOVERY: "PASSWORD_RECOVERY",
  SIGNED_OUT: "SIGNED_OUT",
  USER_UPDATED: "USER_UPDATED",
};

export interface AuthSession {
  initial: boolean;
  user: IUser | null;
  role: ROLE_ENUM | null;
  loading: boolean;
  signUp: (payload: ISignUp) => void;
  signIn: (email: string, password: string) => void;
  signInWithProvider: (provider: Provider) => void;
  signOut: () => Promise<void>;
  supabase: SupabaseClient | null;
}

export const AuthContext = createContext<AuthSession>({
  initial: true,
  user: null,
  role: null,
  loading: false,
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
  const [initial, setInitial] = useState(true);
  const [user, setUser] = useState(null);
  const [view, setView] = useState(VIEWS.SIGN_IN);
  const router = useRouter();

  const { supabase } = useSupabase();

  const [role, setRole] = useState<ROLE_ENUM | null>(null);
  const [loading, setLoading] = useState(false);
  const { handleMessage, clearMessages } = useMessage();

  // Get USER
  const getUser = async () => {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", serverSession?.user?.id)
      .single();
    if (error) {
      console.log(error);
      return null;
    } else {
      return user;
    }
  };

  // Refresh the Page to Sync Server and Client
  useEffect(() => {
    async function getActiveSession() {
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();
      setRole(activeSession?.user?.app_metadata?.role);
      setInitial(false);
    }
    getActiveSession();

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event: any, currentSession: any) => {
      if (currentSession?.access_token !== serverSession?.access_token) {
        router.refresh();
      }

      setUser(currentSession?.user ?? null);

      switch (event) {
        case EVENTS.PASSWORD_RECOVERY:
          setView(VIEWS.UPDATE_PASSWORD);
          break;
        case EVENTS.SIGNED_OUT:
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

  const signUp = async (payload: ISignUp) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp(
        payload.userCredentials
        // payload.options
      );
      if (error) {
        handleMessage({ message: error.message, type: "error" });
      } else {
        clearMessages();
        handleMessage({
          message:
            "Signup successful. Please check your inbox for a confirmation email!",
          type: "success",
        });
      }
    } catch (error: any) {
      handleMessage({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      handleMessage({ message: error.message, type: "error" });
      setLoading(false);
      return error;
    }

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

    setLoading(false);
  };

  const signInWithProvider = async (provider: Provider) => {
    let isAccessLevel = false;
    let user = null;
    await supabase.auth.signInWithOAuth({ provider }).then(async (res: any) => {
      user = res.user;
      isAccessLevel = user.user_metadata.access_level ? true : false;
    });
    // TODO: Volver aquí para introducir el access_level si no existe

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
    router.push("/signin");
  };

  const value = useMemo(() => {
    return {
      initial,
      user,
      role,
      loading,
      signUp,
      signIn,
      signInWithProvider,
      signOut,
      supabase,
    };
  }, [
    initial,
    user,
    role,
    loading,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    supabase,
  ]);

  return <AuthContext.Provider value={value}> {children}</AuthContext.Provider>;
};
