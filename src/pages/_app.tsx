import "../styles/globals.css";
import type { AppProps } from "next/app";
import { supabase } from "../utils/supabaseClient";
import { UserContextProvider } from "../components/Auth/UserContext";
import { QueryClient, QueryClientProvider } from "react-query";
import Header from "../components/Header";
import { Suspense } from "react";
import { ShoppingCartProvider } from "../components/Context/ShoppingCartContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
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
