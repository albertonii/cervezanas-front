"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./Auth/useAuth";
import { COMMON } from "../../constants";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTE_SIGNIN } from "../../config";
import { Button } from "./components/common/Button";
import { useLocale, useTranslations } from "next-intl";
import { HeaderDropdownButton } from "./HeaderDropdownButton";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { i18n } from "../../lib/translations/i18n";
import { INotification } from "../../lib/types";
import { DeviceScreenNotification } from "./components/DeviceScreenNotification";
import PuntoCervezanasFlag from "./PuntoCervezanasFlag";

interface Props {
  notifications: INotification[];
}

export default function ScreenMenu({ notifications }: Props) {
  const { user, role } = useAuth();
  const locale = useLocale();
  const t = useTranslations();
  const pathName = usePathname();

  const router = useRouter();

  const [animateShoppingCart, setAnimateShoppingCart] = useState(false);
  const { cartQuantity, openCart } = useShoppingCart();

  useEffect(() => {
    setTimeout(() => {
      setAnimateShoppingCart(true);
      setTimeout(() => {
        setAnimateShoppingCart(false);
      }, 600);
    }, 300);
  }, [cartQuantity]);

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
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const handleSignIn = () => {
    router.push(`/${locale}${ROUTE_SIGNIN}`);
  };

  const MENU_ITEM_STYLES =
    "block text-sm font-semibold text-white hover:bg-cerv-banana hover:bg-opacity-50 dark:text-white lg:text-base px-3 py-5";

  return (
    <section className="hidden rounded border-gray-200 bg-[url('/assets/header-bg.jpg')] bg-cover bg-center bg-no-repeat dark:bg-gray-900 sm:block sm:px-4">
      <nav className="container grid max-w-full grid-cols-3 bg-beer-darkGold sm:mx-auto sm:flex sm:justify-between sm:gap-2 sm:bg-transparent lg:ml-0 lg:mr-0">
        {/* Left elements  */}

        {/* Logo Cervezanas  */}
        <section className="w-[300px] sm:w-[100px]" id="navbar-default">
          <div className="relative flex w-full flex-shrink-0 justify-center">
            <div className="relative flex h-[55px] w-[55px] justify-center pt-1">
              <Link href={"/"} locale={locale}>
                <Image
                  src="/logo_cervezanas.svg"
                  alt="Cervezanas Logo"
                  width={100}
                  height={100}
                  style={{ objectFit: "contain" }}
                  priority={true}
                  sizes="100px"
                />
              </Link>
            </div>
          </div>
        </section>
        <section className="flex w-full items-center justify-center  sm:w-[450px] lg:w-[500px]">
          <ul className="align-center bg-cerv-brown bg-opacity-60 dark:border-gray-700 dark:bg-gray-800 sm:flex md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium md:dark:bg-gray-900">
            <li className="flex items-center">
              <Link href="/marketplace" locale={locale}>
                <span className={`${MENU_ITEM_STYLES}`}>
                  {t("marketplace")}
                </span>
              </Link>
            </li>

            <li className="flex items-center">
              <Link href="/events" locale={locale}>
                <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                  {t("events")}
                </span>
              </Link>
            </li>
            <li className="flex items-center">
              <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                Puntos cervezanas
              </span>
            </li>
          </ul>
        </section>

        {/* Logo Cervezanas  */}
        {/*
        <section className="w-full" id="navbar-default">
          <div className="relative flex h-16 w-full flex-shrink-0 justify-center md:h-20 lg:h-24">
            <div className="relative flex h-[100px] w-[110px] justify-center bg-beer-gold p-2 sm:h-[143px] sm:w-[141px] sm:p-2 lg:h-[153] lg:w-[151px] ">
              <Link href={"/"} locale={locale}>
                <Image
                  alt="Cervezanas Logo"
                  width={160}
                  height={160}
                  style={{ objectFit: "contain" }}
                  priority={true}
                  sizes="100px"
                  src={"/logo_cervezanas.svg"}
                />
              </Link>
              <p className="absolute -bottom-5 h-[22px] w-full bg-beer-darkGold pt-[22px]"></p>
            </div>
          </div>
        </section>
*/}
        {/* Right elements  */}
        <section className="w-[400px] ">
          <ul className="py-2 pt-1 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:flex-row sm:justify-end sm:gap-4 sm:align-middle md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium md:dark:bg-gray-900">
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

            {i18n.locales.map((locale) => {
              return (
                <li
                  key={locale}
                  className="mt-3 h-[30px] w-[30px] rounded-full border-2 border-beer-dark bg-cerv-titlehigh p-1 text-center text-xs uppercase text-beer-softFoam hover:bg-beer-draft"
                >
                  <Link href={redirectedPathName(locale)}>{locale}</Link>
                </li>
              );
            })}

            {!user ? (
              <>
                <li className="flex items-center">
                  <Button onClick={() => handleSignIn()} title={""}>
                    <section className="mx-2 my-1 flex items-center justify-center space-x-2">
                      <Image
                        width={25}
                        height={25}
                        alt={"Login"}
                        src={COMMON.PROFILE_IMG}
                      />
                      <span>{t("my_account")}</span>
                    </section>
                  </Button>
                </li>
              </>
            ) : (
              <>
                {/* Cart  */}
                {role === "consumer" && (
                  <li
                    className={`items´center flex ${
                      animateShoppingCart && "animate-wiggle"
                    }`}
                  >
                    <Button
                      class={
                        "border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent"
                      }
                      onClick={() => openCart()}
                      title={""}
                    >
                      <section className="relative rounded-full lg:mr-4">
                        <Image
                          src={"/icons/shopping-cart-nobg.svg"}
                          width={40}
                          height={40}
                          alt={"Go to Shopping cart"}
                          className={
                            "lg:h[40px] mt-2 rounded-full bg-beer-blonde lg:w-[40px]"
                          }
                        />
                        <div
                          className={`white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde 
                          `}
                        >
                          {cartQuantity()}
                        </div>
                      </section>
                    </Button>
                  </li>
                )}

                {/* Notifications  */}
                <DeviceScreenNotification notifications={notifications} />

                <li className="flex items-center">
                  <HeaderDropdownButton
                    options={
                      role === "admin"
                        ? [
                            "submitted_aps",
                            "monthly_products",
                            "notifications",
                            "signout",
                          ]
                        : role === "distributor"
                        ? [
                            "profile",
                            "logistics",
                            "contracts",
                            "business_orders",
                            "signout",
                          ]
                        : role === "producer"
                        ? [
                            "profile",
                            "products",
                            "events",
                            "online_orders",
                            "event_orders",
                            // "campaigns",
                            "signout",
                          ]
                        : [
                            "profile",
                            "online_orders",
                            "event_orders",
                            "signout",
                          ]
                    }
                  />
                </li>
              </>
            )}
          </ul>

          <PuntoCervezanasFlag />
        </section>
      </nav>
    </section>
  );
}
