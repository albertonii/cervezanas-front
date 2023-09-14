"use client";

import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { AppContextProvider, ShoppingCartProvider } from "../../context";
import { EventCartProvider } from "../../context/EventCartContext";
import SupabaseProvider from "../../context/SupabaseProvider";
import { AuthContextProvider } from "./Auth/AuthContext";
import { MessageProvider } from "./components/message/MessageContext";
import ReactQueryWrapper from "./ReactQueryWrapper";

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
