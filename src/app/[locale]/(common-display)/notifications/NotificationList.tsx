'use client';

import Link from 'next/link';

import React, { useState } from 'react';
import { ROLE_ENUM } from '@/lib/enums';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../(auth)/Context/useAuth';
import { INotification, IUser } from '@/lib//types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronCircleDown,
    faEnvelope,
    faEnvelopeOpen,
} from '@fortawesome/free-solid-svg-icons';
import TableWithFooterAndSearch from '../../components/ui/TableWithFooterAndSearch';

interface Props {
    notifications: INotification[];
}

export function NotificationList({ notifications }: Props) {
    const locale = useLocale();
    const t = useTranslations();
    const { supabase } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);

    const [showAccordion, setShowAccordion] = useState<string | null>(null);

    const counter = notifications.length;
    const resultsPerPage = 10;

    const columns = [
        {
            header: t('is_read'),
            accessor: 'is_read',
            sortable: true,
            render: (_: boolean, row: INotification) => (
                <div onClick={() => handleOpenMessage(row)}>
                    {row.read ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-2 text-xs font-semibold leading-5 text-green-800">
                            <FontAwesomeIcon
                                icon={faEnvelopeOpen}
                                title={''}
                                width={40}
                                height={40}
                                className={`h-4`}
                            />
                        </span>
                    ) : (
                        <span className="inline-flex rounded-full bg-red-100 p-2 px-2 text-xs font-semibold leading-5 text-red-800">
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                title={''}
                                width={40}
                                height={40}
                                className={`h-4`}
                            />
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: t('sent_by'),
            accessor: 'source_user.username',
            sortable: true,
            render: (_: string, row: INotification) => (
                <Link
                    href={linkToUserProfileByRole(row.source_user)}
                    locale={locale}
                    className="hover:text-beer-gold hover:font-semibold"
                >
                    {row.source_user?.username}
                </Link>
            ),
        },
        {
            header: t('link'),
            accessor: 'link',
            sortable: true,
            render: (_: string, row: INotification) => row.link,
        },
        {
            header: t('created_at'),
            accessor: 'created_at',
            sortable: true,
            render: (_: string, row: INotification) =>
                formatDateString(row.created_at),
        },
        {
            header: t('action_header'),
            accessor: 'action',
            render: (_: any, row: INotification) => (
                <>
                    <div
                        className={`${
                            showAccordion === row.id
                                ? 'bg-gray-100 text-beer-draft'
                                : 'text-beer-gold'
                        } flex justify-between px-6 py-4 text-lg `}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <FontAwesomeIcon
                                icon={faChevronCircleDown}
                                style={{
                                    color:
                                        showAccordion === row.id
                                            ? '#90470b'
                                            : '#EE9900',
                                }}
                                title={'chevron_circle_down'}
                                width={20}
                                height={20}
                                className={`${
                                    showAccordion === row.id && 'rotate-180'
                                }`}
                            />
                        </div>
                    </div>
                </>
            ),
        },
    ];

    const handleOpenMessage = async (notification: INotification) => {
        if (!notification.read) {
            await updateIsRead(notification);
        }
        setShowAccordion((prev) =>
            prev === notification.id ? null : notification.id,
        );
    };

    const updateIsRead = async (notification: INotification) => {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notification.id)
            .select(
                `
                  *,
                  source_user:users!notifications_user_id_fkey (
                    username
                  )
                `,
            )
            .single();
        if (error) throw error;
    };

    const linkToUserProfileByRole = (user: IUser) => {
        const role = user?.role;
        const userId = user?.id;

        switch (role) {
            case ROLE_ENUM.Distributor:
                return `/d-info/${userId}`;
            case ROLE_ENUM.Cervezano:
                return `/c-info/${userId}`;
            case ROLE_ENUM.Productor:
                return `/p-info/${userId}`;
            case ROLE_ENUM.Admin:
                return `/admin-info/${userId}`;
            default:
                return `/user-info/${userId}`;
        }
    };

    const expandedRowRender = (notification: INotification) => (
        <div className="px-6 py-4 text-gray-800">
            <span className="mb-2 text-base text-gray-500 dark:text-gray-400">
                {notification.message}
            </span>
        </div>
    );

    return (
        <section className="mb-4 space-y-3  rounded-md border-2 border-beer-blonde  bg-white px-6 py-4 shadow-2xl dark:bg-cerv-titlehigh">
            <TableWithFooterAndSearch
                columns={columns}
                data={notifications}
                initialQuery={''}
                resultsPerPage={resultsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                searchPlaceHolder={'search_by_name'}
                paginationCounter={counter}
                expandedRowRender={expandedRowRender}
                sourceDataIsFromServer={true}
            />
        </section>
    );
}
