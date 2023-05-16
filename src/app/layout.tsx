import "../styles/globals.css";

import classNames from "classnames";
import ReactQueryWrapper from "./ReactQueryWrapper";
import {
  AppContextProvider,
  ShoppingCartProvider,
} from "../components/Context/index";
import { Footer, Header } from "../components";
import { MessageList, MessageProvider } from "../components/message";
import { AuthContextProvider } from "../components/Auth";
import { createServerClient } from "../utils/supabaseServer";
import SupabaseProvider from "../components/Context/SupabaseProvider";
import SupabaseListener from "../components/Context/SupabaseListener";

type LayoutProps = {
  children: React.ReactNode;
};

// This will ensure that every time a new route is loaded, our session data in RootLayout will always be up-to-date.
export const revalidate = 0;

export default async function RootLayout({ children }: LayoutProps) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;

  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <SupabaseListener />
          <MessageProvider>
            <ReactQueryWrapper>
              <AuthContextProvider accessToken={accessToken}>
                <AppContextProvider>
                  <ShoppingCartProvider>
                    <div className="relative flex flex-col bg-beer-foam">
                      <Header />

                      <div
                        className={classNames(
                          "relative mx-auto mt-[10vh] h-auto w-full"
                        )}
                      >
                        {/* <Breadcrumb /> */}
                        {/* <Breadcrumb
                          getDefaultTextGenerator={(path) => titleize(path)}
                        /> */}
                      </div>

                      <main
                        className={classNames(
                          "relative mx-auto h-auto w-full "
                        )}
                      >
                        <MessageList />
                        {children}
                      </main>

                      <Footer />
                    </div>
                  </ShoppingCartProvider>
                </AppContextProvider>
              </AuthContextProvider>
            </ReactQueryWrapper>
          </MessageProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
