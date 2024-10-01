import Label from '@/app/[locale]/components/ui/Label';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IUserTable } from '@/lib/types/types';

interface Props {
    user: IUserTable;
}

const UserAbout = ({ user }: Props) => {
    const t = useTranslations();

    const [showBasicFullInfo, setShowBasicFullInfo] = useState(false);

    const handleShowBasicFullInfo = () => {
        setShowBasicFullInfo(!showBasicFullInfo);
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center space-x-2 font-semibold leading-8 text-gray-900">
                <span className=" text-beer-gold">
                    <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                </span>
                <span className="tracking-wide">{t('about')}</span>
            </div>

            <div className="mt-4 text-gray-700 grid text-sm grid-cols-2 py-2">
                <div className="col-span-1 flex gap-4">
                    <Label font="semibold" size="small">
                        {t('username')}
                    </Label>
                    <Label size="small">{user.username}</Label>
                </div>

                <div className="col-span-1 flex gap-4">
                    <Label font="semibold" size="small">
                        {t('email')}
                    </Label>
                    <Label font="semibold" size="small">
                        <a
                            className="text-beer-gold hover:text-beer-darkGold"
                            href={`mailto:${user.email}`}
                        >
                            {user.email}
                        </a>
                    </Label>
                </div>
            </div>

            <button
                className="focus:shadow-outline hover:shadow-xs my-4 block w-full rounded-lg p-3 text-sm font-semibold text-beer-gold hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={handleShowBasicFullInfo}
            >
                {showBasicFullInfo
                    ? `${t('hide_full_info')}`
                    : `${t('show_full_info')}`}
            </button>
        </div>
    );
};

export default UserAbout;
