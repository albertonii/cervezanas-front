'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import React, { useMemo, useState } from 'react';
import { ROLE_ENUM } from '@/lib//enums';
import { createNotification } from '@/utils/utils';
import { useLocale, useTranslations } from 'next-intl';
import { IConsumptionPoints } from '@/lib//types/types';
import { generateDownloadableLink } from '@/utils/utils';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import {
    faCancel,
    faCheck,
    faFileArrowDown,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
    formatDateString,
    formatDateTypeDefaultInput,
} from '@/utils/formatDate';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

enum SortBy {
    NONE = 'none',
    USERNAME = 'username',
    NAME = 'name',
    LAST = 'last',
    COUNTRY = 'country',
    CREATED_DATE = 'created_date',
    START_DATE = 'start_date',
    END_DATE = 'end_date',
}

const DynamicModal = dynamic(
    () => import('@/app/[locale]/components/modals/Modal'),
    {
        loading: () => <p>Loading...</p>,
        ssr: false,
    },
);

interface Props {
    submittedCPs: IConsumptionPoints[];
}

export default function ListPendingCP({ submittedCPs }: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const [query, setQuery] = useState('');

    const { handleMessage } = useMessage();

    const { user, supabase } = useAuth();

    const [submittedList, setSubmittedList] = useState(submittedCPs);

    const acceptColor = { filled: '#90470b', unfilled: 'grey' };
    const rejectColor = { filled: 'red', unfilled: 'grey' };

    const [isAcceptModal, setIsAcceptModal] = useState(false);
    const [isRejectModal, setIsRejectModal] = useState(false);

    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
    const [selectedCP, setSelectedCP] = useState<IConsumptionPoints>();

    const filteredItems: IConsumptionPoints[] = useMemo<
        IConsumptionPoints[]
    >(() => {
        return submittedList.filter((submittedCP) => {
            return submittedCP.users.username
                .toLowerCase()
                .includes(query.toLowerCase());
        });
    }, [submittedList, query]);

    const sortedItems = useMemo(() => {
        if (sorting === SortBy.NONE) return filteredItems;

        const compareProperties: Record<
            string,
            (cp: IConsumptionPoints) => any
        > = {
            [SortBy.USERNAME]: (cp) => cp.users.username,
        };

        return filteredItems.toSorted((a, b) => {
            const extractProperty = compareProperties[sorting];
            return extractProperty(a).localeCompare(extractProperty(b));
        });
    }, [filteredItems, sorting]);

    const handleChangeSort = (sort: SortBy) => {
        setSorting(sort);
    };

    // Remove from submitted list after accepting or rejecting
    const removeFromSubmittedList = (id: string) => {
        const newList = submittedList.filter((item) => item.id !== id);
        setSubmittedList(newList);
    };

    const handleCoverLetterClick = async (cp: IConsumptionPoints) => {
        await supabase.storage
            .from('public/documents')
            .download(`cover_letter/${cp.users.id}_${cp.cover_letter_name}`)
            .then((blob: any) => {
                generateDownloadableLink(blob, cp.cover_letter_name);
            });
    };

    const handleCVClick = async (cp: IConsumptionPoints) => {
        await supabase.storage
            .from('public/documents')
            .download(`cv/${cp.users.id}_${cp.cv_name}`)
            .then((blob: any) => {
                generateDownloadableLink(blob, cp.cv_name);
            });
    };

    const handleApproveClick = async (cp: IConsumptionPoints) => {
        setIsAcceptModal(true);
        setSelectedCP(cp);
    };

    const handleRejectClick = async (cp: IConsumptionPoints) => {
        setIsRejectModal(true);
        setSelectedCP(cp);

        await supabase
            .from('consumption_points')
            .update({ cp_organizer_status: 2 })
            .eq('id', cp.id)
            .then(async () => {
                await supabase
                    .from('users')
                    .update({
                        cp_organizer_status: 1,
                        updated_at: formatDateTypeDefaultInput(new Date()),
                    })
                    .eq('id', cp.users.id);
            });
    };

    if (submittedList.length === 0) {
        return (
            <div className="my-[10vh] flex items-center justify-center">
                <p className="text-2xl text-gray-500 dark:text-gray-400">
                    {t('no_pending_cp')}
                </p>
            </div>
        );
    }
    const sendNotification = async (message: string) => {
        const link = `/${ROLE_ENUM.Productor}/profile?a=consumption_points`;

        // Notify user that has been assigned as organizer
        const response = await createNotification(
            supabase,
            submittedCPs[0].users.id,
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

    const handleUpdateStatus = async (status: number) => {
        if (!selectedCP) return;

        supabase
            .from('consumption_points')
            .update({ cp_organizer_status: status })
            .eq('id', selectedCP.id)
            .then(async () => {
                await supabase
                    .from('users')
                    .update({
                        cp_organizer_status: status,
                        updated_at: formatDateTypeDefaultInput(new Date()),
                    })
                    .eq('id', selectedCP.users.id);
            });
    };

    return (
        <section className="relative overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg ">
            {selectedCP && isAcceptModal && (
                <DynamicModal
                    title={t('accept')}
                    icon={faCheck}
                    color={acceptColor}
                    handler={async () => {
                        handleUpdateStatus(1);
                        removeFromSubmittedList(selectedCP.id);
                        setIsAcceptModal(false);
                        sendNotification(
                            'Your consumption point has been accepted',
                        );
                    }}
                    handlerClose={() => setIsAcceptModal(false)}
                    showModal={isAcceptModal}
                    setShowModal={setIsAcceptModal}
                    description={'accept_cp_description_modal'}
                    classIcon={''}
                    classContainer={''}
                    btnTitle={t('accept')}
                >
                    <></>
                </DynamicModal>
            )}

            {selectedCP && isRejectModal && (
                <DynamicModal
                    title={t('reject')}
                    icon={faCheck}
                    color={acceptColor}
                    handler={async () => {
                        handleUpdateStatus(2);
                        removeFromSubmittedList(selectedCP.id);
                        setIsRejectModal(false);
                    }}
                    handlerClose={() => setIsRejectModal(false)}
                    showModal={isRejectModal}
                    setShowModal={setIsRejectModal}
                    description={t('reject_cp_description_modal')}
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
                            .
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
                            {t('cover_letter_header')}
                        </th>

                        <th scope="col" className="px-6 py-3 ">
                            {t('cv_header')}
                        </th>

                        <th scope="col" className="px-6 py-3 ">
                            {t('action_header')}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {sortedItems.map((cp) => {
                        return (
                            <tr key={cp.id} className="">
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
                                        href={`/products/${cp.users.id}`}
                                        locale={locale}
                                    >
                                        {cp.users.username}
                                    </Link>
                                </td>

                                <td className="px-6 py-4">
                                    {formatDateString(cp.created_at)}
                                </td>

                                <td className="cursor-pointer px-6 py-4">
                                    <FontAwesomeIcon
                                        icon={faFileArrowDown}
                                        style={{
                                            color: '',
                                            width: 30,
                                            height: 30,
                                        }}
                                        title={'download file'}
                                        onClick={() =>
                                            handleCoverLetterClick(cp)
                                        }
                                    />
                                </td>

                                <td className="cursor-pointer px-6 py-4">
                                    <FontAwesomeIcon
                                        icon={faFileArrowDown}
                                        style={{
                                            color: '',
                                            width: 30,
                                            height: 30,
                                        }}
                                        title={'download file'}
                                        onClick={() => handleCVClick(cp)}
                                    />
                                </td>

                                <td className="flex items-center justify-center px-6 py-4">
                                    <IconButton
                                        icon={faCheck}
                                        onClick={() => handleApproveClick(cp)}
                                        color={acceptColor}
                                        classContainer={
                                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0'
                                        }
                                        classIcon={''}
                                        title={t('accept')}
                                    />
                                    <IconButton
                                        icon={faCancel}
                                        onClick={() => handleRejectClick(cp)}
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
