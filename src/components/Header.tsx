import Link from "next/link";
import Image from "next/image";
import i18n from "../lib/translations/i18n";
import { useTranslation } from "react-i18next";
import { Select } from "@supabase/ui";
import { useRouter } from "next/router";
import { useShoppingCart } from "./Context/ShoppingCartContext";
import { useAuth } from "./Auth/useAuth";
import { Button, HeaderDropdownButton } from "./common";

export function Header() {
  const { t } = useTranslation();

  const { loggedIn, signOut, role } = useAuth();

  const router = useRouter();

  const { cartQuantity, openCart } = useShoppingCart();

  const onChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleSignIn = () => {
    router.push("/signin");
  };

  const handleBeerMe = () => {
    router.push("/beer-me");
  };

  return (
    <div className="header absolute w-full bg-beer-foam z-40 sm:z-10 bg-transparent">
      <nav className="border-gray-200 sm:px-4 pb-2.5 rounded dark:bg-gray-900">
        <div className="container grid grid-cols-3 sm:gap-2 sm:flex sm:justify-between sm:items-center sm:mx-auto bg-beer-darkGold sm:bg-transparent">
          {/* Left elements  */}
          <div className="w-full flex justify-center items-center ">
            {/* Hamburguer menu  */}
            <button
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
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
            </button>

            <ul className="hidden md:flex flex-col align-center p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li className="flex items-center">
                <Link href="/marketplace">
                  <span className="block py-2 pr-4 pl-3 text-sm lg:text-lg text-beer-dark rounded md:bg-transparent md:p-0 dark:text-white font-semibold hover:text-beer-draft">
                    {t("marketplace").toUpperCase()}
                  </span>
                </Link>
              </li>

              <li className="flex items-center">
                <Link href="/community">
                  <span
                    className="block py-2 pr-4 pl-3 text-sm lg:text-lg text-beer-dark rounded md:bg-transparent md:p-0 dark:text-white font-semibold hover:text-beer-draft"
                    aria-current="page"
                  >
                    {t("community").toUpperCase()}
                  </span>
                </Link>
              </li>

              <li className="flex items-center">
                <Link href="/events">
                  <span
                    className="block py-2 pr-4 pl-3 text-sm lg:text-lg text-beer-dark rounded md:bg-transparent md:p-0 dark:text-white font-semibold hover:text-beer-draft"
                    aria-current="page"
                  >
                    {t("events").toUpperCase()}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Logo Cervezanas  */}
          <div className="w-full " id="navbar-default">
            <div className="relative h-16 w-full md:h-20 lg:h-24 flex-shrink-0 z-50 flex justify-center">
              <div className="relative h-[100px] sm:h-[163px] w-[110px] sm:w-[181px] p-2 sm:p-2 bg-beer-gold flex justify-center ">
                <Link href={"/"}>
                  <Image
                    src="/logo_cervezanas.svg"
                    alt="Cervezanas Logo"
                    width={200}
                    height={200}
                    style={{ objectFit: "contain" }}
                    priority={true}
                    sizes="100px"
                  />
                </Link>
                <div className="w-full pt-[22px] h-[22px] absolute -bottom-5 bg-beer-darkGold"></div>
              </div>
            </div>
          </div>

          {/* Right elements  */}
          <div className="w-full">
            <ul className="hidden sm:flex sm:flex-col sm:justify-end sm:align-middle sm:p-4 sm:mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {/* Language  */}
              <li className="flex items-center max-w-[50px]">
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
                          "border-none hover:bg-transparent hover:scale-110 transition-all hover:cursor-pointer"
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
                          <div className="rounded-full bg-beer-blonde flex justify-center items-center white w-6 h-6 absolute bottom-0 right-0 translate-x-2 translate-y-2">
                            {cartQuantity}
                          </div>
                        </div>
                      </Button>
                    </li>
                  )}

                  <li className="flex items-center">
                    <HeaderDropdownButton
                      options={
                        role === "admin"
                          ? ["submitted_aps"]
                          : ["profile", "orders", "signout"]
                      }
                    />
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center">
                    <Button
                      onClick={() => handleSignIn()}
                      title={""}
                      class={""}
                    >
                      {t("login")}
                    </Button>
                  </li>
                </>
              )}
            </ul>

            <Button onClick={() => handleBeerMe()} title={""}>
              <div className="absolute right-0 bg-beer-dark flex justify-start items-center sm:px-2 sm:py-1 sm:rounded-l space-x-4">
                <Image
                  src={"/icons/beerme.svg"}
                  width={45}
                  height={45}
                  alt={"Find Cervezanas spots"}
                  className={"rounded-full"}
                />

                <div className="flex flex-col ">
                  <div className="text-beer-foam text-right ">Puntos</div>
                  <div className="text-beer-foam text-right ">Cervezanas</div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
