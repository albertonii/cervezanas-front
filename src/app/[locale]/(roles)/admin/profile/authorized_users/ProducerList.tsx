'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import React, { useMemo, useState } from 'react';
import { ROLE_ENUM } from '@/lib//enums';
import { createNotification } from '@/utils/utils';
import { IProducerUser } from '@/lib//types/types';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import { faCancel, faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import {
    sendEmailAcceptUserAsProducer,
    sendEmailCancelUserAsProducer,
} from '@/lib//actions';

enum SortBy {
    NONE = 'none',
    USERNAME = 'username',
    CREATED_DATE = 'created_date',
}

const DynamicModal = dynamic(
    () => import('@/app/[locale]/components/modals/Modal'),
    {
        loading: () => <p>Loading...</p>,
        ssr: false,
    },
);

interface Props {
    producers: IProducerUser[];
}

export default function ProducerList({ producers }: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const [query, setQuery] = useState('');

    const { user, supabase } = useAuth();

    const acceptColor = { filled: '#90470b', unfilled: 'grey' };
    const rejectColor = { filled: 'red', unfilled: 'grey' };

    const [isAcceptModal, setIsAcceptModal] = useState(false);
    const [isRejectModal, setIsRejectModal] = useState(false);

    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
    const [selectedProducer, setSelectedProducer] = useState<IProducerUser>();

    const { handleMessage } = useMessage();

    const filteredItems: IProducerUser[] = useMemo<IProducerUser[]>(() => {
        return producers.filter((producer) => {
            return producer.users?.username
                .toLowerCase()
                .includes(query.toLowerCase());
        });
    }, [producers, query]);

    const sortedItems = useMemo(() => {
        if (sorting === SortBy.NONE) return filteredItems;

        const compareProperties: Record<
            string,
            (producer: IProducerUser) => any
        > = {
            [SortBy.USERNAME]: (producer) => producer.users?.username,
        };

        return filteredItems.toSorted((a, b) => {
            const extractProperty = compareProperties[sorting];
            return extractProperty(a).localeCompare(extractProperty(b));
        });
    }, [filteredItems, sorting]);

    const handleChangeSort = (sort: SortBy) => {
        setSorting(sort);
    };

    const handleApproveClick = async (producer: IProducerUser) => {
        setIsAcceptModal(true);

        await supabase
            .from('producer_user')
            .update({ is_authorized: true })
            .eq('user_id', producer.user_id)
            .then(() => {
                setIsAcceptModal(false);

                sendNotification(t('notifications.req_producer_accepted'));

                // Notify user by email that has been accepted has a producer
                sendEmailAcceptUserAsProducer(
                    producer.users!.username,
                    producer.users!.email,
                );
            });
    };

    const handleRejectClick = async (producer: IProducerUser) => {
        setIsRejectModal(true);

        await supabase
            .from('producer_user')
            .update({ is_authorized: false })
            .eq('user_id', producer.user_id)
            .then(() => {
                setIsRejectModal(false);

                sendNotification(t('notifications.req_producer_rejected'));

                // Notify user by email that has been accepted has a producer
                sendEmailCancelUserAsProducer(
                    producer.users!.username,
                    producer.users!.email,
                );
            });
    };

    const sendNotification = async (message: string) => {
        if (!selectedProducer) return;

        const link = `/${ROLE_ENUM.Productor}/profile?a=settings`;
        // Notify user that has been accepted/rejected has a producer
        const response = await createNotification(
            supabase,
            selectedProducer.user_id,
            user?.id,
            link,
            message,
        );

        if (response.error) {
            console.error(response.error);
            handleMessage({
                type: 'error',
                message: t('notifications.error'),
            });
            return;
        }
    };

    return (
        <section className="relative overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg ">
            {selectedProducer && isAcceptModal && (
                <DynamicModal
                    title={t('accept')}
                    icon={faCheck}
                    color={acceptColor}
                    handler={async () => {
                        handleApproveClick(selectedProducer);
                    }}
                    handlerClose={() => setIsAcceptModal(false)}
                    showModal={isAcceptModal}
                    setShowModal={setIsAcceptModal}
                    description={'authorize_producer_description_modal'}
                    classContainer={''}
                    btnTitle={t('accept')}
                >
                    <></>
                </DynamicModal>
            )}

            {selectedProducer && isRejectModal && (
                <DynamicModal
                    title={t('reject')}
                    icon={faCheck}
                    color={acceptColor}
                    handler={async () => {
                        handleRejectClick(selectedProducer);
                    }}
                    handlerClose={() => setIsRejectModal(false)}
                    showModal={isRejectModal}
                    setShowModal={setIsRejectModal}
                    description={t('unauthorize_producer_description_modal')}
                    classContainer={''}
                    btnTitle={t('accept')}
                >
                    <></>
                </DynamicModal>
            )}

            <InputSearch
                query={query}
                setQuery={setQuery}
                searchPlaceholder={'search_producer'}
            />

            <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 hover:cursor-pointer"
                        >
                            -
                        </th>

                        <th
                            scope="col"
                            className="px-6 py-3 hover:cursor-pointer"
                            onClick={() => {
                                handleChangeSort(SortBy.USERNAME);
                            }}
                        >
                            {t('username_header')}
                        </th>

                        <th
                            scope="col"
                            className="px-6 py-3 hover:cursor-pointer"
                            onClick={() => {
                                handleChangeSort(SortBy.CREATED_DATE);
                            }}
                        >
                            {t('created_date_header')}
                        </th>

                        <th scope="col" className="px-6 py-3">
                            {t('status_header')}
                        </th>

                        <th scope="col" className="px-6 py-3 ">
                            {t('action_header')}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {sortedItems.map((producer) => {
                        return (
                            <tr key={producer.user_id} className="">
                                <th
                                    scope="row"
                                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                >
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        style={{ color: '#fdc300' }}
                                        title={'check_warning'}
                                        width={80}
                                        height={80}
                                    />
                                </th>

                                <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde">
                                    <Link
                                        href={`/user-info/${producer.user_id}`}
                                        locale={locale}
                                    >
                                        {producer.users?.username}
                                    </Link>
                                </td>

                                <td className="px-6 py-4">
                                    {formatDateString(producer.created_at)}
                                </td>

                                <td
                                    className={`${
                                        producer.is_authorized &&
                                        'font-semibold text-beer-gold'
                                    } cursor-pointer truncate px-6 py-4`}
                                >
                                    {producer.is_authorized
                                        ? t('authorized')
                                        : t('pending')}
                                </td>
                                <td className="flex items-center justify-center px-6 py-4">
                                    <IconButton
                                        icon={faCheck}
                                        onClick={() => {
                                            setSelectedProducer(producer);
                                            setIsAcceptModal(true);
                                        }}
                                        color={acceptColor}
                                        classContainer={
                                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0'
                                        }
                                        title={t('accept')}
                                    />
                                    <IconButton
                                        icon={faCancel}
                                        onClick={() => {
                                            setSelectedProducer(producer);
                                            setIsRejectModal(true);
                                        }}
                                        color={rejectColor}
                                        classContainer={
                                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0 '
                                        }
                                        title={t('reject')}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
}
