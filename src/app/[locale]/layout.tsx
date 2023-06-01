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
import { IntlError, IntlErrorCode, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { deleteAppClientCache } from "next/dist/server/lib/render-server";
import IntlMessageContext from "../../components/Context/IntlMessageContext";

type LayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

// This will ensure that every time a new route is loaded, our session data in RootLayout will always be up-to-date.
export const revalidate = 0;

export default async function RootLayout({
  children,
  params: { locale },
}: LayoutProps) {
  const sessionData = getSession();
  const messagesData = getMessages(locale);
  const [session, messages] = await Promise.all([sessionData, messagesData]);

  return (
    <html lang={locale}>
      <body>
        <IntlMessageContext locale={locale} messages={messages}>
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
        </IntlMessageContext>
      </body>
    </html>
  );
}

async function getMessages(locale: string) {
  let messages;
  try {
    messages = (await import(`../../lib/translations/messages/${locale}.json`))
      .default;
    return messages;
  } catch (error) {
    notFound();
  }
}

async function getSession() {
  const supabase = createServerClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();


  if (error) console.error(error);
  return session;
}
