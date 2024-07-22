'use client';

import React from 'react';
import ReactQueryWrapper from './ReactQueryWrapper';
import { NextIntlClientProvider } from 'next-intl';
import { EventCartProvider } from '@/app/context/EventCartContext';
import { AuthContextProvider } from './(auth)/Context/AuthContext';
import { MessageProvider } from './components/message/MessageContext';
import { AppContextProvider } from '@/app//context/AppContext';
import { ShoppingCartProvider } from '@/app//context/ShoppingCartContext';

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
    const timeZone = 'Europe/Madrid';

    return (
        <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone={timeZone}
        >
            <MessageProvider>
                <ReactQueryWrapper>
                    <AuthContextProvider serverSession={session}>
                        <AppContextProvider>
                            <ShoppingCartProvider>
                                <EventCartProvider>
                                    {children}
                                </EventCartProvider>
                            </ShoppingCartProvider>
                        </AppContextProvider>
                    </AuthContextProvider>
                </ReactQueryWrapper>
            </MessageProvider>
        </NextIntlClientProvider>
    );
}
