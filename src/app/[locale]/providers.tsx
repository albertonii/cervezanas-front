"use client";

import React from "react";
import ReactQueryWrapper from "./ReactQueryWrapper";
import { NextIntlClientProvider } from "next-intl";
import { EventCartProvider } from "../../../context/EventCartContext";
import { AuthContextProvider } from "./Auth/AuthContext";
import { MessageProvider } from "./components/message/MessageContext";
import { AppContextProvider } from "../../../context/AppContext";
import { ShoppingCartProvider } from "../../../context/ShoppingCartContext";

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
    </NextIntlClientProvider>
  );
}
