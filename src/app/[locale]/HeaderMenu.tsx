'use client';

import MobileMenu from './MobileMenu';
import ScreenMenu from './ScreenMenu';
import AuthPopup from './components/user/AuthPopup';
import useNotifications from '@/hooks/useNotifications';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import { useEffect, useState } from 'react';
import { INotification } from '@/lib/types/types';
import { useAuth } from './(auth)/Context/useAuth';

interface Props {
    i18nLocaleArray: string[];
}

export default function HeaderMenu({ i18nLocaleArray }: Props) {
    const device = useDeviceDetection();

    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const { supabase } = useAuth();
    const { notifications, setNotifications } = useNotifications();

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
                    setNotifications((prevState) => [
                        ...prevState,
                        payload.new as INotification,
                    ]);
                },
            )
            .subscribe();
    }, [supabase, notifications, setNotifications]);

    return (
        <header className="header sm:relative w-full bg-beer-foam bg-transparent z-10">
            <nav>
                {device === 'Mobile' ? (
                    <MobileMenu
                        notifications={notifications}
                        i18nLocaleArray={i18nLocaleArray}
                    />
                ) : (
                    <ScreenMenu
                        notifications={notifications}
                        i18nLocaleArray={i18nLocaleArray}
                        onLoginClick={() => setShowLoginPopup(true)}
                    />
                )}
            </nav>

            {showLoginPopup && (
                <AuthPopup onClose={() => setShowLoginPopup(false)} />
            )}
        </header>
    );
}
