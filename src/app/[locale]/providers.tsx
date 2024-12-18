'use client';

import React, { Suspense } from 'react';
import ReactQueryWrapper from './ReactQueryWrapper';
import { NextIntlClientProvider } from 'next-intl';
import { EventCartProvider } from '@/app/context/EventCartContext';
import { AuthContextProvider } from './(auth)/Context/AuthContext';
import { MessageProvider } from './components/message/MessageContext';
import { AppContextProvider } from '@/app//context/AppContext';
import { ShoppingCartProvider } from '@/app//context/ShoppingCartContext';
import { NotificationsProvider } from '../context/NotificationsContext';

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
            <Suspense fallback={<div>Loading translations...</div>}>
                {' '}
                <MessageProvider>
                    <ReactQueryWrapper>
                        <AuthContextProvider serverSession={session}>
                            <AppContextProvider>
                                <NotificationsProvider>
                                    <ShoppingCartProvider>
                                        <EventCartProvider>
                                            {children}
                                        </EventCartProvider>
                                    </ShoppingCartProvider>
                                </NotificationsProvider>
                            </AppContextProvider>
                        </AuthContextProvider>
                    </ReactQueryWrapper>
                </MessageProvider>
            </Suspense>
        </NextIntlClientProvider>
    );
}
