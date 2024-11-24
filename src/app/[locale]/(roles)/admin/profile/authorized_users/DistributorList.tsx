'use client';

import Link from 'next/link';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ROLE_ENUM } from '@/lib//enums';
import { createNotification } from '@/utils/utils';
import { IDistributorUser } from '@/lib//types/types';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import { faCancel, faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import {
    sendEmailAcceptUserAsProducer,
    sendEmailCancelUserAsDistributor,
} from '@/lib//actions';
import Table from '@/app/[locale]/components/ui/table/Table';
import THead from '@/app/[locale]/components/ui/table/THead';
import TR from '@/app/[locale]/components/ui/table/TR';
import TH from '@/app/[locale]/components/ui/table/TH';
import TD from '@/app/[locale]/components/ui/table/TD';
import TDActions from '@/app/[locale]/components/ui/table/TDActions';
import TBody from '@/app/[locale]/components/ui/table/TBody';

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
        if (!selectedDistributor) {
            return;
        }

        const link = `/${ROLE_ENUM.Distributor}/profile?a=settings`;
        // Notify user that has been accepted/rejected has a distributor
        const response = await createNotification(
            supabase,
            selectedDistributor.user_id,
            user?.id,
            link,
            message,
        );

        if (response.error) {
            console.error(response.error);
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
                    classContainer={''}
                    btnTitle={t('accept')}
                >
                    <></>
                </DynamicModal>
            )}

            <InputSearch
                query={query}
                setQuery={setQuery}
                searchPlaceholder={'search_distributor'}
            />

            <Table>
                <THead>
                    <TR>
                        <TH scope="col" class_=" hover:cursor-pointer">
                            -
                        </TH>

                        <TH
                            scope="col"
                            class_=" hover:cursor-pointer"
                            onClick={() => {
                                handleChangeSort(SortBy.USERNAME);
                            }}
                        >
                            {t('username_header')}
                        </TH>

                        <TH
                            scope="col"
                            class_="hover:cursor-pointer"
                            onClick={() => {
                                handleChangeSort(SortBy.CREATED_DATE);
                            }}
                        >
                            {t('created_date_header')}
                        </TH>

                        <TH scope="col">{t('status_header')}</TH>

                        <TH scope="col">{t('action_header')}</TH>
                    </TR>
                </THead>

                <TBody>
                    {sortedItems.map((distributor) => {
                        return (
                            <TR key={distributor.user_id}>
                                <TH
                                    scope="row"
                                    class_="whitespace-nowrap font-medium"
                                >
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        style={{ color: '#fdc300' }}
                                        title={'check_warning'}
                                        width={80}
                                        height={80}
                                    />
                                </TH>

                                <TD class_="hover:text-beer-draft ">
                                    <Link
                                        href={`/user-info/${distributor.user_id}`}
                                        locale={locale}
                                    >
                                        {distributor.users?.username}
                                    </Link>
                                </TD>

                                <TD>
                                    {formatDateString(distributor.created_at)}
                                </TD>

                                <TD
                                    class_={`${
                                        distributor.is_authorized &&
                                        'font-semibold text-beer-gold'
                                    } cursor-pointer truncate x`}
                                >
                                    {distributor.is_authorized
                                        ? t('authorized')
                                        : t('pending')}
                                </TD>

                                <TDActions class_="flex items-center justify-center ">
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
                                        title={t('reject')}
                                    />
                                </TDActions>
                            </TR>
                        );
                    })}
                </TBody>
            </Table>
        </section>
    );
}
