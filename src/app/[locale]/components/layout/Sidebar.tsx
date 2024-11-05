'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '../ui/buttons/Button';
import useDeviceDetection from '../../../../hooks/useDeviceDetection';
import useOnClickOutside from '../../../../hooks/useOnOutsideClickDOM';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ROLE_ENUM } from '@/lib/enums';
import { generateLink } from '@/utils/utils';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { useAppContext } from '../../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faTimes,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

type Props = {
    sidebarLinks: { name: string; icon: IconDefinition; option: string }[];
};

export function Sidebar({ sidebarLinks }: Props) {
    const { sidebar, changeSidebarActive } = useAppContext();
    //  const { role } = useAuth();
    const { role, user } = useAuth();
    const device = useDeviceDetection();

    const t = useTranslations();
    const locale = useLocale();
    const [open, setOpen] = useState(false);

    const sidebarRef = useRef<HTMLDivElement>(null);

    const imageSrc =
        role === ROLE_ENUM.Admin
            ? '/icons/icon-admin.png'
            : role === ROLE_ENUM.Distributor
            ? '/icons/icon-distrib.png'
            : role === ROLE_ENUM.Productor
            ? '/icons/icon-prod.png'
            : '/icons/icon-cerv.png';
    useOnClickOutside(sidebarRef, () => handleClickOutsideCallback());

    const handleClickOutsideCallback = () => {
        setOpen(false);
    };

    const handleClick = () => {
        setOpen(!open);
    };

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setOpen(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            document.addEventListener('keydown', handleKeyPress);

            return () => {
                document.removeEventListener('keydown', handleKeyPress);
            };
        }
    }, [handleKeyPress, open]);

    return (
        <>
            <div className="lg:hidden fixed top-4 left-4 z-10">
                <Button
                    aria-controls="default-sidebar"
                    btnType="button"
                    class="bg-beer-softFoam hover:bg-beer-blonde h-10 w-10 rounded-full p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    onClick={handleClick}
                >
                    <FontAwesomeIcon
                        icon={open ? faTimes : faBars}
                        className="h-6 w-6 text-gray-700"
                    />
                </Button>
            </div>

            {role && (
                <aside
                    className={`${
                        open
                            ? 'translate-x-0'
                            : '-translate-x-full lg:translate-x-0'
                    } fixed top-0 left-0 z-10 h-full w-64 transform bg-white duration-300 ease-in-out shadow-lg lg:relative lg:top-0 
                        lg:left-0 lg:shadow-none lg:transform-none lg:block bg-gradient-to-t from-slate-50 to-gray-100
                        overflow-y-auto dark:bg-gray-800 
                    `}
                    aria-label="Sidebar"
                    id="default-sidebar"
                    ref={sidebarRef}
                >
                    <div>
                        <figure className="flex flex-col rounded-t-lg items-center justify-center p-1">
                            <Image
                                src={imageSrc}
                                alt={'Profile icon'}
                                className={'rounded-full w-full'}
                                width={140}
                                height={140}
                                style={{ width: '100px', height: '100px' }}
                            />
                            {role && (
                                <span className="p-2 ml-2 w-full text-sm font-semibold dark:text-white text-center">
                                    {user?.username}
                                </span>
                            )}
                        </figure>
                    </div>
                    <div className="lg:hidden absolute top-4 right-4">
                        <Button
                            aria-controls="default-sidebar"
                            btnType="button"
                            class="text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={handleClick}
                        >
                            <FontAwesomeIcon
                                icon={faTimes}
                                className="h-6 w-6"
                            />
                        </Button>
                    </div>

                    <ul className="space-y-2 font-medium px-4 py-6">
                        {sidebarLinks.map((link) => (
                            <li
                                key={link.name}
                                className={`flex items-center rounded-lg p-2 text-sm font-normal text-gray-600 hover:bg-beer-blonde dark:text-white dark:hover:bg-gray-700 ${
                                    sidebar === link.option
                                        ? 'bg-beer-softBlonde dark:bg-beer-draft text-gray-700'
                                        : 'text-gray-600'
                                }`}
                            >
                                <Link
                                    href={generateLink(role, link.option)}
                                    className="w-full font-semibold tracking-wide"
                                    locale={locale}
                                    onClick={() => {
                                        if (link.option !== sidebar) {
                                            changeSidebarActive(link.option);
                                        }
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={link.icon}
                                        className="mr-3 text-lg"
                                    />
                                    {t(link.name)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
            )}
        </>
    );
}
