import "../styles/globals.css";
import type { AppProps } from "next/app";
import { supabase } from "../utils/supabaseClient";
import { UserContextProvider } from "../components/Auth/UserContext";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider supabaseClient={supabase}>
        <Component {...pageProps} />
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
