"use client";

import { NextIntlClientProvider } from "next-intl";
import { createContext, useContext, useEffect, useState } from "react";
import { Spinner } from "../common";
import { MessageProps } from "../message";

type IntlMessageContext = {
  messages: MessageProps;
  locale: string;
};

const Context = createContext<IntlMessageContext | undefined>(undefined);

export default function IntlMessagesProvider({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode;
  messages: any;
  locale: string;
}) {
  //   const [messages, setMessages] = useState();

  //   useEffect(() => {
  //     console.log(m);
  //     setMessages(m);
  //   }, [m]);

  //   if (!messages) return <Spinner color="beer-blonde" size="medium" />;

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={(e) => {
        console.error(e);
      }}
    >
      <>{children}</>
    </NextIntlClientProvider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};
