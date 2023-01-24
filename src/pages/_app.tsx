import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Header from "../components/Header";
import { Suspense } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import Breadcrumb from "../components/Breadcrumb";
import { SessionProvider, useSession } from "next-auth/react";
import { NextAuthContextProvider } from "../components/Auth/NextAuthContext";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

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
  // }, []);

  // Capitalize the first letter of each word in a string
  function titleize(path: string): string {
    return path
      .split("/")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // const { session } = useSession();

  const supabaseAccessToken: string = session?.accessToken || "";

  const supabaseClientOptions: any = {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
  };

  const supabase: SupabaseClient = createClient(
    supabaseUrl,
    supabaseAnonKey,
    supabaseClientOptions
  );

  return (
    <>
      <Suspense fallback="Loading...">
        <SessionProvider session={pageProps.session}>
          <NextAuthContextProvider supabaseClient={supabase}>
            <QueryClientProvider client={queryClient}>
              {/* <ShoppingCartProvider> */}
              {/* <UserContextProvider supabaseClient={supabase}> */}
              <Header />
              {/* <Breadcrumb getDefaultTextGenerator={(path) => titleize(path)} /> */}
              <Component {...pageProps} />
              {/* </UserContextProvider> */}
              {/* </ShoppingCartProvider> */}
            </QueryClientProvider>
          </NextAuthContextProvider>
        </SessionProvider>
      </Suspense>
    </>
  );
}

export default MyApp;

function Auth({ children }: { children: React.ReactNode }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
