import Link from "next/link";
import Image from "next/image";
import i18n from "../lib/translations/i18n";
import { useTranslation } from "react-i18next";
import { Select } from "@supabase/ui";
import { useRouter } from "next/router";
import { useShoppingCart } from "./Context/ShoppingCartContext";
import { NextApiRequest } from "next";
import { useAuth } from "./Auth/useAuth";
import { Button, DropdownButton } from "./common";

interface Props {}

export function Header({}: Props) {
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

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="header absolute w-full bg-beer-foam">
      <nav className="border-gray-200 px-2 sm:px-4 pb-2.5 rounded dark:bg-gray-900">
        <div className="container flex lg:flex-wrap justify-between items-center mx-auto">
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

          <div className="grid grid-cols-3 gap-4 w-full" id="navbar-default">
            {/* Left elements  */}
            <ul className="flex flex-col align-center p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
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

            {/* Logo Cervezanas  */}
            <div className="relative h-16 w-full md:h-20 lg:h-24 flex-shrink-0 z-50 flex justify-center">
              <div className="relative h-[173px] w-[221px] bg-beer-gold flex justify-center ">
                <Image
                  src="/logo_cervezanas.svg"
                  alt="Cervezanas Logo"
                  width={150}
                  height={100}
                  style={{ objectFit: "contain" }}
                  priority={true}
                  sizes="100px"
                />
                <div className="w-full pt-[22px] h-[22px] absolute -bottom-5 bg-beer-darkGold"></div>
              </div>
            </div>

            {/* Right elements  */}
            <ul className="flex flex-col justify-end align-middle p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {loggedIn ? (
                <>
                  {/* Cart  */}
                  {role !== "admin" && (
                    <li className="flex items-center">
                      <Button
                        class={
                          "border-none hover:bg-transparent hover:scale-110 transition-all"
                        }
                        onClick={() => openCart()}
                        title={""}
                      >
                        <div className="relative rounded-full">
                          <span className="logo block py-2 pr-4 pl-3 text-gray-700 rounded bg-transparent  hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                            <Image
                              src={"/icons/shopping-cart-240.png"}
                              width={30}
                              height={30}
                              alt={"Go to Shopping cart"}
                            />
                          </span>

                          <div className="rounded-full bg-beer-blonde flex justify-center items-center white w-6 h-6 absolute bottom-0 right-0 translate-x-2 translate-y-2">
                            {cartQuantity}
                          </div>
                        </div>
                      </Button>
                    </li>
                  )}

                  <li className="flex items-center">
                    <DropdownButton
                      options={
                        role === "admin"
                          ? ["submitted_aps"]
                          : ["profile", "orders", "signout"]
                      }
                    ></DropdownButton>
                  </li>

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

                  <li className="flex items-center">
                    <Button
                      onClick={() => handleSignOut()}
                      title={""}
                      class={
                        "border-none hover:bg-transparent hover:scale-110 transition-all"
                      }
                    >
                      <span className="logo block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                        <Image
                          src={"/icons/logout-240.png"}
                          width={30}
                          height={30}
                          alt={"Logout user"}
                        />
                      </span>
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  {/* Language  */}
                  <li className="flex items-center">
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
          </div>
        </div>
      </nav>
    </div>
  );
}

export async function getServerSideProps(req: NextApiRequest) {}
