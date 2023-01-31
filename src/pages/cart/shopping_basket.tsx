import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CheckoutItem from "../../components/checkout/CheckoutItem";
import { useShoppingCart } from "../../components/Context/ShoppingCartContext";
import { Spinner } from "../../components/common/Spinner";
import { Beer } from "../../lib/types";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  faCartShopping,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import Layout from "../../components/Layout";
import Image from "next/image";
import Button from "../../components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Checkout() {
  const { t } = useTranslation();

  const [subtotal, setsubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(
    subtotal - discount + shipping + tax
  );

  const {
    items,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeMarketplaceItems,
    removeFromCart,
    marketplaceItems,
    addMarketplaceItems,
  } = useShoppingCart();

  const handleIncreaseCartQuantity = (beerId: string) => {
    increaseCartQuantity(beerId);
    if (marketplaceItems.find((item) => item.id === beerId)) return;
    const beer: Beer | undefined = marketplaceItems.find(
      (item) => item.id === beerId
    );
    if (!beer) return;
    addMarketplaceItems(beer);
  };

  const handleDecreaseCartQuantity = (beerId: string) => {
    decreaseCartQuantity(beerId);
    if (getItemQuantity(beerId) > 1) return;
    removeMarketplaceItems(beerId);
  };

  const handleRemoveFromCart = (beerId: string) => {
    removeMarketplaceItems(beerId);
    removeFromCart(beerId);
  };

  const [cart, setCart] = useState<Beer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const ac = new AbortController();

    // const getBeerItem = async (beerId: string) => {
    //   const { error, data: beer } = await supabase
    //     .from("beers")
    //     .select(
    //       `*,
    //       product_inventory (
    //         quantity
    //       ),
    //       product_multimedia (
    //         p_principal
    //       )`
    //     )
    //     .abortSignal(ac.signal)
    //     .eq("id", beerId)
    //     .single();

    //   if (error) throw error;

    //   return beer;
    // };

    items.map(async (item) => {
      // const beer = await getBeerItem(item.id);
      const beer = marketplaceItems.find((m_item) => m_item.id === item.id);
      if (!beer) return;

      setCart((cart) => [...cart, beer]);

      setsubtotal((subtotal) => subtotal + beer.price * item.quantity);
    });

    setTotal(() => subtotal - discount + shipping);

    setLoading(false);

    return () => {
      setCart([]);
      setLoading(false);
      ac.abort();
      setsubtotal(0);
      setShipping(0);
      setTax(0);
      setDiscount(0);
      setTotal(0);
    };
  }, [discount, items, marketplaceItems, shipping, subtotal]);

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
                        {t("complete_shipping_billing")}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8 ">
                      {/* Customer's Car */}
                      <div className="border border-beer-softBlonde flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                        <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                          {t("customer_s_cart")}
                        </p>
                        {cart.length > 0 ? (
                          <>
                            {cart.map((beer) => {
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

                            {/* Subtotal */}
                            <div className="flex flex-row justify-between items-center w-full mt-4">
                              <div className="flex flex-col justify-start items-start space-y-2">
                                <div className="text-2xl text-gray-500">
                                  {t("subtotal")}

                                  <span className="ml-6 text-gray-800 font-semibold">
                                    {formatCurrency(subtotal)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Empty Cart */}
                            <div className="container mt-6">
                              {/* Cart Empty Icon */}
                              <div className="flex flex-row justify-center items-center">
                                <div className="flex flex-col justify-between items-start w-1/2 mt-4">
                                  <h2 className="text-2xl text-gray-500">
                                    {t("your_empty_cart")}
                                  </h2>

                                  <div className="flex flex-col justify-start items-start space-y-2">
                                    <div className="text-xl text-gray-500">
                                      {t("add_products_to_continue")}
                                    </div>
                                  </div>
                                </div>

                                <FontAwesomeIcon
                                  icon={faShoppingCart}
                                  style={{ color: "#432a14" }}
                                  title={"empty_cart"}
                                  width={120}
                                  height={120}
                                />
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-40 h-40 text-beer-blonde"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                                    clipRule="evenodd"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    d="M10 6a1 1 0 00-1 1v4a1 1 0 002 0V7a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    d="M10 12a1 1 0 100 2 1 1 0 000-2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Shipping */}
                      <div className="border border-beer-softBlonde flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                        <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                            {t("shipping_and_billing_info")}
                          </h3>

                          <form id="payment-form" method="POST" action="">
                            {/* Shipping information */}
                            <section>
                              <fieldset className="mb-3 bg-beer-foam rounded">
                                {/* Shipping Data */}
                                <div className="w-full">
                                  <h2 className="tracking-wide text-lg font-semibold text-gray-700 my-2">
                                    {t("shipping_data")}
                                  </h2>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="name"
                                      className="focus:outline-none px-3 w-full mr-6"
                                      placeholder={`${t("name")}*`}
                                      required
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="lastname"
                                      className="focus:outline-none px-3 w-full mr-6"
                                      placeholder={`${t("lastname")}*`}
                                      required
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="documentId"
                                      className="focus:outline-none px-3 w-full mr-6"
                                      placeholder={`${t("document_id")}*`}
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="phones_number"
                                      className="focus:outline-none px-3 w-full mr-6"
                                      placeholder={`${t("loc_phone")}*`}
                                    />
                                  </label>
                                </div>

                                {/* Shipping Address */}
                                <div className="w-full">
                                  <h2 className="tracking-wide text-lg font-semibold text-gray-700 my-2">
                                    {t("shipping_address")}
                                  </h2>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="address_1"
                                      className="focus:outline-none px-3 w-full mr-6"
                                      placeholder={`${t("address")}*`}
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="country"
                                      className="focus:outline-none px-3 w-full mx-6"
                                      placeholder={`${t("country")}*`}
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="postal_code"
                                      className="focus:outline-none px-3 w-full mx-6"
                                      placeholder={`${t("loc_pc")}*`}
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="town"
                                      className="focus:outline-none px-3 w-full mx-6"
                                      placeholder={`${t("loc_town")}*`}
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="province"
                                      className="focus:outline-none px-3 w-full mx-6"
                                      placeholder={`${t("loc_province")}*`}
                                    />
                                  </label>
                                </div>

                                <div className="flex items-center">
                                  <input
                                    id="shipping-checked-checkbox"
                                    type="checkbox"
                                    value=""
                                    className="w-4 h-4 text-beer-blonde bg-beer-softBlonde border-bear-light rounded focus:ring-bear-alvine dark:focus:ring-beer-softBlonde dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  />
                                  <label
                                    htmlFor="shipping-checked-checkbox"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                  >
                                    {t("shipping_checkbox")}
                                  </label>
                                </div>
                              </fieldset>
                            </section>

                            {/* Billing Information */}
                            <section className="mt-6">
                              <fieldset className="mb-3 bg-beer-foam rounded">
                                {/* Billing Data */}
                                <div className="w-full">
                                  <h2 className="tracking-wide text-lg font-semibold text-gray-700 my-2">
                                    {t("billing_data")}
                                  </h2>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="name"
                                      className="focus:outline-none px-3 w-full mr-6"
                                      placeholder={`${t("name")}*`}
                                      required
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="lastname"
                                      className="focus:outline-none px-3 w-full mr-6"
                                      placeholder={`${t("lastname")}*`}
                                      required
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="documentId"
                                      className="focus:outline-none px-3 w-full mr-6"
                                      placeholder={`${t("document_id")}*`}
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="phones_number"
                                      className="focus:outline-none px-3 w-full mr-6"
                                      placeholder={`${t("loc_phone")}*`}
                                    />
                                  </label>
                                </div>

                                {/* Billing Address */}
                                <div className="w-full mt-6">
                                  <h2 className="tracking-wide text-lg font-semibold text-gray-700 my-2">
                                    {t("billing_address")}
                                  </h2>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="address_1"
                                      className="focus:outline-none px-3 w-full mr-6"
                                      placeholder={`${t("address")}*`}
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="country"
                                      className="focus:outline-none px-3 w-full mx-6"
                                      placeholder={`${t("country")}*`}
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="postal_code"
                                      className="focus:outline-none px-3 w-full mx-6"
                                      placeholder={`${t("loc_pc")}*`}
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="town"
                                      className="focus:outline-none px-3 w-full mx-6"
                                      placeholder={`${t("loc_town")}*`}
                                    />
                                  </label>

                                  <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                                    <input
                                      name="province"
                                      className="focus:outline-none px-3 w-full mx-6"
                                      placeholder={`${t("loc_province")}*`}
                                    />
                                  </label>
                                </div>

                                {/* Checkbox Billing */}
                                <div className="flex items-center">
                                  <input
                                    id="billing-checked-checkbox"
                                    type="checkbox"
                                    value=""
                                    className="w-4 h-4 text-beer-blonde bg-beer-softBlonde border-bear-light rounded focus:ring-bear-alvine dark:focus:ring-beer-softBlonde dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  />
                                  <label
                                    htmlFor="billing-checked-checkbox"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                  >
                                    {t("billing_checkbox")}
                                  </label>
                                </div>
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
                                    {t("delivery_24h")}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <p className="text-lg font-semibold leading-6 dark:text-white text-gray-800">
                              {formatCurrency(8)}
                            </p>
                          </div>
                          <div className="w-full flex justify-center items-center">
                            <Button
                              title={t("view_carrier_details")}
                              accent
                              medium
                              class="sm:w-full text-base font-medium "
                            >
                              {t("view_carrier_details")}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="border border-beer-softBlonde flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                        <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                            {t("payment")}
                          </h3>

                          <section>
                            <fieldset className="mb-3 bg-white rounded text-gray-600">
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
                    <div className="border border-beer-softBlonde bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                      <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                        {t("customer")}
                      </h3>

                      <div className="flex flex-col md:flex-col xl:flex-col justify-start items-stretch h-full w-full lg:space-x-8 xl:space-x-0">
                        {/* Summary */}
                        <div className="flex flex-col justify-start items-start flex-shrink-0">
                          <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                              {t("summary")}
                            </h3>

                            <div className="flex justify-center items-center w-full flex-col border-gray-200 border-b pb-4 space-y-6">
                              <div className="flex justify-between w-full">
                                <p className="text-base dark:text-white leading-4 text-gray-800">
                                  {t("subtotal")}
                                </p>
                                <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                  {formatCurrency(subtotal)}
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
                                  {discount / subtotal}%
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
                            <div className="flex justify-center items-center md:justify-start md:items-start w-full">
                              <Button
                                onClick={() => {
                                  items.map((item) => {
                                    removeFromCart(item.id);
                                  });
                                }}
                                large
                                primary
                                class="font-semibold"
                                title={""}
                                disabled={cart.length === 0}
                              >
                                {t("proceed_to_pay")}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Addresses */}
                        <div className="flex flex-col justify-start items-start flex-shrink-0 pb-4 mt-6 md:mt-0 space-y-6">
                          <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                              {t("addresses")}
                            </h3>

                            <div className="flex justify-center md:justify-start xl:flex-col flex-col lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-3 md:flex-col items-center md:items-start">
                              <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                                <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                                  {t("shipping_address")}
                                </p>

                                <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                                  180 North King Street, Northhampton MA 1060
                                </p>
                              </div>

                              <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                                <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                                  {t("billing_address")}
                                </p>
                                <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                                  180 North King Street, Northhampton MA 1060
                                </p>
                              </div>
                            </div>

                            <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                              <Button
                                xLarge
                                accent
                                class="font-semibold"
                                title={"Edit Details"}
                              >
                                {t("edit_details")}
                              </Button>
                            </div>
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
