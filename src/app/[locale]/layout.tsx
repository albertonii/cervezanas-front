import "../../styles/globals.css";
import { headers } from "next/headers";

import Providers from "./providers";
import Loading from "./loading";
import classNames from "classnames";
import readUserSession from "../../lib/actions";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MessageList } from "./components/message/MessageList";
import Header from "./Header";
import Footer from "./components/Footer";

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

  const deviceType = getDeviceType();

  return (
    <Suspense fallback={<Loading />}>
      <Providers session={session} messages={messages} locale={locale}>
        <section className="relative flex flex-col bg-beer-foam">
          <Header deviceType={deviceType} />
          <section
            className={classNames(
              "relative mx-auto mt-[10vh] min-h-0 w-full overflow-auto"
              // "h-[calc(100vh - 340px)] mx-auto mt-[10vh] w-full overflow-y-auto"
            )}
          >
            {/* <Breadcrumb getDefaultTextGenerator={(path) => titleize(path)} /> */}
          </section>

          <main
            className={classNames(
              "relative mx-auto flex min-h-screen w-full transform items-start justify-center pt-20 transition lg:container lg:flex-wrap"
            )}
          >
            <MessageList />

            <div>{children}</div>
          </main>
          <Footer />
        </section>
      </Providers>
    </Suspense>
  );
}

export function getDeviceType() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  return userAgent!.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  )
    ? "mobile"
    : "desktop";
}
