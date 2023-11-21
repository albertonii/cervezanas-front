import messages from "../../lib/translations/messages/es.json";
import React, { FC, ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { MessageProvider } from "../../app/[locale]/components/message/MessageContext";
import ReactQueryWrapper from "../../app/[locale]/ReactQueryWrapper";
import { AuthContextProvider } from "../../app/[locale]/Auth/AuthContext";
import { AppContextProvider } from "../../context/AppContext";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import { EventCartProvider } from "../../context/EventCartContext";
import { createServerClient } from "../supabaseServer";

const AllTheProviders: FC<{ children: ReactNode }> = ({ children }) => {
  // const loadSupabase = async () => {
  //   const supabase = createServerClient();

  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession();

  //   return session;
  // };

  // const session = loadSupabase() || {
  const session = {
    user: {
      id: "1",
      aud: "authenticated",
      role: "authenticated",
      email: "",
      confirmed_at: "",
      confirmation_sent_at: "",
      last_sign_in_at: "",
      created_at: "",
      updated_at: "",
      user_metadata: {
        full_name: "",
      },
      app_metadata: {
        provider: "",
      },
    },
    access_token: "",
    refresh_token: "",
    expires_in: 0,
    token_type: "",
  };

  return (
    <NextIntlClientProvider locale={"es"} messages={messages}>
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
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
