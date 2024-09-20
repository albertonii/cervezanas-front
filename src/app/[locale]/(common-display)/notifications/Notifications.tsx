'use client';

import React from 'react';
import ProfileSectionHeader from '../../components/ui/ProfileSectionHeader';
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
            <ProfileSectionHeader headerTitle="notifications.label" />

            <NotificationList notifications={notifications} />
        </section>
    );
}
