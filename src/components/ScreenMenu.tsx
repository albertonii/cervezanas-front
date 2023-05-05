import React from "react";
import Link from "next/link";
import Image from "next/image";
import i18n from "../lib/translations/i18n";
import { useTranslation } from "react-i18next";
import { Select } from "@supabase/ui";
import { useRouter } from "next/router";
import { useShoppingCart } from "./Context/ShoppingCartContext";
import { useAuth } from "./Auth/useAuth";
import { Button, HeaderDropdownButton } from "./common";
import { Notification } from "./Notification";
import { useAppContext } from "./Context";

export function ScreenMenu() {
  const { t } = useTranslation();

  const { loggedIn, role } = useAuth();

  const router = useRouter();

  const { cartQuantity, openCart } = useShoppingCart();
  const { notifications, openNotification, setOpenNotification } =
    useAppContext();

  const onChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleSignIn = () => {
    router.push(`/signin`);
  };

  const handleBeerMe = () => {
    router.push(`/beer-me`);
  };

  const MENU_ITEM_STYLES =
    "block rounded py-2 pr-4 pl-3 text-sm font-semibold text-beer-dark hover:text-beer-draft dark:text-white md:bg-transparent md:p-0 lg:text-lg";

  const handleClickBell = () => {
    setOpenNotification(true);
  };

  return (
    <nav className="rounded border-gray-200 dark:bg-gray-900 sm:px-4">
      <div className="container grid grid-cols-3 bg-beer-darkGold sm:mx-auto sm:flex sm:justify-between sm:gap-2 sm:bg-transparent">
        {/* Left elements  */}
        <div className="flex w-full items-center justify-center ">
          <ul className="align-center mt-4 hidden p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium md:dark:bg-gray-900">
            <li className="flex items-center">
              <Link href="/marketplace">
                <span className={`${MENU_ITEM_STYLES}`}>
                  {t("marketplace").toUpperCase()}
                </span>
              </Link>
            </li>

            <li className="flex items-center">
              <Link href="/community">
                <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                  {t("community").toUpperCase()}
                </span>
              </Link>
            </li>

            <li className="flex items-center">
              <Link href="/events">
                <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                  {t("events").toUpperCase()}
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Logo Cervezanas  */}
        <div className="w-full" id="navbar-default">
          <div className="relative flex h-16 w-full flex-shrink-0 justify-center md:h-20 lg:h-24">
            <div className="relative flex h-[100px] w-[110px] justify-center bg-beer-gold p-2 sm:h-[143px] sm:w-[141px] sm:p-2 lg:h-[153] lg:w-[151px] ">
              <Link href={"/"}>
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
              <div className="absolute -bottom-5 h-[22px] w-full bg-beer-darkGold pt-[22px]"></div>
            </div>
          </div>
        </div>

        {/* Right elements  */}
        <div className="w-full">
          <ul className="hidden dark:border-gray-700 dark:bg-gray-800 sm:mt-4 sm:flex sm:flex-row sm:justify-end sm:p-4 sm:align-middle md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium md:dark:bg-gray-900">
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

            {loggedIn ? (
              <>
                {/* Cart  */}
                {role !== "admin" && (
                  <li className="flex items-center">
                    <Button
                      class={
                        "border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent"
                      }
                      onClick={() => openCart()}
                      title={""}
                    >
                      <div className="relative rounded-full">
                        <Image
                          src={"/icons/shopping-cart.svg"}
                          width={45}
                          height={45}
                          alt={"Go to Shopping cart"}
                          className={"rounded-full"}
                        />
                        <div className="white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde">
                          {cartQuantity}
                        </div>
                      </div>
                    </Button>
                  </li>
                )}

                {/* Notifications  */}
                <li className="relative flex items-center">
                  <Button
                    class={
                      "border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent"
                    }
                    onClick={() => handleClickBell()}
                    title={""}
                  >
                    <div className="relative rounded-full">
                      <Image
                        src={"/icons/notification-icon.svg"}
                        width={45}
                        height={45}
                        alt={"Go to Shopping cart"}
                        className={"rounded-full"}
                      />
                      <div className="white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde">
                        {notifications?.length ?? 0}
                      </div>
                    </div>
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
                        : ["profile", "orders", "signout"]
                    }
                  />
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center">
                  <Button onClick={() => handleSignIn()} title={""} class={""}>
                    {t("login")}
                  </Button>
                </li>
              </>
            )}
          </ul>

          <Button onClick={() => handleBeerMe()} title={""}>
            <div className="absolute right-0 top-16  flex items-center justify-start space-x-4 bg-beer-dark sm:top-24 sm:rounded-l sm:px-2 sm:py-1">
              <Image
                src={"/icons/beerme.svg"}
                width={45}
                height={45}
                alt={"Find Cervezanas spots"}
                className={"rounded-full"}
              />

              <div className="flex flex-col ">
                <div className="text-right text-beer-foam ">Puntos</div>
                <div className="text-right text-beer-foam ">Cervezanas</div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </nav>
  );
}
