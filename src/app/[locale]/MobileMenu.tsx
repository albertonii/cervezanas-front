"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useAuth } from "./Auth/useAuth";
import { useRef, useState } from "react";
import { ROUTE_SIGNIN } from "../../config";
import { useTranslations } from "next-intl";
import { i18n } from "../../lib/translations/i18n";
import { Button } from "./components/common/Button";
import { usePathname, useRouter } from "next/navigation";
import { NotificationPopup } from "./components/NotificationPopup";
import { useAppContext } from "../context/AppContext";
import useOnClickOutside from "../../hooks/useOnOutsideClickDOM";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { INotification } from "../../lib/types";

interface Props {
  notifications: INotification[];
}

export default function MobileMenu({ notifications }: Props) {
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
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
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
    "block rounded py-2 pr-4 pl-3 text-md font-semibold text-beer-dark hover:text-beer-draft dark:text-white md:bg-transparent md:p-0 lg:text-lg";

  const MENU_HEADER_STYLES =
    "text-lg font-bold text-beer-dark uppercase py-4 border-b-2 border-beer-softBlonde mr-4";

  return (
    <header className="header absolute w-full bg-beer-foam bg-transparent sm:hidden md:z-30">
      <nav>
        {/* Hamburguer menu  */}
        <Button
          data-collapse-toggle="navbar-default"
          class="absolute top-6 z-10 ml-3  inline-flex items-center rounded-lg border-beer-softBlonde p-2 text-sm text-beer-softBlonde transition-all duration-300 hover:border-beer-draft hover:text-beer-draft focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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

        {/* Logo Cervezanas  */}
        <div className="relative flex h-16 w-full flex-shrink-0 justify-center md:h-20 lg:h-24">
          <figure className="absolute flex h-[90px] w-[90px] justify-center bg-beer-gold p-2 sm:h-[143px] sm:w-[141px] sm:p-2 lg:h-[153] lg:w-[151px] ">
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
            <div className="absolute -bottom-5 h-[22px] w-full bg-beer-darkGold pt-[22px]"></div>
          </figure>
        </div>

        <div
          ref={sidebarRef}
          className={`fixed left-0 top-0 z-30 h-full w-auto transform bg-beer-gold pr-10 transition-transform duration-300 ease-in-out sm:hidden ${
            openHamburguer
              ? "bg-darkGold translate-x-0"
              : "-translate-x-full bg-beer-gold"
          }`}
        >
          <ul className="space-y-2 pl-4 pt-16">
            <li className="flex items-center justify-center space-x-4">
              {/* Language  */}
              {i18n.locales.map((locale) => {
                return (
                  <li key={locale}>
                    <Link href={redirectedPathName(locale)}>{locale}</Link>
                  </li>
                );
              })}

              {user && (
                <>
                  {/* Notification popup  */}

                  <Button
                    class={
                      "border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent "
                    }
                    onClick={() => setOpenNotification(true)}
                    title={""}
                  >
                    <div className="relative rounded-full">
                      <Image
                        alt={"Notification bell"}
                        className={"rounded-full"}
                        width={0}
                        height={0}
                        style={{ width: "45px", height: "45px" }}
                        src={"/icons/notification-icon.svg"}
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
                      "border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent"
                    }
                    onClick={() => openCart()}
                    title={"Cart Items"}
                  >
                    <div className="relative rounded-full">
                      <Image
                        alt={"Go to Shopping cart"}
                        className={"rounded-full"}
                        width={0}
                        height={0}
                        style={{ width: "45px", height: "45px" }}
                        src={"/icons/shopping-cart.svg"}
                        loader={() => "/icons/shopping-cart.svg"}
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
              {t("menu").toUpperCase()}
            </li>

            {/* Marketplace link  */}
            <li className="flex items-center">
              <Link
                href="/marketplace"
                onClick={() => setOpenNotification(false)}
                locale={locale}
              >
                <span className={`${MENU_ITEM_STYLES}`}>
                  {t("marketplace").toUpperCase()}
                </span>
              </Link>
            </li>

            {/* Events link  */}
            <li className="flex items-center">
              <Link
                href="/community"
                onClick={() => setOpenNotification(false)}
                locale={locale}
              >
                <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                  {t("community").toUpperCase()}
                </span>
              </Link>
            </li>

            {user && (
              <>
                <li className="flex items-center">
                  <Link
                    href="/events"
                    onClick={() => setOpenNotification(false)}
                    locale={locale}
                  >
                    <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                      {t("events").toUpperCase()}
                    </span>
                  </Link>
                </li>
              </>
            )}

            <li className={`${MENU_HEADER_STYLES}`}>
              {user ? (
                t("my_account").toUpperCase()
              ) : (
                <div>
                  <Button onClick={() => handleSignIn()} title={""} class={""}>
                    <Image
                      alt={"Login"}
                      width={0}
                      height={0}
                      style={{ width: "25px", height: "25px" }}
                      src={"/icons/user-profile.svg"}
                    />
                  </Button>
                </div>
              )}
            </li>

            {role === "consumer" ||
              (role === "producer" && (
                <>
                  <li className="flex items-center">
                    <Link
                      href="/profile?a=account"
                      onClick={() => setOpenNotification(false)}
                      locale={locale}
                    >
                      <span
                        className={`${MENU_ITEM_STYLES}`}
                        aria-current="page"
                      >
                        {t("profile").toUpperCase()}
                      </span>
                    </Link>
                  </li>

                  <li className="flex items-center">
                    <Link
                      href="/profile?a=orders"
                      onClick={() => setOpenNotification(false)}
                      locale={locale}
                    >
                      <span
                        className={`${MENU_ITEM_STYLES}`}
                        aria-current="page"
                      >
                        {t("orders").toUpperCase()}
                      </span>
                    </Link>
                  </li>
                </>
              ))}

            {role === "admin" && (
              <>
                <li className="flex items-center">
                  <Link
                    href="/profile?a=submitted_aps"
                    onClick={() => setOpenNotification(false)}
                    locale={locale}
                  >
                    <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                      {t("submitted_aps").toUpperCase()}
                    </span>
                  </Link>
                </li>

                <li className="flex items-center">
                  <Link
                    href="/profile?a=monthly_products"
                    onClick={() => setOpenNotification(false)}
                    locale={locale}
                  >
                    <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                      {t("monthly_products").toUpperCase()}
                    </span>
                  </Link>
                </li>

                <li className="flex items-center">
                  <Link
                    href="/profile?a=notifications"
                    onClick={() => setOpenNotification(false)}
                    locale={locale}
                  >
                    <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                      {t("notifications").toUpperCase()}
                    </span>
                  </Link>
                </li>
              </>
            )}

            <li className="flex items-center">
              <Link
                href="/profile"
                onClick={() => setOpenNotification(false)}
                locale={locale}
              >
                <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                  {t("profile").toUpperCase()}
                </span>
              </Link>
            </li>

            {!user ? (
              <li className="flex items-center">
                <Button
                  class={`${MENU_ITEM_STYLES} bg-beer-softBlonde text-beer-dark`}
                  onClick={handleSignIn}
                >
                  {t("sign_in").toUpperCase()}
                </Button>
              </li>
            ) : (
              <li className="flex items-center">
                <Button
                  class={`${MENU_ITEM_STYLES} bg-beer-red text-white transition-all duration-200`}
                  onClick={handleSignOut}
                >
                  {t("signout").toUpperCase()}
                </Button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
