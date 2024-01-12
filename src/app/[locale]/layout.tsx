import "../../styles/globals.css";

import Providers from "./providers";
import classNames from "classnames";
import { Suspense } from "react";
import { createServerClient } from "../../utils/supabaseServer";
import { Header } from "./Header";
import { Footer } from "./components/Footer";
import { notFound } from "next/navigation";
import Loading from "./loading";
import { MessageList } from "./components/message/MessageList";

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
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let messages;
  try {
    messages = (await import(`../../lib/translations/messages/${locale}.json`))
      .default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} style={{ overflow: "auto" }}>
      <body>
        <Suspense fallback={<Loading />}>
          <Providers session={session} messages={messages} locale={locale}>
            <div className="relative flex flex-col bg-beer-foam">
              <Header />

              <div
                className={classNames(
                  ""
                )}
              >
                {/* <Breadcrumb /> */}
                {/* <Breadcrumb
                          getDefaultTextGenerator={(path) => titleize(path)}
                        /> */}
              </div>

              <main
                className={classNames(
                  "relative mx-auto flex h-full w-full transform items-start justify-center transition lg:container lg:flex-wrap"
                )}
              >
                <MessageList />
                {children}
              </main>

              <Footer />
            </div>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
