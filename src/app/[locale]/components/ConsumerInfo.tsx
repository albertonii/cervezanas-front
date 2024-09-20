'use client';

import Link from 'next/link';
import DisplayImageProfile from './ui/DisplayImageProfile';
import React from 'react';
import { IUser } from '@/lib//types/types';
import { useLocale, useTranslations } from 'next-intl';
import { formatDateDefaultInput } from '@/utils/formatDate';

interface Props {
    user?: IUser;
}

export function ConsumerInfo({ user }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <>
            {user && (
                <div className="mb-4 flex items-center space-x-4">
                    <DisplayImageProfile
                        imgSrc={user.avatar_url}
                        class={'mx-auto h-16 w-16 rounded-full'}
                    />

                    <div className="space-y-1 font-medium dark:text-white">
                        <Link
                            href={`/user-info/${user.id}`}
                            locale={locale}
                            target="_blank"
                            className="font-semibold text-beer-draft hover:cursor-pointer hover:text-beer-blonde"
                        >
                            {user.username}
                        </Link>

                        <time
                            dateTime="2014-08-16 19:00"
                            className="block text-sm text-gray-500 dark:text-gray-400"
                        >
                            {t('joined_on')}{' '}
                            {formatDateDefaultInput(user.created_at)}
                        </time>
                    </div>
                </div>
            )}
        </>
    );
}
