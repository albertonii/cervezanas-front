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
import {
  ROUTE_HOME,
  ROUTE_AUTH,
  ROUTE_SIGNIN,
  ROUTE_SIGNOUT,
  ROUTE_SIGNUP,
} from "../../config";
import { SignUpInterface } from "../../lib/interfaces";
import { ROLE_ENUM } from "./SignUpForm";
import axios from "axios";

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

        Router.push(ROUTE_HOME);
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
    let isAccessLevel: boolean = false;
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
    axios.post("/api/auth/remove-supabase-access-cookie", {
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
    });

    axios.post("/api/auth/remove-supabase-refresh-cookie", {
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
    });
  };

  const signOut = async () => {
    setLoggedIn(false);
    setUser(null);

    await supabase.auth.signOut();
    Router.push(ROUTE_SIGNIN);
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
        console.log(event);
        console.log(session);
        if (event === "SIGNED_IN") {
          const user = session?.user! ?? null;

          if (
            session?.user?.identities?.find((e) => {
              return e.provider === "email";
            })
          ) {
            await setSupabaseCookie(event, session!);
          }

          setUser(user);
          setLoggedIn(true);

          handleMessage!({
            type: "success",
            message: `Welcome, ${user?.email}`,
          });
        }

        if (event === "SIGNED_OUT") {
          removeSupabaseCookie();
          setUser(null);
          Router.push(ROUTE_AUTH);
        }

        setUserLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [handleMessage, supabase.auth]);

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
