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

type LayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;

  return (
    <html lang="en">
      <body>
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
                    </div>

                    <main
                      className={classNames("relative mx-auto h-auto w-full ")}
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
      </body>
    </html>
  );
}
