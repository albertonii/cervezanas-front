'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { INotification } from '@/lib//types/types';
import { NotificationList } from './NotificationList';

interface Props {
    notifications: INotification[];
}

export default function Notifications({ notifications }: Props) {
    const t = useTranslations();
    return (
        <section className="px-4 py-6" aria-label="Notifications">
            <p className="flex justify-between py-4" id="header">
                <span
                    id="title"
                    className="lowercase font-semibold text-white font-['NexaRust-script'] text-5xl md:text-7xl -rotate-2 ml-10"
                >
                    {t('notifications.label')}
                </span>
            </p>

            <NotificationList notifications={notifications} />
        </section>
    );
}
