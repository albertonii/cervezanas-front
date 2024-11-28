import Link from 'next/link';
import TD from '@/app/[locale]/components/ui/table/TD';
import React, { ComponentProps, useState } from 'react';
import { ROUTE_EVENTS } from '@/config';
import { IEvent } from '@/lib/types/eventOrders';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import {
    faEdit,
    faTrash,
    faCancel,
    faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
    event: IEvent;
    handleEditClick: ComponentProps<any>;
    handleDeleteClick: ComponentProps<any>;
}

export default function EventItems({
    event,
    handleEditClick,
    handleDeleteClick,
}: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const { supabase } = useAuth();
    const { handleMessage } = useMessage();

    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    const authorizeColor = { filled: '#0fe200', unfilled: 'grey' };
    const unauthorizeColor = { filled: '#ff0000', unfilled: 'grey' };
    const editColor = { filled: '#90470b', unfilled: 'grey' };
    const deleteColor = { filled: '#90470b', unfilled: 'grey' };

    const handleAuthorizeEventClick = async (e: IEvent) => {
        const { error } = await supabase
            .from('events')
            .update({ is_activated: true })
            .eq('id', e.id);

        if (error) {
            console.error(error);

            handleMessage({
                type: 'error',
                message: 'error_authorizing_event',
            });

            return;
        }

        handleMessage({
            type: 'info',
            message: 'success_authorizing_event',
        });

        setIsAuthorized(true);
    };

    const handleUnauthorizeEventClick = async (e: IEvent) => {
        const { error } = await supabase
            .from('events')
            .update({ is_activated: false })
            .eq('id', e.id);

        if (error) {
            console.error(error);

            handleMessage({
                type: 'error',
                message: 'error_unauthorizing_event',
            });

            return;
        }

        handleMessage({
            type: 'info',
            message: 'success_unauthorizing_event',
        });

        setIsAuthorized(false);
    };

    return (
        <>
            <TD class_="text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde">
                <Link href={`${ROUTE_EVENTS}/${event.id}`} locale={locale}>
                    {event.name}
                </Link>
            </TD>

            <TD>{formatDateString(event.created_at)}</TD>

            <TD class_="flex items-center justify-center ">
                {isAuthorized ? (
                    <IconButton
                        icon={faCancel}
                        onClick={() => {
                            handleUnauthorizeEventClick(event);
                        }}
                        color={unauthorizeColor}
                        classContainer={
                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full'
                        }
                        title={t('unauthorize_event')}
                    />
                ) : (
                    <IconButton
                        icon={faThumbsUp}
                        onClick={() => {
                            handleAuthorizeEventClick(event);
                        }}
                        color={authorizeColor}
                        classContainer={
                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full'
                        }
                        title={t('authorize_event')}
                    />
                )}

                <IconButton
                    icon={faEdit}
                    onClick={() => {
                        handleEditClick(event);
                    }}
                    color={editColor}
                    classContainer={
                        'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full'
                    }
                    title={t('edit')}
                />

                <IconButton
                    icon={faTrash}
                    onClick={() => {
                        handleDeleteClick(event);
                    }}
                    color={deleteColor}
                    classContainer={
                        'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full '
                    }
                    title={t('delete')}
                />
            </TD>
        </>
    );
}
