import classNames from "classnames";
import Head from "next/head";
import { MessageList, useMessage } from "./message";
import { Breadcrumb, Footer, Header } from "./index";
import { useAuth } from "./Auth";
import {
  AppContextProvider,
  ShoppingCartProvider,
} from "../components/Context/index";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";

type LayoutProps = {
  usePadding?: boolean;
  useBackdrop?: boolean;
  children: React.ReactNode;
};

Layout.defaultProps = {
  usePadding: true,
  useBackdrop: false,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

export function Layout({ children, usePadding, useBackdrop }: LayoutProps) {
  const { messages } = useMessage();
  const { loggedIn } = useAuth();

  const router = useRouter();

  const isHomepage = router.asPath === "/";

  // Capitalize the first letter of each word in a string
  function titleize(path: string): string {
    return path
      .split("/")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <ShoppingCartProvider>
            <Head>
              <title>Cervezanas - Comunidad cervecera</title>
              <meta
                content="width=device-width, initial-scale=1"
                name="viewport"
              />
            </Head>

            <div className="relative flex flex-col bg-beer-foam">
              <Header />
              {loggedIn && !isHomepage && (
                <div
                  className={classNames(
                    "relative mx-auto mt-[10vh] h-auto w-full",
                    usePadding && "px-4 sm:px-6 lg:px-8",
                    useBackdrop && "bg-gray-200"
                  )}
                >
                  <Breadcrumb
                    getDefaultTextGenerator={(path) => titleize(path)}
                  />
                </div>
              )}
              <main
                className={classNames(
                  "relative mx-auto h-auto w-full ",
                  usePadding && "px-2 sm:px-6 lg:px-8",
                  useBackdrop && "bg-gray-200"
                )}
              >
                <MessageList messages={messages ?? []} />
                {children}
              </main>

              <Footer />
            </div>
          </ShoppingCartProvider>
        </AppContextProvider>
      </QueryClientProvider>
    </>
  );
}
