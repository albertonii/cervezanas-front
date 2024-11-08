// DeviceScreenNotification.tsx
'use client';

import Image from 'next/image';
import Button from './ui/buttons/Button';
import React, { useEffect, useState } from 'react';
import { NotificationPopup } from './notificationPopup/NotificationPopup';
import { useNotificationsContext } from '@/app/context/NotificationsContext';

export function DeviceScreenNotification() {
    const { notifications, setOpenNotification } = useNotificationsContext();

    const [animateNotifications, setAnimateNotifications] = useState(false);

    const handleClickBell = () => {
        setOpenNotification(true);
    };

    useEffect(() => {
        if (notifications.length > 0) {
            setAnimateNotifications(true);
            const timer = setTimeout(() => {
                setAnimateNotifications(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [notifications]);

    const numberOfUnreadNotifications = notifications.filter(
        (notification) => !notification.read,
    ).length;

    useEffect(() => {
        console.log('numberOfUnreadNotifications', numberOfUnreadNotifications);
        console.log('notifications', notifications);
    }, [numberOfUnreadNotifications, notifications]);

    return (
        <div className="relative flex h-full items-center justify-center font-medium w-[50px]">
            <Button
                class={`
                    ${animateNotifications && 'animate-wiggle'}
                    border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent relative rounded-full lg:mr-4
                    `}
                onClick={handleClickBell}
                title=""
            >
                <section className="relative rounded-full">
                    <Image
                        alt="Notification bell"
                        src="/icons/notification-icon.svg"
                        width={30}
                        height={30}
                        className="rounded-full bg-beer-blonde w-[40px] lg:w-[50px] p-[5px] border-beer-softBlondeBubble border-2"
                    />
                    <span
                        className="
              absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-softBlonde
            "
                    >
                        {numberOfUnreadNotifications}
                    </span>
                </section>
            </Button>

            {/* Notification popup */}
            <NotificationPopup />
        </div>
    );
}
