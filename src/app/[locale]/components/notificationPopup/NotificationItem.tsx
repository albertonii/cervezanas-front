import useNotifications from '@/hooks/useNotifications';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { INotification } from '@/lib/types/types';
import { getTimeElapsed } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface Props {
    notification: INotification;
}

const NotificationItem = ({ notification }: Props) => {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const { markAsRead } = useNotifications();

    const [isRead, setIsRead] = useState<boolean>(false);

    useEffect(() => {
        setIsRead(notification.read);

        return () => {};
    }, []);

    const handleOnClickText = (notification: INotification) => {
        if (!notification) return;

        markAsRead(notification.id)
            .then(() => {
                router.push(`/${locale}${notification.link}`);
                setIsRead(true);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const handleOnClickOpenEye = (notification: INotification) => {
        if (!notification) return;

        markAsRead(notification.id)
            .then(() => {
                setIsRead(true);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div
            className={`
                ${
                    isRead
                        ? 'bg-gray-200 hover:bg-gray-300'
                        : 'bg-beer-foam hover:bg-gray-100'
                }
                px-4 py-2 flex items-center justify-between  space-x-4
            `}
        >
            <div className="space-x-4 ">
                {isRead ? (
                    <FontAwesomeIcon
                        icon={faEye}
                        title={`${t('notifications.is_read')}`}
                        width={36}
                        height={36}
                        className={
                            'hover:cursor-pointer text-beer-darkGold hover:text-beer-soft-blonde'
                        }
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faEyeSlash}
                        title={`${t('notifications.mark_as_read')}`}
                        width={36}
                        height={36}
                        className={
                            'hover:cursor-pointer text-beer-darkGold hover:text-beer-soft-blonde hover:scale-[130%] transform transition-all duration-300 ease-in-out'
                        }
                        onClick={() => handleOnClickOpenEye(notification)}
                    />
                )}
            </div>

            <span
                className={`
                    ${isRead && 'text-gray-500'}
                    text-sm lg:text-base font-medium justify-start w-full hover:underline hover:text-beer-darkGold
                    hover:cursor-pointer transform transition-all duration-300 ease-in-out dark:text-beer-soft-blonde
                `}
                onClick={() => handleOnClickText(notification)}
            >
                {notification.message}
            </span>

            <span className="text-sm text-gray-500">
                {getTimeElapsed(notification.created_at)}
            </span>
        </div>
    );
};

export default NotificationItem;
