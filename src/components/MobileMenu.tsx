import Link from "next/link";
import Image from "next/image";
import i18n from "../lib/translations/i18n";
import useOnClickOutside from "../hooks/useOnOutsideClickDOM";
import { useTranslation } from "react-i18next";
import { Select } from "@supabase/ui";
import { useRouter } from "next/router";
import { useShoppingCart } from "./Context/ShoppingCartContext";
import { useAuth } from "./Auth/useAuth";
import { Button } from "./common";
import { Notification } from "./Notification";
import { useRef, useState } from "react";
import { useAppContext } from "./Context";
import { ROUTE_SIGNIN } from "../config";

export function MobileMenu() {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { notifications, openNotification, setOpenNotification } =
    useAppContext();
  const { cartQuantity, openCart } = useShoppingCart();
  useOnClickOutside(sidebarRef, () => handleClickOutsideCallback());
  const { loggedIn, role } = useAuth();

  const { t } = useTranslation();

  const [openHamburguer, setOpenHamburger] = useState(false);
  const router = useRouter();

  const handleClickOutsideCallback = () => {
    setOpenHamburger(false);
  };

  const onChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleSignIn = () => {
    router.push(ROUTE_SIGNIN);
    setOpenNotification(false);
  };

  // TODO: Cerrar sesión BIEN
  const handleSignOut = () => {
    router.push(`/signout`);
    setOpenNotification(false);
  };

  const MENU_ITEM_STYLES =
    "block rounded py-2 pr-4 pl-3 text-md font-semibold text-beer-dark hover:text-beer-draft dark:text-white md:bg-transparent md:p-0 lg:text-lg";

  const MENU_HEADER_STYLES =
    "text-lg font-bold text-beer-dark uppercase py-4 border-b-2 border-beer-softBlonde mr-4";

  if (!loggedIn) return <></>;

  return (
    <>
      {/* Hamburguer menu  */}
      <Button
        data-collapse-toggle="navbar-default"
        class="absolute top-[50%] ml-3 inline-flex -translate-y-1/2 items-center rounded-lg border-beer-softBlonde p-2 text-sm text-beer-softBlonde transition-all duration-300 hover:border-beer-draft hover:text-beer-draft focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden md:hidden"
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

      <nav
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-30 h-full w-3/4 transform bg-beer-gold transition-transform duration-300 ease-in-out sm:hidden ${
          openHamburguer
            ? "bg-darkGold translate-x-0"
            : "-translate-x-full bg-beer-gold"
        }`}
      >
        <ul className="space-y-2 pt-16 pl-4">
          <li className="flex items-center justify-center space-x-4">
            {/* Language  */}
            <Select
              size="tiny"
              name="language"
              style={{
                backgroundColor: "transparent",
              }}
              onChange={onChangeLanguage}
              className=""
            >
              <Select.Option value="es">🇪🇸</Select.Option>
              <Select.Option value="en">🇬🇧</Select.Option>
            </Select>

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
                  src={"/icons/notification-icon.svg"}
                  width={45}
                  height={45}
                  alt={"Go to Shopping cart"}
                  className={"rounded-full"}
                />
                <div className="white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde">
                  {notifications?.length || 0}
                </div>
              </div>
            </Button>

            <Notification
              open={openNotification}
              setOpen={setOpenNotification}
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

          <li className={`${MENU_HEADER_STYLES}`}>{t("menu").toUpperCase()}</li>

          <li className="flex items-center">
            <Link
              href="/marketplace"
              onClick={() => setOpenNotification(false)}
            >
              <span className={`${MENU_ITEM_STYLES}`}>
                {t("marketplace").toUpperCase()}
              </span>
            </Link>
          </li>

          <li className="flex items-center">
            <Link href="/community" onClick={() => setOpenNotification(false)}>
              <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                {t("community").toUpperCase()}
              </span>
            </Link>
          </li>

          <li className="flex items-center">
            <Link href="/events" onClick={() => setOpenNotification(false)}>
              <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                {t("events").toUpperCase()}
              </span>
            </Link>
          </li>

          <li className={`${MENU_HEADER_STYLES}`}>
            {loggedIn
              ? t("my_account").toUpperCase()
              : t("login").toUpperCase()}
          </li>

          {role === "consumer" ||
            (role === "producer" && (
              <>
                <li className="flex items-center">
                  <Link
                    href="/profile?a=account"
                    onClick={() => setOpenNotification(false)}
                  >
                    <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                      {t("profile").toUpperCase()}
                    </span>
                  </Link>
                </li>

                <li className="flex items-center">
                  <Link
                    href="/profile?a=orders"
                    onClick={() => setOpenNotification(false)}
                  >
                    <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
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
                >
                  <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                    {t("monthly_products").toUpperCase()}
                  </span>
                </Link>
              </li>
            </>
          )}

          <li className="flex items-center">
            <Link href="/profile" onClick={() => setOpenNotification(false)}>
              <span className={`${MENU_ITEM_STYLES}`} aria-current="page">
                {t("profile").toUpperCase()}
              </span>
            </Link>
          </li>

          {loggedIn ? (
            <li className="flex items-center">
              <Button
                class={`${MENU_ITEM_STYLES} bg-beer-red text-white transition-all duration-200`}
                onClick={handleSignOut}
              >
                {t("signout").toUpperCase()}
              </Button>
            </li>
          ) : (
            <li className="flex items-center">
              <Button
                class={`${MENU_ITEM_STYLES} bg-beer-softBlonde text-beer-dark`}
                onClick={handleSignIn}
              >
                {t("sign_in").toUpperCase()}
              </Button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
