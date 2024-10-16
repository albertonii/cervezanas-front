'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from './components/ui/buttons/Button';
import DropdownRoleList from './components/DropdownRoleList';
import ShoppingCartScreenMenuButton from './components/ui/buttons/ShoppingCartScreenMenuButton';
import { memo, useEffect, useState } from 'react';
import { COMMON } from '@/constants';
import { ROLE_ENUM } from '@/lib/enums';
import { INotification } from '@/lib/types/types';
import { useAuth } from './(auth)/Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { HeaderDropdownButton } from './HeaderDropdownButton';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { DeviceScreenNotification } from './components/DeviceScreenNotification';
import { Beer, Calendar, Globe, Map } from 'lucide-react';
import LanguageScreenMenuButton from './components/ui/buttons/LanguageScreenMenuButton';

interface Props {
    notifications: INotification[];
    i18nLocaleArray: string[];
    onLoginClick: () => void;
}

const ScreenMenu = memo(function ScreenMenu({
    notifications,
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

    const handleOnClickRole = () => {
        setDisplayDropdownRoles(true);
    };

    const handleOnClickRoleOutside = () => {
        setDisplayDropdownRoles(false);
    };

    const handleChangeRole = (role: ROLE_ENUM) => {
        changeRole(role);
        setDisplayDropdownRoles(false);
    };

    // const onChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //   const redirectedPathName = (locale: string) => {
    //     if (!pathName) return "/";
    //     const segments = pathName.split("/");
    //     segments[1] = locale;
    //     return segments.join("/");
    //   };

    //   const language = event.target.value;

    //   // i18n.changeLanguage(language);
    // };

    const handleSignIn = () => {
        onLoginClick();
    };

    const MENU_ITEM_STYLES = `block text-sm font-bold text-beer-foam  px-3  uppercase animation-all ease-in-out duration-300`;

    return (
        <section className="py-1 hidden rounded border-gray-200 bg-cover bg-center bg-no-repeat dark:bg-gray-900 sm:block sm:px-4 dark:text-white">
            <Image
                src="/assets/header-bg.jpg"
                alt="Header Background"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="rounded"
            />

            <nav className="container grid max-w-full grid-cols-3 bg-beer-darkGold sm:flex sm:justify-between sm:gap-2 sm:bg-transparent  w-[1250px] m-auto">
                {/* Left elements  */}

                {/* Logo Cervezanas  */}
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
                    <ul className="align-center sm:flex md:mt-0 md:flex-row md:space-x-4 md:text-sm md:font-medium mx-6 space-x-4 ">
                        <li className="flex items-center ">
                            <Link
                                href="/marketplace"
                                locale={locale}
                                className="header-btn"
                            >
                                <Beer size={24} color="#fefefe" />

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
                                <Calendar size={24} color="#fefefe" />

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
                                <Map size={24} color="#fefefe" />

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

                {/* Right elements  */}
                <section className="w-[320px] ">
                    <ul className="py-2 pt-1  :flex sm:flex-row sm:justify-end sm:gap-0 sm:align-middle md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium flex space-x-4">
                        <LanguageScreenMenuButton
                            i18nLocaleArray={i18nLocaleArray}
                        />

                        {!user ? (
                            <>
                                <li className="flex items-center bg-cerv-brown">
                                    <Button
                                        onClick={() => handleSignIn()}
                                        title={''}
                                        primary
                                    >
                                        <section className="mx-2 my-1 flex items-center justify-center space-x-2 hover:text-bear-dark p-1 ">
                                            <Image
                                                width={25}
                                                height={25}
                                                alt={'Login'}
                                                src={COMMON.PROFILE_IMG}
                                            />
                                            <span>{t('sign_in')}</span>
                                        </section>
                                    </Button>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* Cart  */}
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

                                <li className={`flex items-center relative`}>
                                    {/* Notifications  */}
                                    <DeviceScreenNotification
                                        notifications={notifications}
                                    />
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
                                                : role === ROLE_ENUM.Distributor
                                                ? [
                                                      'profile',
                                                      'logistics',
                                                      'contracts',
                                                      'business_orders',
                                                      'signout',
                                                  ]
                                                : role === ROLE_ENUM.Productor
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

                    {/* <PuntoCervezanasFlag /> */}
                </section>
            </nav>
        </section>
    );
});

export default ScreenMenu;
