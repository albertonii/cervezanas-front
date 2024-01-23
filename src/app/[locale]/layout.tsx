import "../../styles/globals.css";

import Providers from "./providers";
import Loading from "./loading";
import classNames from "classnames";
import readUserSession from "../../lib/actions";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MessageList } from "./components/message/MessageList";
import Header from "./Header";
import Footer from "./components/Footer";
import createServerClient from "../../utils/supabaseServer";
import { INotification } from "../../lib/types";

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

  const notifications = await getNotifications();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Providers session={session} messages={messages} locale={locale}>
          <section className="relative flex flex-col bg-beer-foam">
            <Header notifications={notifications ?? []} />
            <section
              className={classNames(
                "relative mx-auto min-h-0 w-full overflow-auto"
                // "h-[calc(100vh - 340px)] mx-auto mt-[10vh] w-full overflow-y-auto"
              )}
            >
              {/* <Breadcrumb getDefaultTextGenerator={(path) => titleize(path)} /> */}
            </section>

            <main
              className={classNames(
                "relative mx-auto min-h-screen w-full transform transition lg:container"
              )}
            >
              <MessageList />
              {children}
            </main>
            <Footer />
          </section>
        </Providers>
      </Suspense>
    </>
  );
}

const getNotifications = async () => {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  const { data: notifications, error: notificationsError } = await supabase
    .from("notifications")
    .select(
      `
      *
    `
    )
    .eq("read", false)
    .eq("user_id", session.user.id);

  if (notificationsError) throw notificationsError;
  return notifications as INotification[];
};
