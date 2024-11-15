'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from './components/ui/buttons/Button';
import useNotifications from '@/hooks/useNotifications';
import useOnClickOutside from '@/hooks/useOnOutsideClickDOM';
import { useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { ROLE_ENUM } from '@/lib//enums';
import { useTranslations } from 'next-intl';
import { useAuth } from './(auth)/Context/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { NotificationPopup } from './components/notificationPopup/NotificationPopup';
import {
    ROUTE_ADMIN,
    ROUTE_CONSUMER,
    ROUTE_CONTRACTS_CPS,
    ROUTE_DISTRIBUTOR,
    ROUTE_EVENTS,
    ROUTE_EVENT_ORDERS,
    ROUTE_EXPERIENCES,
    ROUTE_MONTHLY_PRODUCTS,
    ROUTE_NOTIFICATIONS,
    ROUTE_ONLINE_ORDERS,
    ROUTE_PRODUCER,
    ROUTE_PRODUCTS,
    ROUTE_PROFILE,
    ROUTE_SETTINGS,
    ROUTE_SIGNIN,
} from '@/config';
import { generateLink } from '@/utils/utils';
import DropdownRoleList from './components/DropdownRoleList';
import { useAppContext } from '../context/AppContext';

interface Props {
    i18nLocaleArray: string[];
}

export default function MobileMenu({ i18nLocaleArray }: Props) {
    const { role, user } = useAuth();
    const [open, setOpen] = useState(false);
    const dropdown = useRef<HTMLDivElement>(null);
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
    const [displayDropdownRoles, setDisplayDropdownRoles] = useState(false);
    const [isArrowDown, setIsArrowDown] = useState(false);
    const { changeSidebarActive } = useAppContext();
    const handleOnClickRole = () => {
        //  setDisplayDropdownRoles(true);
        setDisplayDropdownRoles(!isArrowDown);
        setIsArrowDown((prevState) => !prevState);
    };
    const handleOnClickRoleOutside = () => {
        setDisplayDropdownRoles(false);
        setIsArrowDown(true);
    };
    const handleOnClickOption = (option: string) => {
        setOpen(false);
        changeSidebarActive(option);
    };
    const { notifications } = useNotifications();

    const sidebarRef = useRef<HTMLDivElement>(null);

    const { setOpenNotification } = useNotifications();
    const { cartQuantity, openCart } = useShoppingCart();
    useOnClickOutside(sidebarRef, () => handleClickOutsideCallback());

    const t = useTranslations();
    const locale = useLocale();
    const pathName = usePathname();

    const [openHamburguer, setOpenHamburger] = useState(false);
    const router = useRouter();

    const numberOfUnreadNotifications = notifications.filter(
        (notification) => !notification.read,
    ).length;

    const handleClickOutsideCallback = () => {
        setOpenHamburger(false);
    };

    const redirectedPathName = (locale: string) => {
        if (!pathName) return '/';
        const segments = pathName.split('/');
        segments[1] = locale;
        return segments.join('/');
    };

    const handleSignIn = () => {
        router.push(`/${locale}${ROUTE_SIGNIN}`);
        setOpenNotification(false);
    };

    // TODO: Cerrar sesión BIEN
    const handleSignOut = () => {
        router.push(`/${locale}/signout`);
        setOpenNotification(false);
    };

    const handleDropdownButton = (option: string) => {
        if (!role) return;

        switch (option) {
            case 'profile':
                return (
                    <Link href={generateLink(role, option)} locale={locale}>
                        <div
                            className={`bg-beer-foam p-2 hover:bg-beer-softBlondeBubble active:bg-beer-gold transition-all ease-in-out dark:bg-gray-700 
                                dark:text-white dark:hover:bg-gray-600 hover:cursor-pointer dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600
                                hover:cursor-pointer text-sm lg:text-base`}
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
        }
    };

    const MENU_ITEM_STYLES =
        'block rounded py-2 pr-4 pl-3 text-md font-semibold text-beer-dark hover:text-beer-draft dark:text-white md:bg-transparent md:p-0 lg:text-lg';

    const MENU_HEADER_STYLES =
        'text-lg font-bold text-beer-dark uppercase py-4 border-b-2 border-beer-softBlonde mr-4';

    return (
        <header className="header w-full bg-beer-darkGold m:hidden md:z-30 bg-[url('/assets/header-bg.jpg')] bg-cover bg-center">
            <nav>
                {/* Hamburguer menu  */}
                <Button
                    data-collapse-toggle="navbar-default"
                    class="absolute top-2 z-10 ml-3  inline-flex items-center rounded-lg border-beer-softBlonde p-2 text-sm text-beer-softBlonde transition-all duration-300 hover:border-beer-draft hover:text-beer-draft focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 h-[50px] bg-beer-draft"
                    aria-controls="navbar-default"
                    aria-expanded="false"
                    onClick={() => setOpenHamburger(true)}
                >
                    <>
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="h-6 w-6"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </>
                </Button>

                {!user && (
                    <div className="m-auto absolute left-2/4 -ml-24 mt-2 z-20 p-2 bg-beer-softBlonde bg-opacity-50 rounded-md">
                        <Button
                            class={`${MENU_ITEM_STYLES} bg-beer-softBlonde text-beer-dark m-auto font-bold`}
                            onClick={handleSignIn}
                        >
                            {t('sign_up_now').toUpperCase()}
                        </Button>
                    </div>
                )}

                {/* Logo Cervezanas  */}
                <div className="relative flex h-16 w-full flex-shrink-0 justify-center md:h-20 lg:h-24 overflow-hidden">
                    <figure className="absolute flex h-[55px] w-[55px] right-0 p-2 sm:h-[65px] sm:w-[65px] sm:p-2 sm:mr-8 sm:mt-2 lg:h-[153] lg:w-[151px] ">
                        <Link href={'/'} locale={locale}>
                            <Image
                                src="/logo_cervezanas.svg"
                                alt="Cervezanas Logo"
                                layout="fill"
                                objectFit="contain"
                                priority={true}
                            />
                        </Link>
                        <div className="absolute -bottom-5 h-[22px] w-full pt-[22px]"></div>
                    </figure>
                </div>

                <div
                    ref={sidebarRef}
                    className={`min-w-[250px] fixed left-0 top-0 z-30 h-full w-auto transform bg-beer-gold transition-transform duration-300 ease-in-out sm:hidden ${
                        openHamburguer
                            ? 'bg-darkGold translate-x-0'
                            : '-translate-x-full bg-beer-gold'
                    }`}
                >
                    <ul className="space-y-2 pl-4 pt-16 h-[100%] overflow-y-scroll pb-10">
                        <li className="flex items-center justify-center space-x-4 pr-10 ">
                            {/* Language  */}
                            {i18nLocaleArray.map((locale) => {
                                return (
                                    <li
                                        className="mt-3 h-[30px] w-[30px] rounded-full border-2 bg-beer-blonde p-1 text-center text-xs uppercase text-beer-dark hover:text-white hover:bg-beer-draft font-semibold"
                                        key={locale}
                                    >
                                        <Link href={redirectedPathName(locale)}>
                                            {locale}
                                        </Link>
                                    </li>
                                );
                            })}

                            {user && (
                                <>
                                    {/* Notification popup  */}

                                    <Button
                                        class={
                                            'border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent'
                                        }
                                        onClick={() =>
                                            setOpenNotification(true)
                                        }
                                        title={''}
                                    >
                                        <div className="relative rounded-full">
                                            <Image
                                                alt={'Notification bell'}
                                                className={'rounded-full'}
                                                width={0}
                                                height={0}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                }}
                                                src={
                                                    '/icons/notification-icon.svg'
                                                }
                                            />
                                            <div className="white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde">
                                                {numberOfUnreadNotifications}
                                            </div>
                                        </div>
                                    </Button>

                                    <NotificationPopup />

                                    {/* Cart  */}
                                    <Button
                                        class={
                                            'border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent'
                                        }
                                        onClick={() => openCart()}
                                        title={'Cart Items'}
                                    >
                                        <div className="relative rounded-full">
                                            <Image
                                                alt={'Go to Shopping cart'}
                                                className={'rounded-full'}
                                                width={0}
                                                height={0}
                                                style={{
                                                    width: '45px',
                                                    height: '45px',
                                                }}
                                                src={'/icons/shopping-cart.svg'}
                                                loader={() =>
                                                    '/icons/shopping-cart.svg'
                                                }
                                            />
                                            <span className="white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde">
                                                {cartQuantity()}
                                            </span>
                                        </div>
                                    </Button>
                                    {/* Profile */}
                                    <div
                                        className="relative flex h-full items-center justify-center font-medium w-[50px]"
                                        id="profile-dropdown"
                                        ref={dropdown}
                                    >
                                        <div
                                            //   onClick={() => setOpen(!open)}
                                            onClick={handleOnClickRole}
                                            className="hover:cursor-pointer"
                                        >
                                            <Image
                                                src={imageSrc}
                                                alt={'Profile'}
                                                className={
                                                    'h-[40px] w-[40px] lg:h-[50px] lg:w-[50px]  rounded-full bg-beer-blonde border-beer-softBlondeBubble border-2 '
                                                }
                                                width={40}
                                                height={40}
                                            />

                                            <Image
                                                src={
                                                    isArrowDown
                                                        ? '/icons/arrow-down.svg'
                                                        : '/icons/arrow-up.svg'
                                                }
                                                alt="Arrow icon"
                                                className="ml-2 absolute top-6 right-0"
                                                width={20}
                                                height={20}
                                            />
                                            <div className="-left-20 relative -top-10">
                                                {displayDropdownRoles && (
                                                    <DropdownRoleList
                                                        handleOnClickRoleOutside={
                                                            handleOnClickRoleOutside
                                                        }
                                                    />
                                                )}

                                                {/*  <span className=" text-sm text-white font-semibold dark:text-white ">
                        {t('role.' + `${role}`)}
                    </span>*/}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </li>

                        <li className={`${MENU_HEADER_STYLES}`}>
                            {t('menu').toUpperCase()}
                        </li>
                        {/* Marketplace link  */}
                        <li className="flex items-center">
                            <Link
                                href="/marketplace"
                                onClick={() => setOpenNotification(false)}
                                locale={locale}
                            >
                                <span className={`${MENU_ITEM_STYLES}`}>
                                    {t('marketplace').toUpperCase()}
                                </span>
                            </Link>
                        </li>
                        {/* Events link  */}
                        <li className="flex items-center">
                            <Link
                                href="/events"
                                onClick={() => setOpenNotification(false)}
                                locale={locale}
                            >
                                <span
                                    className={`${MENU_ITEM_STYLES}`}
                                    aria-current="page"
                                >
                                    {t('events').toUpperCase()}
                                </span>
                            </Link>
                        </li>

                        {role === ROLE_ENUM.Cervezano && (
                            <>
                                <li className={`${MENU_HEADER_STYLES}`}>
                                    {t('my_account').toUpperCase()}
                                </li>

                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_CONSUMER}${ROUTE_PROFILE}${ROUTE_SETTINGS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('profile').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>

                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_CONSUMER}${ROUTE_PROFILE}${ROUTE_ONLINE_ORDERS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('online_orders').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>

                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_CONSUMER}${ROUTE_PROFILE}${ROUTE_EVENT_ORDERS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('event_orders').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>
                            </>
                        )}

                        {role === ROLE_ENUM.Productor && (
                            <>
                                <li className={`${MENU_HEADER_STYLES}`}>
                                    {t('my_account').toUpperCase()}
                                </li>

                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_SETTINGS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('profile').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>

                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_PRODUCTS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('products').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>

                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_EVENTS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('events').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>

                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_EXPERIENCES}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('experiences').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>

                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_ONLINE_ORDERS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('online_orders').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>

                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_EVENT_ORDERS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('event_orders').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>
                            </>
                        )}

                        {role === ROLE_ENUM.Distributor && (
                            <>
                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_DISTRIBUTOR}${ROUTE_PROFILE}${ROUTE_SETTINGS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('profile').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>
                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_DISTRIBUTOR}${ROUTE_PROFILE}${ROUTE_CONTRACTS_CPS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('submitted_aps').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>
                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_DISTRIBUTOR}${ROUTE_PROFILE}${ROUTE_MONTHLY_PRODUCTS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t(
                                                'monthly_products',
                                            ).toUpperCase()}
                                        </span>
                                    </Link>
                                </li>
                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_DISTRIBUTOR}${ROUTE_PROFILE}${ROUTE_NOTIFICATIONS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t(
                                                'notifications.label',
                                            ).toUpperCase()}
                                        </span>
                                    </Link>
                                </li>
                            </>
                        )}

                        {role === ROLE_ENUM.Admin && (
                            <>
                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_ADMIN}${ROUTE_PROFILE}${ROUTE_EVENTS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('events').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>
                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_ADMIN}${ROUTE_PROFILE}${ROUTE_CONTRACTS_CPS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t('submitted_aps').toUpperCase()}
                                        </span>
                                    </Link>
                                </li>
                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_ADMIN}${ROUTE_PROFILE}${ROUTE_MONTHLY_PRODUCTS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t(
                                                'monthly_products',
                                            ).toUpperCase()}
                                        </span>
                                    </Link>
                                </li>
                                <li className="flex items-center">
                                    <Link
                                        href={`${ROUTE_ADMIN}${ROUTE_PROFILE}${ROUTE_NOTIFICATIONS}`}
                                        onClick={() =>
                                            setOpenNotification(false)
                                        }
                                        locale={locale}
                                    >
                                        <span
                                            className={`${MENU_ITEM_STYLES}`}
                                            aria-current="page"
                                        >
                                            {t(
                                                'notifications.label',
                                            ).toUpperCase()}
                                        </span>
                                    </Link>
                                </li>
                            </>
                        )}
                        {!user ? (
                            <li className="flex items-center">
                                <Button
                                    class={`${MENU_ITEM_STYLES} bg-beer-softBlonde text-beer-dark`}
                                    onClick={handleSignIn}
                                >
                                    {t('sign_in').toUpperCase()}
                                </Button>
                            </li>
                        ) : (
                            <li className="flex items-center ">
                                <Button
                                    accent
                                    class={`${MENU_ITEM_STYLES} bg-transparent text-white transition-all duration-200`}
                                    onClick={handleSignOut}
                                >
                                    {t('signout').toUpperCase()}
                                </Button>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    );
}
