'use client';

import React from 'react';
import Image from 'next/image';
import Button from './ui/buttons/Button';
import useNotifications from '@/hooks/useNotifications';
import { NotificationPopup } from './notificationPopup/NotificationPopup';

export function DeviceScreenNotification() {
    const { notifications, setOpenNotification } = useNotifications();

    return (
        <>
            <Button
                class={
                    'border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent'
                }
                onClick={() => setOpenNotification(true)}
                title={''}
            >
                <div className="relative rounded-full">
                    <Image
                        alt={'Notification bell'}
                        className={'rounded-full'}
                        width={0}
                        height={0}
                        style={{ width: '50px', height: '50px' }}
                        src={'/icons/notification-icon.svg'}
                    />
                    <div className="white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde">
                        {notifications.length}
                    </div>
                </div>
            </Button>

            <NotificationPopup />
        </>
    );
}
