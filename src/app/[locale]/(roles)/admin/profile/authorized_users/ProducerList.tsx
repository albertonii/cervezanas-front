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
import Table from '@/app/[locale]/components/ui/table/Table';
import THead from '@/app/[locale]/components/ui/table/THead';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import TR from '@/app/[locale]/components/ui/table/TR';
import TH from '@/app/[locale]/components/ui/table/TH';
import TD from '@/app/[locale]/components/ui/table/TD';
import TDActions from '@/app/[locale]/components/ui/table/TDActions';

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

            <Table>
                <THead>
                    <TR>
                        <TH scope="col" class_="hover:cursor-pointer">
                            -
                        </TH>

                        <TH
                            scope="col"
                            class_="hover:cursor-pointer"
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
                    {sortedItems.map((producer) => {
                        return (
                            <TR key={producer.user_id}>
                                <TH
                                    scope="row"
                                    class_="whitespace-nowrap font-medium "
                                >
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        style={{ color: '#fdc300' }}
                                        title={'check_warning'}
                                        width={80}
                                        height={80}
                                    />
                                </TH>

                                <TD class_="hover:text-beer-draft">
                                    <Link
                                        href={`/user-info/${producer.user_id}`}
                                        locale={locale}
                                    >
                                        {producer.users?.username}
                                    </Link>
                                </TD>

                                <TD>{formatDateString(producer.created_at)}</TD>

                                <TD
                                    class_={`${
                                        producer.is_authorized &&
                                        'font-semibold text-beer-gold'
                                    } cursor-pointer truncate `}
                                >
                                    {producer.is_authorized
                                        ? t('authorized')
                                        : t('pending')}
                                </TD>

                                <TDActions>
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
                                </TDActions>
                            </TR>
                        );
                    })}
                </TBody>
            </Table>
        </section>
    );
}
