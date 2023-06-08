"use client";

import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { AuthContextProvider } from "../../components/Auth";
import {
  AppContextProvider,
  ShoppingCartProvider,
} from "../../components/Context";
import { EventCartProvider } from "../../components/Context/EventCartContext";
import SupabaseProvider from "../../components/Context/SupabaseProvider";
import { MessageProvider } from "../../components/message";
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
