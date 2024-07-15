'use client';

import useOnClickOutside from '../../../../hooks/useOnOutsideClickDOM';
import React, { ComponentProps, useRef } from 'react';
import { INotification } from '../../../../lib/types/types';
import { useTranslations } from 'next-intl';
import NotificationItem from './NotificationItem';

interface Props {
    open: boolean;
    setOpen: ComponentProps<any>;
    notifications: INotification[];
}

export function NotificationPopup({ open, setOpen, notifications }: Props) {
    const t = useTranslations();
    const notificationRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(notificationRef, () => handleClickOutsideCallback());

    if (!open) return null;

    const handleClickOutsideCallback = () => {
        setOpen(false);
    };

    if (!notifications) return <></>;

    return (
        <section ref={notificationRef}>
            <div className="absolute -right-10 top-10 z-50 flex items-center justify-center ">
                <div className="w-80 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800 md:w-[50vw] lg:w-[35vw]">
                    <div className="bg-beer-softFoam p-4 dark:bg-beer-dark flex justify-between ">
                        <h3 className="text-xl lg:text-2xl font-bold">
                            {t('notifications.label')}
                        </h3>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-200">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-gray-500">
                                {t('no_notifications')}
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div key={notification.id}>
                                    <NotificationItem
                                        notification={notification}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
