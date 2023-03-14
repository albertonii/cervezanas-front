import "../styles/globals.css";
import SEO from "../../next-seo.config";
import Head from "next/head";
import Script from "next/script";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { Suspense, useEffect, useState } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import { MessageProvider } from "../components/message";
import { AuthContextProvider } from "../components/Auth";
import { DefaultSeo } from "next-seo";
import {
  AppContextProvider,
  ShoppingCartProvider,
} from "../components/Context/index";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Spinner } from "../components/common";

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

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const pageMeta = (Component as any)?.defaultProps?.meta || {};
  const pageSEO = { ...SEO, ...pageMeta };

  // const { session } = useSession();

  const supabaseAccessToken: string = session?.accessToken || "";

  const supabaseClientOptions: any = {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
  };

  /*
  const supabase: SupabaseClient = createClient(
    supabaseUrl,
    supabaseAnonKey,
    supabaseClientOptions
  );
  */

  const [supabase] = useState(() =>
    createBrowserSupabaseClient({
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
      options: supabaseClientOptions,
    })
  );

  // TODO: If not sb-access-token but supabase.auth.token in localhost -> Sign out o refresh sb-access-token
  useEffect(() => {}, []);

  // useEffect(() => {
  //   const { data: authListener } = supabase.auth.onAuthStateChange(
  //     async (event, session) => {
  //       if (event === "SIGNED_IN") {
  //         setSupabaseCookie(session!);
  //       }
  //       if (event === "SIGNED_OUT") {
  //         removeSupabaseCookie();
  //       }
  //     }
  //   );

  //   const setSupabaseCookie = async (session: Session) => {
  //     axios.post("/api/auth/set-supabase-cookie", {
  //       event: session ? "SIGNED_IN" : "SIGNED_OUT",
  //       session,
  //       headers: new Headers({ "Content-Type": "application/json" }),
  //       credentials: "same-origin",
  //     });
  //   };

  //   const removeSupabaseCookie = async () => {
  //     axios.post("/api/auth/remove-supabase-access-cookie", {
  //       headers: new Headers({ "Content-Type": "application/json" }),
  //       credentials: "same-origin",
  //     });

  //     axios.post("/api/auth/remove-supabase-refresh-cookie", {
  //       headers: new Headers({ "Content-Type": "application/json" }),
  //       credentials: "same-origin",
  //     });
  //   };

  //   return () => {
  //     authListener?.unsubscribe();
  //   };
  // }, [supabase.auth]);

  return (
    <>
      <Script src="/tw-elements/dist/js/index.min.js"></Script>

      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DefaultSeo {...pageSEO} />

      <MessageProvider>
        <Suspense fallback={<Spinner color="beer-blonde" size={"medium"} />}>
          <AuthContextProvider supabaseClient={supabase}>
            <AppContextProvider>
              <QueryClientProvider client={queryClient}>
                <ShoppingCartProvider>
                  <Component {...pageProps} />
                </ShoppingCartProvider>
              </QueryClientProvider>
            </AppContextProvider>
          </AuthContextProvider>
        </Suspense>
      </MessageProvider>
    </>
  );
}

export default MyApp;
