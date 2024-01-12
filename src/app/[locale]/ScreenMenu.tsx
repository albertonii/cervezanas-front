"use client";

import Link from "next/link";
import Image from "next/image";
import { Select } from "@supabase/ui";
import { useAuth } from "./Auth/useAuth";
import { COMMON } from "../../constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTE_SIGNIN } from "../../config";
import { Button } from "./components/common/Button";
import { useLocale, useTranslations } from "next-intl";
import { Notification } from "./components/Notification";
import { HeaderDropdownButton } from "./HeaderDropdownButton";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import { useAppContext } from "../../context/AppContext";

export function ScreenMenu() {
  const { user, role } = useAuth();
  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  const [animateNotifications, setAnimateNotifications] = useState(false);
  const [animateShoppingCart, setAnimateShoppingCart] = useState(false);

  const { cartQuantity, openCart } = useShoppingCart();
  const {
    notifications,
    openNotification,
    setOpenNotification,
  } = useAppContext();

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
    // i18n.changeLanguage(event.target.value);
  };

  const handleSignIn = () => {
    router.push(`/${locale}${ROUTE_SIGNIN}`);
  };

  const MENU_ITEM_STYLES =
    "block text-sm font-semibold text-white hover:bg-cerv-banana hover:bg-opacity-50 dark:text-white lg:text-base px-3 py-5";

  const handleClickBell = () => {
    setOpenNotification(true);
  };

  return (
    <section className="hidden rounded border-gray-200 dark:bg-gray-900 sm:block sm:px-4 bg-[url('/assets/header-bg.jpg')] bg-cover bg-no-repeat bg-center">
      <nav className="container grid grid-cols-3 bg-beer-darkGold sm:mx-auto sm:flex sm:justify-between sm:gap-2 sm:bg-transparent lg:ml-0 lg:mr-0 max-w-full">
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
        <section className="flex w-full items-center justify-center  lg:w-[500px] sm:w-[450px]">
          <ul className="align-center dark:border-gray-700 dark:bg-gray-800 sm:flex md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium md:dark:bg-gray-900 bg-cerv-brown bg-opacity-60">
            <li className="flex items-center">
              <Link href="/marketplace" locale={locale}>
                <span className={`${MENU_ITEM_STYLES}`}>
                  {t("marketplace")}
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
        {/* Right elements  */}
        <section className="w-[400px] ">
          <ul className="py-2 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:flex-row sm:justify-end sm:align-middle md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium md:dark:bg-gray-900 pt-1 sm:gap-4">
            {/* Language  */}
            <li className="flex max-w-[50px] items-center">
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
                <Select.Option value="es">🇪🇸</Select.Option>
                <Select.Option value="en">🇬🇧</Select.Option>
              </Select>
            </li>

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
                {role !== "admin" && (
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
                          className={"rounded-full lg:w-[40px] lg:h[40px] mt-2 bg-beer-blonde"}
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
                  className={`relative flex w-[50px] items-center ${
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
                        src={"/icons/notification-icon-nobg.svg"}
                        width={40}
                        height={40}
                        alt={"Notification bell"}
                        className={"rounded-full lg:w-[40px] lg:h[40px] mt-2 bg-beer-blonde"}
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

          {/*       <section className="absolute right-0 top-10 rounded-l-lg bg-beer-dark sm:top-24 z-10">
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
          */}
        </section>
      </nav>
    </section>
  );
}
