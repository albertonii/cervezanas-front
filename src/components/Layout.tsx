import classNames from "classnames";
import { MessageList, MessageProps, useMessage } from "./message";
import { Breadcrumb, Header, Footer } from "./index";
import { useAuth } from "./Auth";
import {
  AppContextProvider,
  ShoppingCartProvider,
} from "../components/Context/index";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";

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

  // Capitalize the first letter of each word in a string
  function titleize(path: string): string {
    return path
      .split("/")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <>
      <AppContextProvider>
        <QueryClientProvider client={queryClient}>
          <ShoppingCartProvider>
            <Head>
              <title>Cervezanas - Comunidad cervecera</title>
              <meta
                content="width=device-width, initial-scale=1"
                name="viewport"
              />
            </Head>

            <div className="flex flex-col h-screen justify-between relative">
              <Header />

              {loggedIn && (
                <div
                  className={classNames(
                    "w-full h-auto mx-auto relative",
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
                  "w-full h-auto mx-auto relative",
                  usePadding && "px-2 sm:px-6 lg:px-8",
                  useBackdrop && "bg-gray-200"
                )}
              >
                <MessageList messages={messages ?? []} />
                {children}
              </main>

              <Footer>.</Footer>
            </div>
          </ShoppingCartProvider>
        </QueryClientProvider>
      </AppContextProvider>
    </>
  );
}
