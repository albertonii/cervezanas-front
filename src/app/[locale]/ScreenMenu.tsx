'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from './components/common/Button';
import { memo, useEffect, useRef, useState } from 'react';
import { COMMON } from '../../constants';
import { ROUTE_SIGNIN } from '../../config';
import { INotification } from '../../lib/types/types';
import { useAuth } from './(auth)/Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { HeaderDropdownButton } from './HeaderDropdownButton';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { DeviceScreenNotification } from './components/DeviceScreenNotification';
import { ROLE_ENUM } from '../../lib/enums';
import DropdownRoleList from './components/DropdownRoleList';
import useOnClickOutside from '../../hooks/useOnOutsideClickDOM';

interface Props {
    notifications: INotification[];
    i18nLocaleArray: string[];
}

const ScreenMenu = memo(function ScreenMenu({
    notifications,
    i18nLocaleArray,
}: Props) {
    const { user, role, changeRole } = useAuth();
    const locale = useLocale();
    const t = useTranslations();
    const pathName = usePathname();

    const router = useRouter();

    const [animateShoppingCart, setAnimateShoppingCart] = useState(false);
    const [displayDropdownRoles, setDisplayDropdownRoles] = useState(false);

    const { cartQuantity, openCart } = useShoppingCart();

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

    const redirectedPathName = (locale: string) => {
        if (!pathName) return '/';
        const segments = pathName.split('/');
        segments[1] = locale;
        return segments.join('/');
    };

    const handleSignIn = () => {
        router.push(`/${locale}${ROUTE_SIGNIN}`);
    };

    const MENU_ITEM_STYLES =
        'block text-sm font-bold text-beer-dark hover:bg-cerv-banana hover:bg-opacity-50 px-3 py-3 bg-beer-softBlonde bg-opacity-50 rounded-xl hover:text-white border-2 border-beer-softFoam mt-1 mb-1 uppercase';

    return (
        <section className="py-1 hidden rounded border-gray-200 bg-[url('/assets/header-bg.jpg')] bg-cover bg-center bg-no-repeat dark:bg-gray-900 sm:block sm:px-4 dark:text-white">
            <nav className="container grid max-w-full grid-cols-3 bg-beer-darkGold sm:flex sm:justify-between sm:gap-2 sm:bg-transparent  w-[1250px] m-auto">
                {/* Left elements  */}

                {/* Logo Cervezanas  */}
                <section className="w-[300px] sm:w-[100px]" id="navbar-default">
                    <div className="relative flex w-full flex-shrink-0 justify-center">
                        <div className="relative flex h-[55px] w-[55px] justify-center pt-1">
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
                        </div>
                    </div>
                </section>
                <section className="flex w-full items-right justify-end sm:w-[350px] lg:w-[400px] ml-auto">
                    <ul className="align-center sm:flex md:mt-0 md:flex-row md:space-x-4 md:text-sm md:font-medium mx-6">
                        <li className="flex items-center">
                            <Link href="/marketplace" locale={locale}>
                                <span className={`${MENU_ITEM_STYLES}`}>
                                    {t('marketplace')}
                                </span>
                            </Link>
                        </li>

                        <li className="flex items-center">
                            <Link href="/events" locale={locale}>
                                <span
                                    className={`${MENU_ITEM_STYLES}`}
                                    aria-current="page"
                                >
                                    {t('events')}
                                </span>
                            </Link>
                        </li>
                        {/* <li className="flex items-center">
                            <Link href={'/beer-me'} locale={locale}>
                                <span
                                    className={`${MENU_ITEM_STYLES}`}
                                    aria-current="page"
                                >
                                    Puntos cervezanas
                                </span>
                            </Link>
                        </li> */}
                    </ul>
                </section>

                {/* Right elements  */}
                <section className="w-[320px] ">
                    <ul className="py-2 pt-1  :flex sm:flex-row sm:justify-end sm:gap-0 sm:align-middle md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium flex">
                        {/* Language  */}
                        {/* <li className="flex max-w-[50px] items-center">
                            <Select
                                size="tiny"
                                name="language"
                                style={{
                                backgroundColor: "transparent",
                                maxWidth: "50px",
                                }}
                                onChange={onChangeLanguage}
                                className=""
                            >
                                <Select.Option value="es">
                                <Link href={redirectedPathName(locale)}>🇪🇸</Link>
                                </Select.Option>
                                <Select.Option value="en">
                                <Link href={redirectedPathName(locale)}>🇬🇧</Link>
                                </Select.Option>
                            </Select>
                            </li> */}

                        {i18nLocaleArray.map((locale) => {
                            return (
                                <li
                                    key={locale}
                                    className="mt-3 h-[30px] w-[30px] rounded-full border-2 bg-beer-blonde p-1 text-center text-xs uppercase text-beer-dark hover:text-white hover:bg-beer-draft font-semibold"
                                >
                                    <Link href={redirectedPathName(locale)}>
                                        {locale}
                                    </Link>
                                </li>
                            );
                        })}

                        {!user ? (
                            <>
                                <li className="flex items-center">
                                    <Button
                                        onClick={() => handleSignIn()}
                                        title={''}
                                    >
                                        <section className="mx-2 my-1 flex items-center justify-center space-x-2">
                                            <Image
                                                width={25}
                                                height={25}
                                                alt={'Login'}
                                                src={COMMON.PROFILE_IMG}
                                            />
                                            <span>{t('my_account')}</span>
                                        </section>
                                    </Button>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* Cart  */}
                                {role === ROLE_ENUM.Cervezano && (
                                    <li
                                        className={`items´center flex ${
                                            animateShoppingCart &&
                                            'animate-wiggle'
                                        }`}
                                    >
                                        <Button
                                            class={
                                                'border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent'
                                            }
                                            onClick={() => openCart()}
                                            title={''}
                                        >
                                            <section className="relative rounded-full lg:mr-4">
                                                <Image
                                                    src={
                                                        '/icons/shopping-cart-nobg.svg'
                                                    }
                                                    width={40}
                                                    height={40}
                                                    alt={'Go to Shopping cart'}
                                                    className={
                                                        'lg:h[50px] mt-2 rounded-full bg-beer-blonde lg:w-[50px] p-[5px] border-beer-softBlondeBubble border-2 '
                                                    }
                                                />
                                                <div
                                                    className={`
                                                        white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-softBlonde 
                                                    `}
                                                >
                                                    {cartQuantity()}
                                                </div>
                                            </section>
                                        </Button>
                                    </li>
                                )}

                                {/* Notifications  */}
                                <DeviceScreenNotification
                                    notifications={notifications}
                                />

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
