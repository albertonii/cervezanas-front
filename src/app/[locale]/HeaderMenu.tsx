'use client';

import MobileMenu from './MobileMenu';
import ScreenMenu from './ScreenMenu';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import { useEffect, useState } from 'react';
import { INotification } from '@/lib/types/types';
import { useAuth } from './(auth)/Context/useAuth';
import useNotifications from '@/hooks/useNotifications';

interface Props {
    i18nLocaleArray: string[];
}

export default function HeaderMenu({ i18nLocaleArray }: Props) {
    const device = useDeviceDetection();

    const { supabase } = useAuth();
    const { notifications } = useNotifications();

    const [notificationState, setNotificationState] = useState<INotification[]>(
        [],
    );

    useEffect(() => {
        setNotificationState(notifications);
    }, [notifications]);

    useEffect(() => {
        supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                },
                (payload) => {
                    setNotificationState((prevState) => [
                        ...prevState,
                        payload.new as INotification,
                    ]);
                },
            )
            .subscribe();
    }, [supabase, notificationState, setNotificationState]);

    return (
        <header className="header sm:relative w-full bg-beer-foam bg-transparent z-10">
            <nav>
                {device === 'Mobile' ? (
                    <MobileMenu
                        notifications={notificationState}
                        i18nLocaleArray={i18nLocaleArray}
                    />
                ) : (
                    <ScreenMenu
                        notifications={notificationState}
                        i18nLocaleArray={i18nLocaleArray}
                    />
                )}
            </nav>
        </header>
    );
}
