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
import { Notification } from "./components/Notification";
import { HeaderDropdownButton } from "./HeaderDropdownButton";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import { useAppContext } from "../../../context/AppContext";
import { i18n } from "../../lib/translations/i18n";

export function ScreenMenu() {
  const { user, role } = useAuth();
  const locale = useLocale();
  const t = useTranslations();
  const pathName = usePathname();

  const router = useRouter();

  const [animateNotifications, setAnimateNotifications] = useState(false);
  const [animateShoppingCart, setAnimateShoppingCart] = useState(false);

  const { cartQuantity, openCart } = useShoppingCart();
  const { notifications, openNotification, setOpenNotification } =
    useAppContext();

  useEffect(() => {
    setTimeout(() => {
      setAnimateShoppingCart(true);
      setTimeout(() => {
        setAnimateShoppingCart(false);
      }, 600);
    }, 300);
  }, [cartQuantity]);

  useEffect(() => {
    setTimeout(() => {
      setAnimateNotifications(true);
      setTimeout(() => {
        setAnimateNotifications(false);
      }, 600);
    }, 300);
  }, [notifications]);

  const onChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const redirectedPathName = (locale: string) => {
      if (!pathName) return "/";
      const segments = pathName.split("/");
      segments[1] = locale;
      return segments.join("/");
    };

    const language = event.target.value;

    console.log(redirectedPathName(language));
    // i18n.changeLanguage(language);
  };

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
    "block rounded py-2 pr-4 pl-3 text-sm font-semibold text-beer-dark hover:text-beer-draft dark:text-white md:bg-transparent md:p-0 lg:text-lg";

  const handleClickBell = () => {
    setOpenNotification(true);
  };

  return (
    <section className="hidden rounded border-gray-200 dark:bg-gray-900 sm:block sm:px-4">
      <nav className="container grid grid-cols-3 bg-beer-darkGold sm:mx-auto sm:flex sm:justify-between sm:gap-2 sm:bg-transparent">
        {/* Left elements  */}
        <section className="flex w-full items-center justify-center ">
          <ul className="align-center mt-4 p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium md:dark:bg-gray-900">
            <li className="flex items-center">
              <Link href="/marketplace" locale={locale}>
                <span className={`${MENU_ITEM_STYLES}`}>
                  {t("marketplace").toUpperCase()}
                </span>
              </Link>
            </li>

            {/* <li className="flex items-center">
                <Link href="/community" locale={locale}>
                  <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                    {t("community").toUpperCase()}
                  </span>
                </Link>
              </li> */}

            <li className="flex items-center">
              <Link href="/events" locale={locale}>
                <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                  {t("events").toUpperCase()}
                </span>
              </Link>
            </li>
          </ul>
        </section>

        {/* Logo Cervezanas  */}
        <section className="w-full" id="navbar-default">
          <div className="relative flex h-16 w-full flex-shrink-0 justify-center md:h-20 lg:h-24">
            <div className="relative flex h-[100px] w-[110px] justify-center bg-beer-gold p-2 sm:h-[143px] sm:w-[141px] sm:p-2 lg:h-[153] lg:w-[151px] ">
              <Link href={"/"} locale={locale}>
                <Image
                  src="/logo_cervezanas.svg"
                  alt="Cervezanas Logo"
                  width={160}
                  height={160}
                  style={{ objectFit: "contain" }}
                  priority={true}
                  sizes="100px"
                />
              </Link>
              <p className="absolute -bottom-5 h-[22px] w-full bg-beer-darkGold pt-[22px]"></p>
            </div>
          </div>
        </section>

        {/* Right elements  */}
        <section className="w-full ">
          <ul className="py-2 dark:border-gray-700 dark:bg-gray-800 sm:mt-4 sm:flex sm:flex-row sm:justify-end sm:p-4 sm:align-middle md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium md:dark:bg-gray-900">
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
                <li key={locale}>
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
                        src={COMMON.PROFILE_IMG}
                        width={25}
                        height={25}
                        alt={"Login"}
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
                      <section className="relative rounded-full">
                        <Image
                          src={"/icons/shopping-cart.svg"}
                          width={45}
                          height={45}
                          alt={"Go to Shopping cart"}
                          className={"rounded-full"}
                        />
                        <div
                          className={`white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde 
                          `}
                        >
                          {cartQuantity}
                        </div>
                      </section>
                    </Button>
                  </li>
                )}

                {/* Notifications  */}
                <li
                  className={`relative flex items-center ${
                    animateNotifications && "animate-wiggle"
                  }`}
                >
                  <Button
                    class={
                      "border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent"
                    }
                    onClick={() => handleClickBell()}
                    title={""}
                  >
                    <section className="relative rounded-full">
                      <Image
                        src={"/icons/notification-icon.svg"}
                        width={45}
                        height={45}
                        alt={"Notification bell"}
                        className={"rounded-full"}
                      />
                      <div className="white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde">
                        {notifications?.length ?? 0}
                      </div>
                    </section>
                  </Button>

                  {/* Notification popup  */}
                  <Notification
                    open={openNotification}
                    setOpen={setOpenNotification}
                  />
                </li>

                <li className="flex items-center">
                  <HeaderDropdownButton
                    options={
                      role === "admin"
                        ? ["submitted_aps", "monthly_products", "signout"]
                        : role === "distributor"
                        ? ["profile", "logistics", "signout"]
                        : role === "producer"
                        ? [
                            "profile",
                            "products",
                            "events",
                            "online_orders",
                            "event_orders",
                            "campaigns",
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

          <section className="absolute right-0 top-10 rounded-l-lg bg-beer-dark sm:top-24">
            <Link
              href={"/beer-me"}
              locale={locale}
              className="flex flex-col items-center justify-start space-x-4 sm:flex-row sm:rounded-l sm:px-2 sm:py-1"
            >
              <Image
                src={"/icons/beerme.svg"}
                width={45}
                height={45}
                alt={"Find Cervezanas spots"}
                className={
                  "mx-4 my-2 w-10 rounded-full sm:mx-0 sm:my-0 sm:w-12"
                }
              />

              <div className="sm:flex sm:flex-col">
                <span className="text-right text-beer-foam ">Puntos</span>
                <span className="text-right text-beer-foam ">Cervezanas</span>
              </div>
            </Link>
          </section>
        </section>
      </nav>
    </section>
  );
}
