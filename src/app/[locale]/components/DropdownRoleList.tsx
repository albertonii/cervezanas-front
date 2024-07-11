import Link from 'next/link';
import Spinner from './common/Spinner';
import useOnClickOutside from '../../../hooks/useOnOutsideClickDOM';
import React, { useRef } from 'react';
import { useAuth } from '../(auth)/Context/useAuth';
import { generateLink } from '../../../utils/utils';
import { useLocale, useTranslations } from 'next-intl';
import { ROLE_ENUM } from '../../../lib/enums';
import { useAppContext } from '../../context/AppContext';

interface Props {
    handleOnClickRoleOutside: () => void;
}

export default function DropdownRoleList({ handleOnClickRoleOutside }: Props) {
    const { roles, changeRole, isAuthLoading, setIsAuthLoading } = useAuth();
    const { changeSidebarActive } = useAppContext();

    const t = useTranslations();
    const locale = useLocale();

    const dropdownRoleListRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(dropdownRoleListRef, () => handleOnClickRoleOutside());

    const handleRoleClick = (role: ROLE_ENUM) => {
        changeSidebarActive('settings');
        changeRole(role);
        handleOnClickRoleOutside();
    };

    return (
        <>
            {isAuthLoading && (
                <Spinner color="beer-blonde" size="small" absolute />
            )}

            <div
                ref={dropdownRoleListRef}
                id="dropdown"
                className="absolute top-12 left-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700"
            >
                <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200 shadow-sm border-2 border-cerv-titlehigh  bg-cerv-cream dark:bg-gray-700 dark:border-gray-800 rounded-lg"
                    aria-labelledby="dropdownDefaultButton"
                >
                    {roles?.map((role) => (
                        <li className="hover:cursor-pointer text-center">
                            <Link
                                href={generateLink(
                                    role,
                                    role === ROLE_ENUM.Admin
                                        ? 'authorized_users'
                                        : 'profile',
                                )}
                                locale={locale}
                                onLoadStart={() => setIsAuthLoading(true)}
                            >
                                <div
                                    className={`p-2 bg-cerv-cream active:bg-beer-gold transition-all ease-in-out hover:bg-cerv-titlehigh font-semibold dark:bg-gray-700 dark:hover:bg-gray-800 dark:active:bg-gray-900`}
                                    onClick={() => handleRoleClick(role)}
                                >
                                    <span
                                        className={`text-beer-dark dark:text-white hover:text-white `}
                                        aria-current="page"
                                    >
                                        {t('role.' + `${role}`)}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
