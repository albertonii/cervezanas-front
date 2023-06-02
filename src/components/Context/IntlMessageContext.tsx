"use client";

import { IntlError, IntlErrorCode, NextIntlClientProvider } from "next-intl";
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
  function onError(error: IntlError) {
    if (error.code === IntlErrorCode.MISSING_MESSAGE) {
      // Missing translations are expected and should only log an error
      console.error(error);
    } else {
      // Other errors indicate a bug in the app and should be reported
      // reportToErrorTracking(error);
    }
  }

  function getMessageFallback({
    namespace,
    key,
    error,
  }: {
    namespace: string;
    key: any;
    error: any;
  }) {
    const path = [namespace, key].filter((part) => part != null).join(".");

    if (error.code === IntlErrorCode.MISSING_MESSAGE) {
      return `${path} is not yet translated`;
    } else {
      return `Dear developer, please fix this message: ${path}`;
    }
  }

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={onError}
      // getMessageFallback={getMessageFallback}
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
