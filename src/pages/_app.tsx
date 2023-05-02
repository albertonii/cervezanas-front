import "../styles/globals.css";
import SEO from "../../next-seo.config";
import Script from "next/script";
import type { AppProps } from "next/app";
import { Suspense, useState } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import { MessageProvider } from "../components/message";
import { AuthContextProvider } from "../components/Auth";
import { DefaultSeo } from "next-seo";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Spinner } from "../components/common";
import { Layout } from "../components";

// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const pageMeta = (Component as any)?.defaultProps?.meta || {};
  const pageSEO = { ...SEO, ...pageMeta };

  const supabaseAccessToken: string = session?.accessToken || "";

  const supabaseClientOptions: any = {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
  };

  const [supabase] = useState(() =>
    createBrowserSupabaseClient({
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
      options: supabaseClientOptions,
    })
  );

  return (
    <>
      {/* <Script src="/tw-elements/dist/js/index.min.js"></Script> */}

      <DefaultSeo {...pageSEO} />

      <MessageProvider>
        <Suspense fallback={<Spinner color="beer-blonde" size={"medium"} />}>
          <AuthContextProvider supabaseClient={supabase}>
            {/* <PayPalScriptProvider
              options={{
                "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
              }}
            > */}
            <Layout usePadding={false} useBackdrop={false}>
              <Component {...pageProps} />
            </Layout>
            {/* </PayPalScriptProvider> */}
          </AuthContextProvider>
        </Suspense>
      </MessageProvider>
    </>
  );
}

export default MyApp;
