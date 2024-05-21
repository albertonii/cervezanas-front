'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from './(auth)/Context/useAuth';
import React, { useRef, useState } from 'react';
import { generateLink } from '../../utils/utils';
import { useLocale, useTranslations } from 'next-intl';
import { useAppContext } from '../context/AppContext';
import { useOutsideClick } from '../../hooks/useOnOutsideClick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';

interface DropdownProps {
    options: string[];
}

export function HeaderDropdownButton({ options }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const { role, signOut, user } = useAuth();

    const dropdown = useRef<HTMLDivElement>(null);

    const t = useTranslations();
    const locale = useLocale();

    const { changeSidebarActive } = useAppContext();

    const handleOpenCallback = () => {
        setOpen(false);
    };

    useOutsideClick(() => handleOpenCallback(), dropdown);

    const handleDropdownButton = (option: string) => {
        if (!role) return;

        switch (option) {
            case 'profile':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t(option)}
                            </span>
                        </div>
                    </Link>
                );

            case 'products':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t('products')}
                            </span>
                        </div>
                    </Link>
                );

            case 'events':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t(option)}
                            </span>
                        </div>
                    </Link>
                );

            case 'online_orders':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t(option)}
                            </span>
                        </div>
                    </Link>
                );

            case 'event_orders':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t(option)}
                            </span>
                        </div>
                    </Link>
                );

            case 'submitted_aps':
                return (
                    <Link
                        href={generateLink(role, 'contracts_cps')}
                        locale={locale}
                    >
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t(option)}
                            </span>
                        </div>
                    </Link>
                );

            case 'monthly_products':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        {' '}
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t(option)}
                            </span>
                        </div>
                    </Link>
                );

            case 'notifications':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t(option)}
                            </span>
                        </div>
                    </Link>
                );

            case 'logistics':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t(option)}
                            </span>
                        </div>
                    </Link>
                );

            case 'business_orders':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t(option)}
                            </span>
                        </div>
                    </Link>
                );

            case 'contracts':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t(option)}
                            </span>
                        </div>
                    </Link>
                );

            case 'distributor_feedback':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t(option)}
                            </span>
                        </div>
                    </Link>
                );

            case 'experiences':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out`}
                            onClick={() => changeSidebarActive(option)}
                        >
                            <span
                                className={`text-beer-dark dark:text-white `}
                                aria-current="page"
                            >
                                {t(option)}
                            </span>
                        </div>
                    </Link>
                );

            case 'signout':
                return (
                    <>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out hover:cursor-pointer`}
                            onClick={() => {
                                changeSidebarActive(option);
                                signOut();
                            }}
                        >
                            <span
                                className="text-md  block text-beer-dark dark:text-white  md:bg-transparent md:p-0"
                                aria-current="page"
                                onClick={() => signOut()}
                            >
                                {t(option)}
                            </span>
                        </div>
                    </>
                );
        }
    };

    return (
        <div
            className="relative flex h-full w-12 items-center justify-center font-medium  "
            id="profile-dropdown"
            ref={dropdown}
        >
            <div
                onClick={() => setOpen(!open)}
                className="hover:cursor-pointer"
            >
                <Image
                    src={'/icons/user-profile.svg'}
                    alt={'Profile'}
                    className={
                        'h-[40px] mt-2 rounded-full bg-beer-blonde w-[40px]'
                    }
                    width={0}
                    height={0}
                />

                <FontAwesomeIcon
                    icon={faChevronCircleDown}
                    style={{ color: '#432a14' }}
                    title={'chevron_circle_down'}
                    width={20}
                    height={20}
                    className={`absolute bottom-0 right-0 ${
                        open && 'rotate-180'
                    }`}
                />
            </div>

            {/* Dropdow */}
            <div
                className={`absolute inset-y-8 right-0 z-40 w-44 border-collapse space-y-1 divide-y divide-gray-100 shadow-lg dark:bg-gray-700
                ${open ? 'block ' : 'hidden'}`}
            >
                {/* Display user role  */}
                <div className="flex border-2 border-beer-gold ring-2 rounded-sm ring-beer-draft items-center justify-center bg-beer-darkGold p-1a">
                    <span className=" text-sm text-white font-semibold dark:text-white ">
                        {t('role.' + `${role}`)}
                    </span>
                </div>

                <div className={`p-1 bg-beer-foam rounded-lg border-4`}>
                    {/* Little container with username photo and username  */}
                    <figure className="rounded-t-lg flex items-center justify-center bg-beer-darkGold p-1">
                        <Image
                            src={'/icons/user-profile.svg'}
                            alt={'Go to Shopping cart'}
                            className={'rounded-full'}
                            width={0}
                            height={0}
                            style={{ width: '45px', height: '45px' }}
                        />
                        {role && (
                            <span className="ml-2 text-sm text-white font-semibold dark:text-white hover:cursor-pointer hover:text-beer-draft transition-all ease-in-out">
                                <Link
                                    href={generateLink(role, 'profile')}
                                    locale={locale}
                                >
                                    {user?.username}
                                </Link>
                            </span>
                        )}
                    </figure>

                    <ul
                        className={`overflow-y-auto shadow dark:text-gray-200 rounded-b-lg`}
                    >
                        {options?.map((option: string, idx: number) => (
                            <li key={idx}>{handleDropdownButton(option)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
