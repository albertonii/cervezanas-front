// NotificationPopup.tsx
'use client';

import Label from '../ui/Label';
import Title from '../ui/Title';
import Button from '../ui/buttons/Button';
import NotificationItem from './NotificationItem';
import useOnClickOutside from '../../../../hooks/useOnOutsideClickDOM';
import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useNotificationsContext } from '@/app/context/NotificationsContext';

export function NotificationPopup() {
    const t = useTranslations();
    const notificationRef = useRef<HTMLDivElement>(null);
    const { supabase } = useAuth();
    const {
        notifications,
        setNotifications,
        openNotification,
        setOpenNotification,
    } = useNotificationsContext();

    useOnClickOutside(notificationRef, () => {
        setOpenNotification(false);
    });

    if (!openNotification) return null;

    const handleMarkAllAsRead = async () => {
        const notificationIds = notifications.map((n) => n.id);

        await supabase
            .from('notifications')
            .update({ read: true })
            .in('id', notificationIds);

        setNotifications(
            notifications.map((notification) => ({
                ...notification,
                read: true,
            })),
        );
    };

    return (
        <section
            ref={notificationRef}
            className="absolute -right-10 top-10 z-50 flex items-center justify-center w-80 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800 md:w-[50vw] lg:w-[35vw]"
        >
            <div className="w-full">
                <div className="bg-beer-softFoam px-4 pt-4 dark:bg-beer-dark flex justify-between ">
                    <Title size="xlarge" color="beer-draft">
                        {t('notifications.label')}
                    </Title>

                    <Button accent small onClick={handleMarkAllAsRead}>
                        {t('notifications.mark_all_as_read')}
                    </Button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-200">
                    {notifications.length === 0 ? (
                        <Label className="p-4">{t('no_notifications')}</Label>
                    ) : (
                        notifications.map((notification) => (
                            <div key={notification.id}>
                                <NotificationItem notification={notification} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
