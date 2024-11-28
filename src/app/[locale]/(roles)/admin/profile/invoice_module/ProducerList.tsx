'use client';

import Link from 'next/link';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import React, { useState } from 'react';
import { ROLE_ENUM } from '@/lib//enums';
import { IProducerUser } from '@/lib/types/types';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import {
    sendEmailAcceptUserAsProducer,
    sendEmailCancelUserAsProducer,
} from '@/lib//actions';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { ROUTE_ADMIN, ROUTE_INVOICE_MODULE, ROUTE_PROFILE } from '@/config';

interface Props {
    producers: IProducerUser[];
    counter: number;
}

export default function ProducerList({ producers, counter }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const { user, supabase } = useAuth();
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 10;

    const [selectedProducer, setSelectedProducer] = useState<IProducerUser>();

    const columns = [
        {
            header: t('username_header'),
            key: 'username',
            accessor: 'users.username',
            sortable: true,
            render: (_: any, row: IProducerUser) => (
                <Link
                    href={`/user-info/${row.user_id}`}
                    locale={locale}
                    className="hover:text-beer-draft hover:font-semibold transition-all ease-in-out duration-200"
                >
                    {row.users?.username}
                </Link>
            ),
        },
        {
            header: t('company_name_header'),
            key: 'company_name',
            accessor: 'company_name',
            sortable: true,
            render: (_: any, row: IProducerUser) => (
                <span>{row.company_name}</span>
            ),
        },
        {
            header: t('action_header'),
            accessor: 'actions',
            render: (_: any, row: IProducerUser) => (
                <div className="flex justify-center space-x-2">
                    <IconButton
                        onClick={() => handleClickView(row)}
                        icon={faEye}
                        title={''}
                    />{' '}
                </div>
            ),
        },
    ];

    const handleClickView = async (producer: IProducerUser) => {
        router.push(
            `/${locale}${ROUTE_ADMIN}${ROUTE_PROFILE}${ROUTE_INVOICE_MODULE}/producer?id=${producer.user_id}`,
        );
    };

    const sendNotification = async (message: string) => {
        // Notify user that has been accepted/rejected has a producer
        const { error } = await supabase.from('notifications').insert({
            message: `${message}`,
            user_id: selectedProducer?.user_id,
            link: `/${ROLE_ENUM.Productor}/profile?a=settings`,
            source: user?.id, // User that has created the consumption point
        });

        if (error) {
            throw error;
        }
    };

    return (
        <section className="relative overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg ">
            <TableWithFooterAndSearch
                columns={columns}
                data={producers ?? []}
                initialQuery={''}
                resultsPerPage={resultsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                searchPlaceHolder={'search_by_name'}
                paginationCounter={counter}
                sourceDataIsFromServer={true}
            />
        </section>
    );
}
