import "../../styles/globals.css";

import SupabaseProvider from "../../components/Context/SupabaseProvider";
import classNames from "classnames";
import ReactQueryWrapper from "./ReactQueryWrapper";
import {
  AppContextProvider,
  ShoppingCartProvider,
} from "../../components/Context/index";
import { MessageProvider } from "../../components/message";
import { MessageList } from "../../components/message";
import { AuthContextProvider } from "../../components/Auth";
import { createServerClient } from "../../utils/supabaseServer";
import { Header } from "./Header";
import { Footer } from "./components";
import { EventCartProvider } from "../../components/Context/EventCartContext";

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

  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <MessageProvider>
            <ReactQueryWrapper>
              <AuthContextProvider serverSession={session}>
                <AppContextProvider>
                  <ShoppingCartProvider>
                    <EventCartProvider>
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
                            "relative mx-auto flex h-full min-h-screen w-full transform items-start justify-center pt-20 transition lg:container lg:flex-wrap"
                          )}
                        >
                          <MessageList />
                          {children}
                        </main>

                        <Footer />
                      </div>
                    </EventCartProvider>
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
