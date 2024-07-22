'use client';

import Link from 'next/link';
import Image from 'next/image';
import DropdownRoleList from './components/DropdownRoleList';
import React, { useRef, useState } from 'react';
import { ROLE_ENUM } from '@/lib/enums';
import { generateLink } from '@/utils/utils';
import { useAuth } from './(auth)/Context/useAuth';
import { useAppContext } from '@/app/context/AppContext';
import { useLocale, useTranslations } from 'next-intl';
import { useOutsideClick } from '@/hooks/useOnOutsideClick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';

interface DropdownProps {
    options: string[];
}

export function HeaderDropdownButton({ options }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const { role, signOut, changeRole, user } = useAuth();

    const dropdown = useRef<HTMLDivElement>(null);

    const t = useTranslations();
    const locale = useLocale();

    const { changeSidebarActive } = useAppContext();

    const handleOpenCallback = () => {
        setOpen(false);
    };
    const imageSrc =
        role === ROLE_ENUM.Admin
            ? '/icons/icon-admin.png'
            : role === ROLE_ENUM.Distributor
            ? '/icons/icon-distrib.png'
            : role === ROLE_ENUM.Productor
            ? '/icons/icon-prod.png'
            : '/icons/icon-cerv.png';
    {
        /* const { user, role, changeRole } = useAuth();*/
    }
    const [animateShoppingCart, setAnimateShoppingCart] = useState(false);
    const [displayDropdownRoles, setDisplayDropdownRoles] = useState(false);
    const [isArrowDown, setIsArrowDown] = useState(false);
    const handleOnClickRole = () => {
        setDisplayDropdownRoles(true);
        setIsArrowDown((prevState) => !prevState);
    };

    const handleOnClickRoleOutside = () => {
        setDisplayDropdownRoles(false);
    };

    const handleChangeRole = (role: ROLE_ENUM) => {
        changeRole(role);
        setDisplayDropdownRoles(false);
    };
    const [symbol, setSymbol] = useState('>');

    useOutsideClick(() => handleOpenCallback(), dropdown);

    const handleOnClickOption = (option: string) => {
        setOpen(false);
        changeSidebarActive(option);
    };

    const handleDropdownButton = (option: string) => {
        if (!role) return;

        switch (option) {
            case 'profile':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer`}
                            onClick={() => handleOnClickOption(option)}
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
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer hover:cursor-pointer`}
                            onClick={() => {
                                handleOnClickOption(option);
                                signOut();
                            }}
                        >
                            <span
                                className="text-md  block text-beer-dark dark:text-white  md:bg-transparent md:p-0 dark:bg-transparent dark:hover:bg-transparent"
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
            className="relative flex h-full items-center justify-center font-medium  "
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
                        'lg:h[50px] mt-2 rounded-full bg-beer-blonde lg:w-[50px] p-[5px] border-beer-softBlondeBubble border-2'
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
                className={`w-auto absolute inset-y-8 right-0 z-40 border-collapse space-y-1 divide-y divide-gray-100 shadow-lg dark:bg-gray-700
                ${open ? 'block ' : 'hidden'}`}
            >
                {/* Display user role  */}
                <div className="">
                    <span
                        onClick={handleOnClickRole}
                        className="hover:cursor-pointer hover:bg-beer-softFoam transition-all ease-in-out flex border-2 border-beer-gold ring-2 rounded-sm ring-beer-draft items-center justify-center bg-beer-darkGold p-1 text-white font-semibold text-lg hover:text-beer-dark"
                    >
                        {/* }  {t('role.' + `${role}`) + ' >'} */}
                        {t('role.' + `${role}`)}
                        <Image
                            src={
                                isArrowDown
                                    ? '/icons/arrow-down.svg'
                                    : '/icons/arrow-up.svg'
                            }
                            alt="Arrow icon"
                            className="ml-2"
                            width={20}
                            height={20}
                        />
                    </span>
                    {displayDropdownRoles && (
                        <DropdownRoleList
                            handleOnClickRoleOutside={handleOnClickRoleOutside}
                        />
                    )}

                    {/*  <span className=" text-sm text-white font-semibold dark:text-white ">
                        {t('role.' + `${role}`)}
                    </span>*/}
                </div>

                <div
                    className={`min-w-[14vw] sm:min-w-[20vw] lg:min-w-[14vw] p-1 bg-beer-foam rounded-lg border-4 text-center`}
                >
                    {/* Little container with username photo and username  */}
                    <figure className="flex flex-col rounded-t-lg items-center justify-center bg-beer-darkGold p-1 bg-[url('/assets/header-bg.jpg')] bg-cover bg-center bg-no-repeat">
                        <Image
                            src={imageSrc}
                            alt={'Profile icon'}
                            className={'rounded-full w-full'}
                            width={70}
                            height={70}
                            style={{ width: '70px', height: '70px' }}
                        />
                        {role && (
                            <span className="p-2 ml-2 w-full text-sm text-white font-semibold dark:text-white hover:cursor-pointer hover:text-beer-draft transition-all ease-in-out">
                                <Link
                                    href={generateLink(role, 'profile')}
                                    locale={locale}
                                >
                                    {user?.username}
                                </Link>
                            </span>
                        )}
                    </figure>
                    {/*  <figure className="flex flex-col rounded-t-lg items-center justify-center bg-beer-darkGold p-1">
                        <Image
                            src={'/icons/user-profile.svg'}
                            alt={'Go to Shopping cart'}
                            className={'rounded-full w-full'}
                            width={0}
                            height={0}
                            style={{ width: '45px', height: '45px' }}
                        />

                        {role && (
                            <span className="p-2 ml-2 w-full text-sm text-white font-semibold dark:text-white hover:cursor-pointer hover:text-beer-draft transition-all ease-in-out">
                                <Link
                                    href={generateLink(role, 'profile')}
                                    locale={locale}
                                >
                                    {user?.username}
                                </Link>
                            </span>
                        )}
                    </figure> */}

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
