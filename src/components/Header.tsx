import Link from "next/link";
import Image from "next/image";
import { Select } from "@supabase/ui";
import i18n from "../lib/i18n/i18n";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useShoppingCart } from "./Context/ShoppingCartContext";
import { NextApiRequest } from "next";
import { useAuth } from "./Auth/useAuth";
import DropdownButton from "./common/DropdownButton";
import Button from "./common/Button";

interface Props {}

export default function Header({}: Props) {
  const { t } = useTranslation();

  const { loggedIn, signOut } = useAuth();

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
    // router.push("/signin");
  };

  return (
    <div className="header ">
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
        <div className="container flex lg:flex-wrap justify-between items-center mx-auto">
          {/* <Link href={{ pathname: "/" }} className="flex items-center"> */}
          <div className="relative h-16 w-20 md:h-20 md:w-26 lg:h-24 lg:w-32 flex-shrink-0 lg:my-2">
            <Image
              src="/logo_cervezanas.svg"
              alt="Cervezanas Logo"
              fill
              style={{ objectFit: "contain" }}
              priority={true}
            />
          </div>
          {/* </Link> */}

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

          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="flex flex-col align-center p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {loggedIn ? (
                <>
                  <li>
                    <Link href="/">
                      <span
                        className="block py-2 pr-4 pl-3 text-sm lg:text-lg text-beer-dark rounded md:bg-transparent md:p-0 dark:text-white font-semibold hover:text-beer-draft"
                        aria-current="page"
                      >
                        {t("home")}
                      </span>
                    </Link>
                  </li>

                  <li>
                    <Link href="/marketplace">
                      <span className="block py-2 pr-4 pl-3 text-sm lg:text-lg text-beer-dark rounded md:bg-transparent md:p-0 dark:text-white font-semibold hover:text-beer-draft">
                        {t("marketplace")}
                      </span>
                    </Link>
                  </li>

                  <li>
                    <Select
                      name="language"
                      style={{ backgroundColor: "transparent" }}
                      onChange={onChangeLanguage}
                      className="text-sm lg:text-lg focus:outline-none focus:ring-2 focus:ring-beer-blonde focus:ring-offset-2"
                    >
                      <Select.Option value="es">
                        🇪🇸 {t("spanish")}
                      </Select.Option>
                      <Select.Option value="en">
                        🇬🇧 {t("english")}
                      </Select.Option>
                    </Select>
                  </li>

                  <li>
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

                  <li>
                    <DropdownButton
                      options={["profile", "orders", "logout"]}
                    ></DropdownButton>
                  </li>

                  <li>
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
                  <li>
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
