"use client";

import useSWR from "swr";
import React, { useEffect, useState, createContext, useMemo } from "react";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { Database } from "../../../lib/schema";
import { ROUTE_SIGNIN } from "../../../config";
import { EVENTS, VIEWS } from "../../../constants";
import { IUserProfile } from "../../../lib/types";
import { useLocale } from "next-intl";
import { useMessage } from "../components/message/useMessage";
import { createBrowserClient } from "../../../utils/supabaseBrowser";
import {
  AuthResponse,
  Provider,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";
// import { Session, SupabaseClient } from "@supabase/auth-helpers-nextjs";

enum PROVIDER_TYPE {
  GOOGLE = "google",
}

enum ROLE_ENUM {
  Cervezano = "consumer",
  Productor = "producer",
  Moderator = "moderator",
  Distributor = "distributor",
  Admin = "admin",
}

export type SignUpWithPasswordCredentials = {
  /** The user's email address. */
  email: string;
  /** The user's password. */
  password: string;
  options?: {
    /** The redirect url embedded in the email link */
    emailRedirectTo?: string;
    /**
     * A custom data object to store the user's metadata. This maps to the `auth.users.user_metadata` column.
     *
     * The `data` should be a JSON object that includes user-specific info, such as their first and last name.
     */
    data?: object;
    /** Verification token received when the user completes the captcha on the site. */
    captchaToken?: string;
  };
};
export interface AuthSession {
  initial: boolean;
  user: any;
  error: any;
  isLoading: boolean;
  signUp: (payload: SignUpWithPasswordCredentials) => void;
  signIn: (email: string, password: string) => void;
  signInWithProvider: (provider: Provider) => void;
  signOut: () => Promise<void>;
  supabase: SupabaseClient<Database>;
  role: ROLE_ENUM | null;
  provider: PROVIDER_TYPE | null;
  isLoggedIn: boolean;
}

const supabaseClient = createBrowserClient();

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
  supabase: supabaseClient,
  provider: null,
  isLoggedIn: false,
});

export const AuthContextProvider = ({
  serverSession,
  children,
}: {
  serverSession?: Session | null;
  children: React.ReactNode;
}) => {
  const [initial, setInitial] = useState(true);
  const [view, setView] = useState(VIEWS.SIGN_IN);
  const locale = useLocale();
  const router = useRouter();

  // const { supabase } = useAuth();
  // const [supabase] = useState(() => supabaseClient); // Not working
  // const supabase = createBrowserClient();
  const [supabase] = useState(supabaseClient);

  const [role, setRole] = useState<ROLE_ENUM | null>(null);
  const [provider, setProvider] = useState<PROVIDER_TYPE | null>(null);

  const { handleMessage, clearMessages } = useMessage();

  useEffect(() => {
    const loadSupabaseBrowser = async () => await supabaseClient;
    loadSupabaseBrowser();
  }, []);

  const getUser = async () => {
    if (!serverSession) return null;

    const { data: user, error } = await supabase
      .from("users")
      .select(
        `
          *
        `
      )
      .eq("id", serverSession.user.id)
      .single();

    if (error) {
      console.error(error);
      return null;
    } else {
      return user as IUserProfile;
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

      // If the user login with the provider the role is going to be consumer
      if (
        activeSession?.user?.app_metadata?.provider?.includes(
          PROVIDER_TYPE.GOOGLE
        )
      ) {
        setRole(ROLE_ENUM.Cervezano);
        setProvider(PROVIDER_TYPE.GOOGLE);
        return;
      }

      // Set role for the user and load different layouts
      setRole(activeSession?.user?.user_metadata?.access_level);
    }
    getActiveSession();

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(
      async (event: any, currentSession: any) => {
        if (
          !serverSession ||
          !currentSession ||
          currentSession?.access_token !== serverSession?.access_token
        ) {
          // trigger a router refresh whenever the current session changes
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
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [supabase, serverSession, router]);

  const signUp = async (payload: SignUpWithPasswordCredentials) => {
    try {
      // Check if user exists
      const { data: user, error: emailError } = await supabase
        .from("users")
        .select(
          `
          *
        `
        )
        .eq("email", payload.email);

      if (user && user.length > 0) {
        handleMessage({
          message: "user_already_registered",
          type: "error",
        });
        return;
      }

      if (emailError) {
        handleMessage({
          message: emailError.message,
          type: "error",
        });
        return;
      }

      const { error, data } = (await supabase.auth.signUp(
        payload
      )) as AuthResponse;

      if (!data || !data.user) return;

      // Get access_level from the user
      const access_level = data.user?.user_metadata.access_level;

      if (access_level === ROLE_ENUM.Productor) {
        const { error: roleError } = await supabase
          .from("producer_user")
          .insert({
            user: data.user.id,
          });

        if (roleError) {
          handleMessage({
            message: roleError.message,
            type: "error",
          });
          return;
        }
      }

      if (error) {
        handleMessage({ message: error.message, type: "error" });
      } else {
        clearMessages();
        handleMessage({
          message: "sign_up_successfully",
          type: "success",
        });
      }
    } catch (error: any) {
      handleMessage({
        message: error.error_description ?? error,
        type: "error",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      handleMessage({ message: error.message, type: "error" });
      return error;
    }

    // router.push(`/${locale}`);

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
    // let isAccessLevel = false;
    // let user = null;

    // Si acceden con Google, por defecto son consumidores
    // Google does not send out a refresh token by default, so you will need to pass
    // parameters like these to signInWithOAuth() in order to extract the provider_refresh_token:
    await supabase.auth
      .signInWithOAuth({
        provider,
        options: {
          // redirectTo: `${window.location.origin}/${locale}`,
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })
      .then(async (res: any) => {
        // user = res.user;
        // if (user?.user_metadata && user.user_metadata?.access_level) {
        //   isAccessLevel = user.user_metadata?.access_level ? true : false;
        // } else {
        //   isAccessLevel = false;
        // }
      });

    // router.push(`/${locale}`);

    // // Check if access level is null or invalid
    // if (!isAccessLevel && user) {
    //   // Send user role producer to the server
    //   await supabase.rpc("set_claim", {
    //     // uid: user.id,
    //     uid: "",
    //     claim: "access_level",
    //     value: ROLE_ENUM.Cervezano,
    //   });
    // }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    redirect(VIEWS.SIGN_IN, RedirectType.push);
    // router.push(`/${locale}/${ROUTE_SIGNIN}`);
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
      provider,
      isLoggedIn: !!user,
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
    provider,
  ]);

  return <AuthContext.Provider value={value}> {children}</AuthContext.Provider>;
};
