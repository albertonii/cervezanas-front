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
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import { i18n } from "../../lib/translations/i18n";
import { INotification } from "../../lib/types";
import { DeviceScreenNotification } from "./components/DeviceScreenNotification";
import PuntoCervezanasFlag from "./PuntoCervezanasFlag";

interface Props {
  notifications: INotification[];
}

export default function ScreenMenu({ notifications: notifications }: Props) {
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

  const onChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const redirectedPathName = (locale: string) => {
      if (!pathName) return "/";
      const segments = pathName.split("/");
      segments[1] = locale;
      return segments.join("/");
    };

    const language = event.target.value;

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

  return (
    <section className="rounded border-gray-200 dark:bg-gray-900 sm:block sm:px-4">
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
                        width={25}
                        height={25}
                        alt={"Login"}
                        src={COMMON.PROFILE_IMG}
                        loader={() => COMMON.PROFILE_IMG}
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
                          alt={"Go to Shopping cart"}
                          className={"rounded-full"}
                          width={0}
                          height={0}
                          style={{ width: "45px", height: "45px" }}
                          src={"/icons/shopping-cart.svg"}
                          loader={() => "/icons/shopping-cart.svg"}
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
                <DeviceScreenNotification notifications={notifications} />

                <li className="flex items-center">
                  <HeaderDropdownButton
                    options={
                      role === "admin"
                        ? ["submitted_aps", "monthly_products", "notifications", "signout"]
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

          <PuntoCervezanasFlag />
        </section>
      </nav>
    </section>
  );
}
