'use client';

import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { faCancel, faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDateString } from '@/utils/formatDate';
import { IconButton } from '@/app/[locale]/components/ui/IconButton';
import { IDistributorUser } from '@/lib//types/types';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import dynamic from 'next/dynamic';
import {
    sendEmailAcceptUserAsProducer,
    sendEmailCancelUserAsDistributor,
} from '@/lib//actions';
import { ROLE_ENUM } from '@/lib//enums';

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
    distributors: IDistributorUser[];
}

export default function DistributorList({ distributors }: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const [query, setQuery] = useState('');

    const { user, supabase } = useAuth();

    const acceptColor = { filled: '#90470b', unfilled: 'grey' };
    const rejectColor = { filled: 'red', unfilled: 'grey' };

    const [isAcceptModal, setIsAcceptModal] = useState(false);
    const [isRejectModal, setIsRejectModal] = useState(false);

    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
    const [selectedDistributor, setSelectedDistributor] =
        useState<IDistributorUser>();

    const filteredItems: IDistributorUser[] = useMemo<
        IDistributorUser[]
    >(() => {
        return distributors.filter((distributor) => {
            return distributor.users?.username
                .toLowerCase()
                .includes(query.toLowerCase());
        });
    }, [distributors, query]);

    const sortedItems = useMemo(() => {
        if (sorting === SortBy.NONE) return filteredItems;

        const compareProperties: Record<
            string,
            (distributor: IDistributorUser) => any
        > = {
            [SortBy.USERNAME]: (distributor) => distributor.users?.username,
        };

        return filteredItems.toSorted((a, b) => {
            const extractProperty = compareProperties[sorting];
            return extractProperty(a).localeCompare(extractProperty(b));
        });
    }, [filteredItems, sorting]);

    const handleChangeSort = (sort: SortBy) => {
        setSorting(sort);
    };

    const handleApproveClick = async (distributor: IDistributorUser) => {
        setIsAcceptModal(true);

        await supabase
            .from('distributor_user')
            .update({ is_authorized: true })
            .eq('user_id', distributor.user_id)
            .then(() => {
                setIsAcceptModal(false);

                sendNotification(t('notifications.req_distributor_accepted'));

                // Notify user by email that has been accepted has a producer
                sendEmailAcceptUserAsProducer(
                    distributor.users!.username,
                    distributor.users!.email,
                );
            });
    };

    const handleRejectClick = async (distributor: IDistributorUser) => {
        setIsRejectModal(true);

        await supabase
            .from('distributor_user')
            .update({ is_authorized: false })
            .eq('user_id', distributor.user_id)
            .then(() => {
                setIsRejectModal(false);

                sendNotification(t('notifications.req_distributor_rejected'));

                // Notify user by email that has been accepted has a producer
                sendEmailCancelUserAsDistributor(
                    distributor.users!.username,
                    distributor.users!.email,
                );
            });
    };

    const sendNotification = async (message: string) => {
        // Notify user that has been accepted/rejected has a distributor
        const { error } = await supabase.from('notifications').insert({
            message: `${message}`,
            user_id: selectedDistributor?.user_id,
            link: `/${ROLE_ENUM.Distributor}/profile?a=settings`,
            source: user?.id, // User that has created the consumption point
        });
        if (error) {
            throw error;
        }
    };

    return (
        <section className="relative overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg ">
            {selectedDistributor && isAcceptModal && (
                <DynamicModal
                    title={t('accept')}
                    icon={faCheck}
                    color={acceptColor}
                    handler={async () => {
                        handleApproveClick(selectedDistributor);
                    }}
                    handlerClose={() => setIsAcceptModal(false)}
                    showModal={isAcceptModal}
                    setShowModal={setIsAcceptModal}
                    description={'authorize_distributor_description_modal'}
                    classIcon={''}
                    classContainer={''}
                    btnTitle={t('accept')}
                >
                    <></>
                </DynamicModal>
            )}

            {selectedDistributor && isRejectModal && (
                <DynamicModal
                    title={t('reject')}
                    icon={faCheck}
                    color={acceptColor}
                    handler={async () => {
                        handleRejectClick(selectedDistributor);
                    }}
                    handlerClose={() => setIsRejectModal(false)}
                    showModal={isRejectModal}
                    setShowModal={setIsRejectModal}
                    description={t('unauthorize_distributor_description_modal')}
                    classIcon={''}
                    classContainer={''}
                    btnTitle={t('accept')}
                >
                    <></>
                </DynamicModal>
            )}

            <InputSearch
                query={query}
                setQuery={setQuery}
                searchPlaceholder={'search_products'}
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
                    {sortedItems.map((distributor) => {
                        return (
                            <tr key={distributor.user_id} className="">
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

                                <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                                    <Link
                                        href={`/user-info/${distributor.user_id}`}
                                        locale={locale}
                                    >
                                        {distributor.users?.username}
                                    </Link>
                                </td>

                                <td className="px-6 py-4">
                                    {formatDateString(distributor.created_at)}
                                </td>

                                <td
                                    className={`${
                                        distributor.is_authorized &&
                                        'font-semibold text-beer-gold'
                                    } cursor-pointer truncate px-6 py-4`}
                                >
                                    {distributor.is_authorized
                                        ? t('authorized')
                                        : t('pending')}
                                </td>
                                <td className="flex items-center justify-center px-6 py-4">
                                    <IconButton
                                        icon={faCheck}
                                        onClick={() => {
                                            setSelectedDistributor(distributor);
                                            setIsAcceptModal(true);
                                        }}
                                        color={acceptColor}
                                        classContainer={
                                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0'
                                        }
                                        classIcon={''}
                                        title={t('accept')}
                                    />
                                    <IconButton
                                        icon={faCancel}
                                        onClick={() => {
                                            setSelectedDistributor(distributor);
                                            setIsRejectModal(true);
                                        }}
                                        color={rejectColor}
                                        classContainer={
                                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0 '
                                        }
                                        classIcon={''}
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
