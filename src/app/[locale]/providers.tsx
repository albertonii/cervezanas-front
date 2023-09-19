"use client";

import React from "react";
import SupabaseProvider from "../../context/SupabaseProvider";
import ReactQueryWrapper from "./ReactQueryWrapper";
import { NextIntlClientProvider } from "next-intl";
import { AppContextProvider, ShoppingCartProvider } from "../../context";
import { EventCartProvider } from "../../context/EventCartContext";
import { AuthContextProvider } from "./Auth/AuthContext";
import { MessageProvider } from "./components/message/MessageContext";

interface Props {
  children: React.ReactNode;
  locale: string;
  messages: any;
  session: any;
}

export default function Providers({
  children,
  locale,
  messages,
  session,
}: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SupabaseProvider>
        <MessageProvider>
          <ReactQueryWrapper>
            <AuthContextProvider serverSession={session}>
              <AppContextProvider>
                <ShoppingCartProvider>
                  <EventCartProvider>{children}</EventCartProvider>
                </ShoppingCartProvider>
              </AppContextProvider>
            </AuthContextProvider>
          </ReactQueryWrapper>
        </MessageProvider>
      </SupabaseProvider>
    </NextIntlClientProvider>
  );
}
