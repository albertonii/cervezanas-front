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
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import CommingSoon from "./commingSoon";

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
  // const messagesData = getMessages(locale);
  const [session] = await Promise.all([sessionData]);
  // const [session, messages] = await Promise.all([sessionData, messagesData]);

  // const locale = useLocale();

  // // Show a 404 error for unknown locales
  // if (params.locale !== locale) {
  //   notFound();
  // }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <CommingSoon />
        {/* <NextIntlClientProvider locale={locale} messages={messages}>
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
                            <Breadcrumb
                          getDefaultTextGenerator={(path) => titleize(path)}
                        /> 
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
        </NextIntlClientProvider> */}
      </body>
    </html>
  );
}

async function getMessages(locale: string) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
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
