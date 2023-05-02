import axios from "axios";
import React, { useEffect, useState, createContext } from "react";
import {
  SupabaseClient,
  Session,
  UserCredentials,
  Provider,
  AuthChangeEvent,
} from "@supabase/supabase-js";
import { useMessage } from "../message";
import { ROUTE_SIGNIN } from "../../config";
import { ROLE_ENUM, ISignUp, IUser } from "../../lib/interfaces";
import { useTranslation } from "react-i18next";

export interface AuthSession {
  user: IUser | null;
  role: ROLE_ENUM | null;
  loading: boolean;
  setUser: (user: IUser | null) => void;
  signUp: (payload: ISignUp) => void;
  signIn: (payload: UserCredentials) => Promise<any>;
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
  setUser: () => void {},
  signUp: () => void {},
  signIn: () => Promise.resolve(),
  signInWithProvider: () => Promise.resolve(),
  signOut: () => void {},
  supabaseClient: null,
  userLoading: true,
  loggedIn: false,
});

export interface Props {
  supabaseClient: SupabaseClient;
  [propName: string]: any;
}

export const AuthContextProvider = (props: Props) => {
  const { supabaseClient: supabase } = props;
  const [user, setUser] = useState<IUser | null>(null);
  const [role, setRole] = useState<ROLE_ENUM | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const { handleMessage, clearMessages } = useMessage();

  const { t } = useTranslation();

  useEffect(() => {
    const user = supabase.auth.user();

    if (user) {
      setUser(user as IUser);
      setUserLoading(false);
      setLoggedIn(true);
    } else {
      setUserLoading(false);
      setLoggedIn(false);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          const user = session?.user ?? null;

          await setSupabaseCookie(event, session as Session);

          setUser(user as IUser);
          setLoggedIn(true);

          clearMessages();

          handleMessage({
            type: "success",
            message: `${t("welcome")}, ${user?.email}`,
          });
        }

        if (event === "SIGNED_OUT") {
          removeSupabaseCookie().then(() => {
            setUser(null);
            setLoggedIn(false);
            window.location.href = ROUTE_SIGNIN; // There is a bug in SP not deleting sb-access/refresh-token cookie unless page is reloaded
          });
        }

        setUserLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [clearMessages, handleMessage, supabase.auth, t]);

  // TODO: OPTIMIZAR ESTO. Si se actualiza el usuario se ejecuta de nuevo
  useEffect(() => {
    if (!user) return;

    const getRole = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user?.id);

      if (error) {
        console.log(error);
        return;
      }

      setRole(data[0].role);
    };

    getRole();
  }, [supabase, user]);

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

  const signIn = async (payload: UserCredentials) => {
    setLoading(true);

    const { error, user } = await supabase.auth.signIn(payload);

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
    await supabase.auth.signIn({ provider }).then(async (res) => {
      isAccessLevel = res.user?.user_metadata.access_level ? true : false;
    });
    // TODO: Volver aquí para introducir el access_level si no existe

    // Check if access level is null or invalid
    if (!isAccessLevel) {
      // Send user role producer to the server
      await supabase.rpc("set_claim", {
        uid: user?.id,
        claim: "access_level",
        value: ROLE_ENUM.Cervezano,
      });
    }
  };

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

  const signOut = async () => {
    setLoggedIn(false);
    setUser(null);

    await supabase.auth.signOut();
  };

  const value = {
    user,
    role,
    loading,
    setUser: (user: IUser | null) => setUser(user),
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
