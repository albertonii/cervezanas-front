import { Button } from "@supabase/ui";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CheckoutItem from "../../components/checkout/CheckoutItem";
import { useShoppingCart } from "../../components/Context/ShoppingCartContext";
import { Spinner } from "../../components/common/Spinner";
import { Beer } from "../../lib/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { supabase } from "../../utils/supabaseClient";
import Layout from "../../components/Layout";
import Image from "next/image";

export default function Checkout() {
  const { t } = useTranslation();

  const [subTotal, setSubTotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(
    subTotal - discount + shipping + tax
  );

  const {
    items,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();

  const handleIncreaseCartQuantity = (beerId: string) => {
    increaseCartQuantity(beerId);
  };

  const handleDecreaseCartQuantity = (beerId: string) => {
    decreaseCartQuantity(beerId);
  };

  const handleRemoveFromCart = (beerId: string) => {
    removeFromCart(beerId);
  };

  const [cart, setCart] = useState<Beer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const ac = new AbortController();

    const getBeerItem = async (beerId: string) => {
      const { error, data: beer } = await supabase
        .from("beers")
        .select(
          `*,
          product_inventory (
            quantity
          ),
          product_multimedia (
            p_principal
          )`
        )
        .abortSignal(ac.signal)
        .eq("id", beerId)
        .single();

      if (error) throw error;

      return beer;
    };

    items.map(async (item) => {
      const beer = await getBeerItem(item.id);
      setCart((cart) => [...cart, beer]);
      setSubTotal((subTotal) => subTotal + beer.price * item.quantity);
    });

    setTotal(() => subTotal - discount + shipping);

    setLoading(false);

    return () => {
      setCart([]);
      setLoading(false);
      ac.abort();
      setSubTotal(0);
      setShipping(0);
      setTax(0);
      setDiscount(0);
      setTotal(0);
    };
  }, [discount, shipping]);

  return (
    <Layout usePadding={true} useBackdrop={false}>
      <div className="flex flex-row items-center justify-center">
        <div className="container my-12 mx-6 ">
          <div className=" justify-center">
            {loading ? (
              <Spinner />
            ) : (
              <div className="container px-4 py-6">
                <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                  <div className="flex justify-start item-start space-y-2 flex-col">
                    <div className="text-2xl">{t("checkout")}</div>

                    <div className="flex flex-row items-center border-b sm:border-b-0 w-full sm:w-auto pb-4 sm:pb-0">
                      <div className="text-yellow-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 sm:w-5 h-6 sm:h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>

                      <div className="text-sm tracking-wide text-gray-500 mt-4 sm:mt-0 sm:ml-4">
                        Complete your shipping and payment details below.
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                      <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                        <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                          Customer’s Cart
                        </p>
                        {cart.length > 0 &&
                          cart.map((beer) => {
                            return (
                              <CheckoutItem
                                key={beer.id}
                                beer={beer}
                                handleIncreaseCartQuantity={
                                  handleIncreaseCartQuantity
                                }
                                handleDecreaseCartQuantity={
                                  handleDecreaseCartQuantity
                                }
                                handleRemoveFromCart={handleRemoveFromCart}
                                quantity={getItemQuantity(beer.id)}
                              />
                            );
                          })}
                      </div>

                      {/* Shipping */}
                      <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                        <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                            {t("shipping")}
                          </h3>

                          <form id="payment-form" method="POST" action="">
                            <section>
                              <h2 className="uppercase tracking-wide text-lg font-semibold text-gray-700 my-2">
                                Shipping & Billing Information
                              </h2>
                              <fieldset className="mb-3 bg-white shadow-lg rounded text-gray-600">
                                <label className="flex border-b border-gray-200 h-12 py-3 items-center">
                                  <span className="text-right px-2">Name</span>
                                  <input
                                    name="name"
                                    className="focus:outline-none px-3 w-full mr-6"
                                    placeholder="Try Odinsson"
                                    required
                                  />
                                </label>
                                <label className="flex border-b border-gray-200 h-12 py-3 items-center">
                                  <span className="text-right px-2">Email</span>
                                  <input
                                    name="email"
                                    type="email"
                                    className="focus:outline-none px-3 w-full mr-6"
                                    placeholder="try@example.com"
                                    required
                                  />
                                </label>
                                <label className="flex border-b border-gray-200 h-12 py-3 items-center">
                                  <span className="text-right px-2">
                                    Address
                                  </span>
                                  <input
                                    name="address"
                                    className="focus:outline-none px-3 w-full mr-6"
                                    placeholder="10 Street XYZ 654"
                                  />
                                </label>
                                <label className="flex border-b border-gray-200 h-12 py-3 items-center">
                                  <span className="text-right px-2">City</span>
                                  <input
                                    name="city"
                                    className="focus:outline-none px-3 w-full mr-6"
                                    placeholder="San Francisco"
                                  />
                                </label>

                                <div className="w - full">
                                  <label className="inline-flex w-2/4 border-gray-200 py-3">
                                    <span className="text-right px-2">
                                      State
                                    </span>
                                    <input
                                      name="state"
                                      className="focus:outline-none px-3 w-full mr-6"
                                      placeholder="CA"
                                    />
                                  </label>
                                  <label className="xl:w-1/4 xl:inline-flex py-3 items-center flex xl:border-none border-t border-gray-200">
                                    <span className="text-right px-2 xl:px-0 xl:text-none">
                                      ZIP
                                    </span>
                                    <input
                                      name="postal_code"
                                      className="focus:outline-none px-3 w-full mx-6"
                                      placeholder="98603"
                                    />
                                  </label>
                                </div>

                                <label className="flex border-t border-gray-200 h-12 py-3 items-center select relative">
                                  <span className="text-right px-2">
                                    Country
                                  </span>
                                  <div
                                    id="country"
                                    className="focus:outline-none px-3 w-full flex items-center"
                                  >
                                    <select
                                      name="country"
                                      className="border-none bg-transparent flex-1 cursor-pointer appearance-none focus:outline-none w-full mr-6"
                                    >
                                      <option value="AU">Australia</option>
                                      <option value="BE">Belgium</option>
                                      <option value="BR">Brazil</option>
                                      <option value="CA">Canada</option>
                                      <option value="CN">China</option>
                                      <option value="DK">Denmark</option>
                                      <option value="FI">Finland</option>
                                      <option value="FR">France</option>
                                      <option value="DE">Germany</option>
                                      <option value="HK">Hong Kong</option>
                                      <option value="IE">Ireland</option>
                                      <option value="IT">Italy</option>
                                      <option value="JP">Japan</option>
                                      <option value="LU">Luxembourg</option>
                                      <option value="MX">Mexico</option>
                                      <option value="NL">Netherlands</option>
                                      <option value="PL">Poland</option>
                                      <option value="PT">Portugal</option>
                                      <option value="SG">Singapore</option>
                                      <option value="ES">Spain</option>
                                      <option value="TN">Tunisia</option>
                                      <option value="GB">United Kingdom</option>
                                      <option value="US" selected>
                                        United States
                                      </option>
                                    </select>
                                  </div>
                                </label>
                              </fieldset>
                            </section>
                          </form>

                          <div className="flex justify-between items-start w-full">
                            <div className="flex justify-center items-center space-x-4">
                              <div className="w-8 h-8">
                                <Image
                                  width={32}
                                  height={32}
                                  className="w-full h-full"
                                  alt="logo"
                                  src="https://i.ibb.co/L8KSdNQ/image-3.png"
                                />
                              </div>
                              <div className="flex flex-col justify-start items-center">
                                <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800">
                                  DPD Delivery
                                  <br />
                                  <span className="font-normal">
                                    Delivery with 24 Hours
                                  </span>
                                </p>
                              </div>
                            </div>
                            <p className="text-lg font-semibold leading-6 dark:text-white text-gray-800">
                              $8.00
                            </p>
                          </div>
                          <div className="w-full flex justify-center items-center">
                            <button className="hover:bg-black dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">
                              View Carrier Details
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                        <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                            {t("payment")}
                          </h3>
                          <section>
                            <fieldset className="mb-3 bg-white shadow-lg rounded text-gray-600">
                              <label className="flex border-b border-gray-200 h-12 py-3 items-center">
                                <span className="text-right px-2">Card</span>
                                <input
                                  name="card"
                                  className="focus:outline-none px-3 w-full"
                                  placeholder="Card number MM/YY CVC"
                                  required
                                />
                              </label>
                            </fieldset>
                          </section>
                        </div>
                      </div>
                    </div>

                    {/* Order summary  */}
                    <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                      <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                        Customer
                      </h3>
                      <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                        <div className="flex flex-col justify-start items-start flex-shrink-0">
                          {/* Summary */}
                          <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                              <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                                {t("summary")}
                              </h3>

                              <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                <div className="flex justify-between w-full">
                                  <p className="text-base dark:text-white leading-4 text-gray-800">
                                    {t("subtotal")}
                                  </p>
                                  <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                    {formatCurrency(subTotal)}
                                  </p>
                                </div>
                                {/* discount */}
                                <div className="flex justify-between items-center w-full">
                                  <p className="text-base dark:text-white leading-4 text-gray-800">
                                    {t("discount")}
                                    <span className="bg-gray-200 p-1 text-xs font-medium dark:bg-white dark:text-gray-800 leading-3 text-gray-800">
                                      STUDENT
                                    </span>
                                  </p>
                                  <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                    {formatCurrency(discount)}{" "}
                                    {discount / subTotal}%
                                  </p>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                  <p className="text-base dark:text-white leading-4 text-gray-800">
                                    {t("shipping")}
                                  </p>
                                  <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                    {formatCurrency(shipping)}
                                  </p>
                                </div>

                                {/* taxes  */}
                                <div className="flex justify-between items-center w-full">
                                  <p className="text-base dark:text-white leading-4 text-gray-800">
                                    {t("tax")}
                                  </p>
                                  <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                    {formatCurrency(tax)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex justify-between items-center w-full">
                                <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">
                                  {t("total")}
                                </p>
                                <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">
                                  {formatCurrency(total)}
                                </p>
                              </div>

                              {/* Proceed to pay */}
                              <div className="flex justify-center items-center w-full">
                                <Button
                                  onClick={() => {
                                    items.map((item) => {
                                      removeFromCart(item.id);
                                    });
                                  }}
                                  size="large"
                                  className="bg-gray-800 dark:bg-white dark:text-gray-800 text-white font-semibold text-sm px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                  {t("proceed_to_pay")}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                          <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                            <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                                Shipping Address
                              </p>
                              <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                                180 North King Street, Northhampton MA 1060
                              </p>
                            </div>
                            <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                                Billing Address
                              </p>
                              <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                                180 North King Street, Northhampton MA 1060
                              </p>
                            </div>
                          </div>
                          <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                            <button className="mt-6 md:mt-0 dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium w-96 2xl:w-full text-base font-medium leading-4 text-gray-800">
                              Edit Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
