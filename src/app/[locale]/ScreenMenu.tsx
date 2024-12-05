'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from './components/ui/buttons/Button';
import DropdownRoleList from './components/DropdownRoleList';
import LanguageScreenMenuButton from './components/ui/buttons/LanguageScreenMenuButton';
import ShoppingCartScreenMenuButton from './components/ui/buttons/ShoppingCartScreenMenuButton';
import { memo, useEffect, useState } from 'react';
import { ROLE_ENUM } from '@/lib/enums';
import { useAuth } from './(auth)/Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { Beer, Calendar, Map } from 'lucide-react';
import { HeaderDropdownButton } from './HeaderDropdownButton';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { DeviceScreenNotification } from './components/DeviceScreenNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface Props {
    i18nLocaleArray: string[];
    onLoginClick: () => void;
}

const ScreenMenu = memo(function ScreenMenu({
    i18nLocaleArray,
    onLoginClick,
}: Props) {
    const { user, role, changeRole } = useAuth();
    const locale = useLocale();
    const t = useTranslations();

    const [animateShoppingCart, setAnimateShoppingCart] = useState(false);
    const [displayDropdownRoles, setDisplayDropdownRoles] = useState(false);

    const { cartQuantity } = useShoppingCart();

    useEffect(() => {
        setTimeout(() => {
            setAnimateShoppingCart(true);
            setTimeout(() => {
                setAnimateShoppingCart(false);
            }, 600);
        }, 300);
    }, [cartQuantity]);

    const handleOnClickRoleOutside = () => {
        setDisplayDropdownRoles(false);
    };

    const handleChangeRole = (role: ROLE_ENUM) => {
        changeRole(role);
        setDisplayDropdownRoles(false);
    };

    const handleSignIn = () => {
        onLoginClick();
    };

    const MENU_ITEM_STYLES = `block text-sm font-bold text-beer-foam dark:text-white px-3 uppercase animation-all ease-in-out duration-300`;

    return (
        <section className="hidden bg-cover bg-center bg-no-repeat dark:bg-gray-900 sm:block ">
            <div className="relative">
                <Image
                    src="/assets/header-bg.jpg"
                    alt="Header Background"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    className="rounded dark:opacity-40"
                />

                <nav className="container grid max-w-full grid-cols-3 bg-beer-darkGold bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-90 sm:flex sm:justify-between sm:gap-2 sm:bg-transparent w-[1540px] m-auto">
                    {/* Left elements */}
                    <section
                        className="relative flex w-full pt-1"
                        id="navbar-default"
                    >
                        <Link href={'/'} locale={locale}>
                            <Image
                                src="/logo-cervezanas-horizontal.webp"
                                alt="Cervezanas Logo"
                                layout="responsive"
                                width={810}
                                height={137}
                                style={{ objectFit: 'contain' }}
                                priority={true}
                                sizes="(max-width: 768px) 200px, (max-width: 1200px) 300px, 350px"
                            />
                        </Link>
                    </section>

                    <section className="flex w-full items-right justify-end sm:w-[350px] lg:w-[400px] ml-auto">
                        <ul className="align-center sm:flex md:mt-0 md:flex-row md:space-x-4 md:text-sm md:font-medium mx-6 space-x-4">
                            <li className="flex items-center">
                                <Link
                                    href="/marketplace"
                                    locale={locale}
                                    className="header-btn"
                                >
                                    <Beer
                                        size={24}
                                        className="text-beer-foam dark:text-white"
                                    />
                                    <span
                                        className={`${MENU_ITEM_STYLES} hidden xl:block`}
                                    >
                                        {t('marketplace')}
                                    </span>
                                </Link>
                            </li>

                            <li className="flex items-center">
                                <Link
                                    href="/events"
                                    locale={locale}
                                    className="header-btn"
                                >
                                    <Calendar
                                        size={24}
                                        className="text-beer-foam dark:text-white"
                                    />
                                    <span
                                        className={`${MENU_ITEM_STYLES} hidden xl:block`}
                                        aria-current="page"
                                    >
                                        {t('events')}
                                    </span>
                                </Link>
                            </li>

                            <li className="flex items-center">
                                <Link
                                    href={'/beer-me'}
                                    locale={locale}
                                    className="header-btn"
                                >
                                    <Map
                                        size={24}
                                        className="text-beer-foam dark:text-white"
                                    />
                                    <span
                                        className={`${MENU_ITEM_STYLES} hidden xl:block`}
                                        aria-current="page"
                                    >
                                        {t('cervezanas_spots')}
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </section>

                    {/* Right elements */}
                    <section className="w-[320px]">
                        <ul className="py-2 pt-1 flex sm:flex-row sm:justify-end sm:gap-0 sm:align-middle md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium flex space-x-4">
                            <LanguageScreenMenuButton
                                i18nLocaleArray={i18nLocaleArray}
                            />

                            {!user ? (
                                <li className="flex items-center">
                                    <Button
                                        onClick={handleSignIn}
                                        title={''}
                                        primary
                                    >
                                        <section className="mx-2 my-1 flex items-center justify-center space-x-1 p-1">
                                            <FontAwesomeIcon
                                                icon={faUser}
                                                title={'Sign In avatar'}
                                                className="h-4 w-4 text-black dark:text-white"
                                            />
                                            <span>{t('sign_in')}</span>
                                        </section>
                                    </Button>
                                </li>
                            ) : (
                                <>
                                    {/* Cart */}
                                    {role === ROLE_ENUM.Cervezano && (
                                        <li
                                            className={`flex items-center relative ${
                                                animateShoppingCart &&
                                                'animate-wiggle'
                                            }`}
                                        >
                                            <ShoppingCartScreenMenuButton />
                                        </li>
                                    )}

                                    <li
                                        className={`flex items-center relative`}
                                    >
                                        {/* Notifications */}
                                        <DeviceScreenNotification />
                                    </li>

                                    <li className="flex items-center relative">
                                        {displayDropdownRoles && (
                                            <DropdownRoleList
                                                handleOnClickRoleOutside={
                                                    handleOnClickRoleOutside
                                                }
                                            />
                                        )}

                                        <HeaderDropdownButton
                                            options={
                                                role === ROLE_ENUM.Admin
                                                    ? [
                                                          'events',
                                                          'submitted_aps',
                                                          'monthly_products',
                                                          'notifications',
                                                          'signout',
                                                      ]
                                                    : role ===
                                                      ROLE_ENUM.Distributor
                                                    ? [
                                                          'profile',
                                                          'logistics',
                                                          'contracts',
                                                          'business_orders',
                                                          'signout',
                                                      ]
                                                    : role ===
                                                      ROLE_ENUM.Productor
                                                    ? [
                                                          'profile',
                                                          'products',
                                                          'events',
                                                          'experiences',
                                                          'online_orders',
                                                          'event_orders',
                                                          'signout',
                                                      ]
                                                    : [
                                                          'profile',
                                                          'online_orders',
                                                          'event_orders',
                                                          'signout',
                                                      ]
                                            }
                                        />
                                    </li>
                                </>
                            )}
                        </ul>
                    </section>
                </nav>
            </div>
        </section>
    );
});

export default ScreenMenu;
