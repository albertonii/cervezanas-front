import "../styles/globals.css";
import type { AppProps } from "next/app";
import { supabase } from "../utils/supabaseClient";
import { UserContextProvider } from "../components/Auth/UserContext";
import { QueryClient, QueryClientProvider } from "react-query";
import Header from "../components/Header";
import { Suspense, useEffect } from "react";
import { ShoppingCartProvider } from "../components/Context/ShoppingCartContext";
import axios from "axios";
import { Session } from "@supabase/supabase-js";
import { config } from "@fortawesome/fontawesome-svg-core";

// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(event);
        if (event === "SIGNED_IN") {
          setSupabaseCookie(session!);
        }
        if (event === "SIGNED_OUT") {
          removeSupabaseCookie();
        }
      }
    );

    const setSupabaseCookie = async (session: Session) => {
      axios.post("/api/auth/set-supabase-cookie", {
        event: session ? "SIGNED_IN" : "SIGNED_OUT",
        session,
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
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

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <>
      <Suspense fallback="Loading...">
        <QueryClientProvider client={queryClient}>
          <ShoppingCartProvider>
            <UserContextProvider supabaseClient={supabase}>
              <Header />
              <Component {...pageProps} />
            </UserContextProvider>
          </ShoppingCartProvider>
        </QueryClientProvider>
      </Suspense>
    </>
  );
}

export default MyApp;
