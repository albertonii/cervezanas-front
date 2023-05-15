"use client";

import React, { useEffect, useState, createContext, useMemo } from "react";
import { Provider, SupabaseClient } from "@supabase/supabase-js";
import { useMessage } from "../message";
import { ROLE_ENUM, ISignUp, IUser } from "../../lib/interfaces";

import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseBrowser";

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
  user: IUser | null;
  role: ROLE_ENUM | null;
  loading: boolean;
  signUp: (payload: ISignUp) => void;
  signIn: (payload: any) => Promise<any>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => void;
  supabaseClient: SupabaseClient | null;
  userLoading: boolean;
  loggedIn: boolean;
}

export const AuthContext = createContext<AuthSession>({
  user: null,
  role: null,
  loading: false,
  signUp: () => void {},
  signIn: () => Promise.resolve(),
  signInWithProvider: () => Promise.resolve(),
  signOut: () => void {},
  supabaseClient: null,
  userLoading: true,
  loggedIn: false,
});

export interface Props {
  [propName: string]: any;
  accessToken: string;
}

export const AuthContextProvider = (props: Props) => {
  const { accessToken } = props;
  const [initial, setInitial] = useState(true);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [view, setView] = useState(VIEWS.SIGN_IN);
  const router = useRouter();

  // const user = useUser();

  const [role, setRole] = useState<ROLE_ENUM | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const { handleMessage, clearMessages } = useMessage();

  useEffect(() => {
    async function getActiveSession() {
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();
      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      setInitial(false);
    }
    getActiveSession();

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event: any, currentSession: any) => {
      if (currentSession?.access_token !== accessToken) {
        router.refresh();
      }

      setSession(currentSession);
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
  }, []);

  /*
  useEffect(() => {
    if (user) {
      setUserLoading(false);
      setLoggedIn(true);
    } else {
      setUserLoading(false);
      setLoggedIn(false);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (event === "SIGNED_IN") {
          const user = session?.user ?? null;

          // await setSupabaseCookie(event, session as Session);

          setLoggedIn(true);

          clearMessages();

          handleMessage({
            type: "success",
            message: `${t("welcome")}, ${user?.email}`,
          });
        }

        if (event === "SIGNED_OUT") {
          /*
          removeSupabaseCookie().then(() => {
            setLoggedIn(false);
            window.location.href = ROUTE_SIGNIN; // There is a bug in SP not deleting sb-access/refresh-token cookie unless page is reloaded
          });
          */
  /*
        }

        setUserLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [clearMessages, handleMessage, supabase.auth, t]);
  */

  // TODO: OPTIMIZAR ESTO. Si se actualiza el usuario se ejecuta de nuevo
  /*
  useEffect(() => {
    if (!user) return;

    const getRole = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user?.id);

      if (error) {
        console.error(error);
        return;
      }

      setRole(data[0].role);
    };

    getRole();
  }, [supabase, user]);
  */

  const signUp = async (payload: ISignUp) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp(
        payload.userCredentials,
        payload.options
      );
      if (error) {
        handleMessage({ message: error.message, type: "error" });
        setLoggedIn(false);
      } else {
        clearMessages();
        handleMessage({
          message:
            "Signup successful. Please check your inbox for a confirmation email!",
          type: "success",
        });
        setLoggedIn(true);
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

  const signIn = async (payload: any) => {
    setLoading(true);

    const { error, user } = await supabase.auth.signInWithPassword(payload);

    if (error) {
      handleMessage({ message: error.message, type: "error" });
      setLoggedIn(false);
      setLoading(false);
      return error;
    }

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

    setLoggedIn(true);
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

  /*
  const setSupabaseCookie = async (
    event: AuthChangeEvent,
    session: Session
  ) => {
    axios.post("/api/auth/set-supabase-cookie", {
      event: session ? "SIGNED_IN" : "SIGNED_OUT",
      session,
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ event, session }),
    });
  };

  const removeSupabaseCookie = async () => {
    return await axios
      .post("/api/auth/remove-supabase-access-cookie", {
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
      })
      .then(() => {
        axios.post("/api/auth/remove-supabase-refresh-cookie", {
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
        });
      });
  };
  */

  const signOut = async () => {
    setLoggedIn(false);

    await supabase.auth.signOut();
  };

  const value = useMemo(() => {
    return {
      user,
      role,
      loading,
      signUp,
      signIn,
      signInWithProvider,
      signOut,
      supabaseClient: supabase,
      loggedIn,
      userLoading,
    };
  }, [
    user,
    role,
    loading,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    supabase,
    loggedIn,
    userLoading,
  ]);

  return <AuthContext.Provider value={value} {...props} />;
};
