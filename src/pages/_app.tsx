import "../styles/globals.css";
import type { AppProps } from "next/app";
import { supabase } from "../utils/supabaseClient";
import { UserContextProvider } from "../components/Auth/UserContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </UserContextProvider>
  );
}

export default MyApp;
