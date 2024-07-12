'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from './components/common/Button';
import useOnClickOutside from '../../hooks/useOnOutsideClickDOM';
import { useLocale } from 'next-intl';
import { useRef, useState } from 'react';
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
} from '../../config';
import { useTranslations } from 'next-intl';
import { INotification } from '../../lib/types/types';
import { useAuth } from './(auth)/Context/useAuth';
import { useAppContext } from '../context/AppContext';
import { usePathname, useRouter } from 'next/navigation';
import { NotificationPopup } from './components/NotificationPopup';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { ROLE_ENUM } from '../../lib/enums';

interface Props {
    notifications: INotification[];
    i18nLocaleArray: string[];
}

export default function MobileMenu({ notifications, i18nLocaleArray }: Props) {
    const { role, user } = useAuth();

    const sidebarRef = useRef<HTMLDivElement>(null);

    const { openNotification, setOpenNotification } = useAppContext();
    const { cartQuantity, openCart } = useShoppingCart();
    useOnClickOutside(sidebarRef, () => handleClickOutsideCallback());

    const t = useTranslations();
    const locale = useLocale();
    const pathName = usePathname();

    const [openHamburguer, setOpenHamburger] = useState(false);
    const router = useRouter();

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

    const MENU_ITEM_STYLES =
        'block rounded py-2 pr-4 pl-3 text-md font-semibold text-beer-dark hover:text-beer-draft dark:text-white md:bg-transparent md:p-0 lg:text-lg';

    const MENU_HEADER_STYLES =
        'text-lg font-bold text-beer-dark uppercase py-4 border-b-2 border-beer-softBlonde mr-4';

    return (
        <header className="header absolute w-full bg-beer-darkGold m:hidden md:z-30 bg-[url('/assets/header-bg.jpg')] bg-cover bg-center">
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
                    <div className="m-auto absolute left-2/4 -ml-24 mt-2 z-20">
                        <Button
                            class={`${MENU_ITEM_STYLES} bg-beer-softBlonde text-beer-dark m-auto font-bold`}
                            onClick={handleSignIn}
                        >
                            {t('sign_up_now').toUpperCase()}
                        </Button>
                    </div>
                )}

                {/* Logo Cervezanas  */}
                <div className="relative flex h-16 w-full flex-shrink-0 justify-center md:h-20 lg:h-24">
                    <figure className="absolute flex h-[70px] w-[70px] right-0 p-2 sm:h-[143px] sm:w-[141px] sm:p-2 lg:h-[153] lg:w-[151px] ">
                        <Link href={'/'} locale={locale}>
                            <Image
                                src="/logo_cervezanas.svg"
                                alt="Cervezanas Logo"
                                width={100}
                                height={100}
                                style={{ objectFit: 'contain' }}
                                priority={true}
                                sizes="100px"
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
                                                {notifications?.length || 0}
                                            </div>
                                        </div>
                                    </Button>

                                    <NotificationPopup
                                        open={openNotification}
                                        setOpen={setOpenNotification}
                                        notifications={notifications}
                                    />

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
                                            {t('notifications').toUpperCase()}
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
                                            {t('notifications').toUpperCase()}
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
                                    class={`${MENU_ITEM_STYLES} hover:bg-beer-softFoam text-white transition-all duration-200`}
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
