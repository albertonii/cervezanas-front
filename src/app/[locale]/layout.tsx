import "../../styles/globals.css";

import Providers from "./providers";
import Loading from "./loading";
import classNames from "classnames";
import readUserSession from "../../lib/actions";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MessageList } from "./components/message/MessageList";
import dynamic from "next/dynamic";

const DynamicHeader = dynamic(() => import("./Header"), {
  loading: () => <p>Loading...</p>,
});

const DynamicFooter = dynamic(() => import("./components/Footer"), {
  loading: () => <p>Loading...</p>,
});

type LayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

// This will ensure that every time a new route is loaded, our session data in RootLayout will always be up-to-date.
export const revalidate = 0;

export default async function AppLocaleLayout({
  children,
  params: { locale },
}: LayoutProps) {
  const {
    data: { session },
  } = await readUserSession();

  let messages;
  try {
    messages = (await import(`../../lib/translations/messages/${locale}.json`))
      .default;
  } catch (error) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <Providers session={session} messages={messages} locale={locale}>
        <div className="relative flex flex-col bg-beer-foam">
          <DynamicHeader />

          <div
            className={classNames("relative mx-auto mt-[10vh] h-auto w-full")}
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

          <DynamicFooter />
        </div>
      </Providers>
    </Suspense>
  );
}
