import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CheckoutItem from "../../components/checkout/CheckoutItem";
import { useShoppingCart } from "../../components/Context/ShoppingCartContext";
import { Spinner } from "../../components/common/Spinner";
import { Beer } from "../../lib/types";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  faShoppingCart,
  faCircleExclamation,
  faInfoCircle,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Layout from "../../components/Layout";
import Image from "next/image";
import Button from "../../components/common/Button";
import NewShippingAddress from "../../components/checkout/NewShippingAddress";
import NewBillingAddress from "../../components/checkout/NewBillingAddress";
import CustomLoading from "../../components/checkout/CustomLoading";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../components/Auth/useAuth";
import { useForm } from "react-hook-form";
import {
  BillingAddress,
  PaymentCard,
  ShippingAddress,
} from "../../lib/interfaces";
import "@fortawesome/fontawesome-svg-core/styles.css";

interface FormShippingData {
  shipping_info_id: string;
}

interface FormBillingData {
  billing_info_id: string;
}

interface FormCardData {
  card_info: PaymentCard;
}

interface Props {
  shippingAddresses: ShippingAddress[];
  billingAddresses: BillingAddress[];
}

export default function Checkout(props: Props) {
  const { t } = useTranslation();

  const {
    shippingAddresses: shippingAddresses_,
    billingAddresses: billingAddresses_,
  } = props;

  const { user } = useAuth();
  const router = useRouter();

  const [subtotal, setsubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(
    subtotal - discount + shipping + tax
  );
  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);

  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>(
    shippingAddresses_ ?? []
  );

  const [billingAddresses, setBillingAddresses] = useState<BillingAddress[]>(
    billingAddresses_ ?? []
  );

  const {
    formState: { errors: shippingErrors },
    handleSubmit: handleShippingSubmit,
    register: registerShipping,
    reset: resetShipping,
    getValues: getShippingValues,
    trigger: triggerShipping,
  } = useForm<FormShippingData>();

  const {
    formState: { errors: billingErrors },
    handleSubmit: handleBillingSubmit,
    register: registerBilling,
    reset: resetBilling,
    getValues: getBillingValues,
    trigger: triggerBilling,
  } = useForm<FormBillingData>();

  const {
    formState: { errors: cardErrors },
    handleSubmit: handleCardSubmit,
    register: registerCard,
    reset: resetCard,
    getValues: getCardValues,
    trigger: triggerCard,
  } = useForm<FormCardData>();

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

  useEffect(() => {
    const getAddresses = async () => {
      let { data: userData, error: usersError } = await supabase
        .from("users")
        .select(`*, shipping_info(*), billing_info(*)`)
        .eq("id", user?.id);

      if (usersError) {
        console.error(usersError);
      }

      if (userData) {
        setShippingAddresses(userData[0].shipping_info);
        setBillingAddresses(userData[0].billing_info);
      }
    };

    getAddresses();
  }, [user?.id]);

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

    items.map(async (item) => {
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

  const handleProceedToPay = async () => {
    const cardInfo = getCardValues("card_info");
    const shippingInfoId = getShippingValues("shipping_info_id");
    const billingInfoId = getBillingValues("billing_info_id");

    const resultCardInfo = await triggerCard("card_info", {
      shouldFocus: true,
    });
    const resultBillingInfoId = await triggerBilling("billing_info_id", {
      shouldFocus: true,
    });
    const resultShippingInfoId = await triggerShipping("shipping_info_id", {
      shouldFocus: true,
    });

    if (
      resultCardInfo === false ||
      resultBillingInfoId === false ||
      resultShippingInfoId === false
    )
      return;

    const shippingInfo = shippingAddresses.find(
      (address) => address.id === shippingInfoId
    );

    const billingInfo = billingAddresses.find(
      (address) => address.id === billingInfoId
    );

    if (!shippingInfo || !billingInfo) return;

    // setLoadingPayment(true);

    const { data: order, error: orderError } = await supabase
      .from("order")
      .insert({
        owner_id: user?.id,
        total: total,
        customer_name: user?.identities,
        status: "started",
        tracking_id: "123456789",
        issue_date: "2021-09-01",
        estimated_date: "2021-09-05",
        payment_method: "credit_card",
        order_number: "123456789",
      })
      .select("id");

    if (orderError) throw orderError;

    const { error: shippingError } = await supabase
      .from("shipping_info")
      .insert({
        updated_at: "2021-09-01",
        owner_id: user?.id,
        order_id: order?.[0].id,
        name: "John",
        lastname: "Doe",
        document_id: "123456789",
        phone: "123456789",
        address: "123456789",
        address_extra: "123456789",
        country: "Spain",
        zipcode: 35600,
        city: "Puerto del Rosario",
        state: "Las Palmas",
        is_default: true,
      });

    if (shippingError) throw shippingError;

    const { error: billingError } = await supabase.from("billing_info").insert({
      updated_at: "2021-09-01",
      owner_id: user?.id,
      name: "John",
      lastname: "Doe",
      document_id: "123456789",
      phone: "123456789",
      address: "123456789",
      country: "Spain",
      zipcode: 35600,
      city: "Puerto del Rosario",
      state: "Las Palmas",
      is_default: true,
    });

    if (billingError) throw billingError;

    // setTimeout(() => {
    //   router.push("/order-details");
    //   setLoadingPayment(false);
    // }, 2400);

    // items.map((item) => {
    //   removeFromCart(item.id);
    // });
  };

  return (
    <Layout usePadding={true} useBackdrop={false}>
      <div className="flex flex-row items-center justify-center">
        <div className="container md:my-2 lg:my-12 lg:mx-6 ">
          <div className=" justify-center">
            {loadingPayment ? (
              <CustomLoading message={`${t("loading")}`} />
            ) : (
              <>
                {loading ? (
                  <Spinner color="beer-blonde" size="medium" />
                ) : (
                  <div className="container lg:px-4 lg:py-6">
                    <div className="md:py-4 lg:py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                      <div className="flex justify-start item-start space-y-2 flex-col">
                        <div className="text-2xl">{t("checkout")}</div>

                        <div className="flex flex-row items-center border-b sm:border-b-0 w-full sm:w-auto pb-4 sm:pb-0">
                          <div className="text-yellow-500">
                            <FontAwesomeIcon
                              icon={faInfoCircle}
                              style={{ color: "#fdc300" }}
                              title={"circle_warning"}
                              width={25}
                              height={25}
                            />
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
                                      handleRemoveFromCart={
                                        handleRemoveFromCart
                                      }
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
                                    <FontAwesomeIcon
                                      icon={faCircleExclamation}
                                      style={{ color: "#fdc300" }}
                                      title={"circle_warning"}
                                      width={120}
                                      height={120}
                                    />
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

                              {/* Shipping select list form */}
                              <div className="flex flex-col justify-start items-start w-full space-y-4">
                                <div className="flex flex-col justify-start items-start w-full space-y-2">
                                  <label
                                    htmlFor="shipping"
                                    className="text-sm font-medium text-gray-500"
                                  >
                                    {t("shipping")}
                                  </label>

                                  {/* Option box with list user shipping address  */}
                                </div>
                              </div>

                              {/* Radio button for select shipping address */}
                              <ul className="grid w-full gap-6 md:grid-cols-1">
                                {shippingAddresses.map((address) => {
                                  return (
                                    <li key={address.id}>
                                      <input
                                        type="radio"
                                        id={`shipping-address-${address.id}`}
                                        {...registerShipping(
                                          "shipping_info_id",
                                          { required: true }
                                        )}
                                        value={address.id}
                                        className="hidden peer"
                                        required
                                      />

                                      <label
                                        htmlFor={`shipping-address-${address.id}`}
                                        className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer
                                         dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-beer-blonde peer-checked:bg-bear-alvine peer-checked:border-4 peer-checked:border-beer-softBlonde peer-checked:text-beer-dark hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                                      >
                                        <div className="block">
                                          <div className="w-full text-lg font-semibold">
                                            {address.name} {address.lastname}
                                          </div>
                                          <div className="w-full">
                                            {address.address}, {address.city},{" "}
                                            {address.state}, {address.zipcode},{" "}
                                            {address.country}
                                          </div>
                                        </div>
                                        <svg
                                          aria-hidden="true"
                                          className="w-6 h-6 ml-3"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                          ></path>
                                        </svg>
                                      </label>
                                    </li>
                                  );
                                })}

                                {/* Error input displaying */}
                                {shippingErrors.shipping_info_id?.type ===
                                  "required" && (
                                  <div className="p-5 text-red-500">
                                    <p className="text-semibold text-2xl">
                                      {t("radio_button_required")}
                                    </p>
                                  </div>
                                )}
                              </ul>

                              {/* Add Shipping Information */}
                              {shippingAddresses.length <= 5 && (
                                <NewShippingAddress />
                              )}

                              {/* Radio button for select billing addresses */}
                              <ul className="grid w-full gap-6 md:grid-cols-1">
                                {billingAddresses.map((address) => {
                                  return (
                                    <li key={address.id}>
                                      <input
                                        type="radio"
                                        id={`billing-address-${address.id}`}
                                        {...registerBilling("billing_info_id")}
                                        value={address.id}
                                        className="hidden peer"
                                        required
                                      />

                                      <label
                                        htmlFor={`billing-address-${address.id}`}
                                        className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer
                                         dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-beer-blonde peer-checked:bg-bear-alvine peer-checked:border-4 peer-checked:border-beer-softBlonde peer-checked:text-beer-dark hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                                      >
                                        <div className="block">
                                          <div className="w-full text-lg font-semibold">
                                            {address.name} {address.lastname}
                                          </div>
                                          <div className="w-full">
                                            {address.address}, {address.city},{" "}
                                            {address.state}, {address.zipcode},{" "}
                                            {address.country}
                                          </div>
                                        </div>
                                        <svg
                                          aria-hidden="true"
                                          className="w-6 h-6 ml-3"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                          ></path>
                                        </svg>
                                      </label>
                                    </li>
                                  );
                                })}

                                {/* Error input displaying */}
                                {billingErrors.billing_info_id?.type ===
                                  "required" && (
                                  <div className="p-5 text-red-500">
                                    <p className="text-semibold text-2xl">
                                      {t("radio_button_required")}
                                    </p>
                                  </div>
                                )}
                              </ul>

                              {/* Add Billing Information  */}
                              {billingAddresses.length <= 5 && (
                                <NewBillingAddress />
                              )}

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
                                  title={t("view_carrier_details")!}
                                  accent
                                  medium
                                  class="sm:w-full text-base font-medium"
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
                                <div className="flex flex-col justify-start items-start space-y-2">
                                  <div className="text-xl text-gray-500">
                                    {t("payment_method")}
                                  </div>
                                  <div className="flex flex-row justify-start items-center space-x-2">
                                    <div className="w-8 h-8">
                                      <FontAwesomeIcon
                                        icon={faCreditCard}
                                        style={{ color: "#fdc300" }}
                                        title={"payment_method"}
                                        width={32}
                                        height={32}
                                      />
                                    </div>
                                    <div className="text-lg text-gray-500">
                                      {t("credit_card")}
                                    </div>
                                  </div>
                                </div>
                              </section>

                              <section>
                                <div className="flex flex-col justify-start items-start space-y-2">
                                  <div className="text-xl text-gray-500">
                                    {t("card_details")}
                                  </div>
                                </div>

                                <fieldset className="mb-3 mt-4 bg-white rounded text-gray-600 ">
                                  {/* Card Number */}
                                  <label className="flex border-b border-gray-200 h-12 py-3 items-center my-3">
                                    <span className="text-right px-2">
                                      {t("card_number")}
                                    </span>
                                    <input
                                      {...registerCard(
                                        "card_info.card_number",
                                        {
                                          required: true,
                                          pattern: {
                                            value: /^[0-9]{16}$/,
                                            message: "Invalid card number",
                                          },
                                        }
                                      )}
                                      className="focus:outline-none px-3 py-2 w-1/2 bg-beer-softFoam rounded-sm"
                                      placeholder={
                                        t("card_number_placeholder")!
                                      }
                                      minLength={16}
                                      maxLength={16}
                                      type="number"
                                      required
                                    />
                                  </label>

                                  {/* Expiry Data and CVC GROUP */}
                                  <div className="flex justify-between sm:flex-col lg:flex-row items-center my-3">
                                    {/* Expiry Data */}
                                    <label className="flex border-b border-gray-200 h-12 py-3 items-center w-full">
                                      <span className="text-right px-2">
                                        {t("card_expiration")}
                                      </span>
                                      <input
                                        {...registerCard(
                                          "card_info.card_month_expiration",
                                          {
                                            required: true,
                                            pattern: {
                                              value: /^[0-9]{2}$/,
                                              message:
                                                "Invalid card expiration month",
                                            },
                                          }
                                        )}
                                        className="focus:outline-none px-3 py-2 sm:w-14 md:w-20 bg-beer-softFoam rounded-sm"
                                        placeholder={
                                          t(
                                            "card_month_expiration_placeholder"
                                          )!
                                        }
                                        maxLength={2}
                                        size={2}
                                        type="number"
                                        required
                                      />

                                      <span>/</span>

                                      <input
                                        {...registerCard(
                                          "card_info.card_year_expiration",
                                          {
                                            required: true,
                                            pattern: {
                                              value: /^[0-9]{2}$/,
                                              message:
                                                "Invalid card expiration year",
                                            },
                                          }
                                        )}
                                        className="focus:outline-none px-3 py-2 sm:w-14 md:w-20 bg-beer-softFoam rounded-sm"
                                        placeholder={
                                          t("card_year_expiration_placeholder")!
                                        }
                                        maxLength={2}
                                        size={2}
                                        type="number"
                                        required
                                      />
                                    </label>

                                    {/* CVC */}
                                    <label className="flex border-b border-gray-200 h-12 py-3 items-center w-full">
                                      <span className="text-right px-2">
                                        {t("card_cvv")}
                                      </span>
                                      <input
                                        {...registerCard("card_info.card_cvv", {
                                          required: true,
                                          pattern: {
                                            value: /^[0-9]{3}$/,
                                            message: "Invalid card cvv",
                                          },
                                        })}
                                        className="focus:outline-none px-3 py-2 sm:w-14 md:w-20 bg-beer-softFoam rounded-sm"
                                        placeholder={t("card_cvv_placeholder")!}
                                        maxLength={3}
                                        size={3}
                                        type="number"
                                        required
                                      />
                                    </label>
                                  </div>

                                  {/* Name on Card */}
                                  <label className="flex border-b border-gray-200 h-12 py-3 items-center my-3">
                                    <span className="text-right px-2">
                                      {t("card_holder")}
                                    </span>
                                    <input
                                      {...registerCard(
                                        "card_info.card_holder",
                                        {
                                          required: true,
                                          pattern: {
                                            value: /^[a-zA-Z ]{2,30}$/,
                                            message: "Invalid card holder",
                                          },
                                        }
                                      )}
                                      className="focus:outline-none px-3 py-2 w-full bg-beer-softFoam rounded-sm"
                                      placeholder={
                                        t("card_holder_placeholder")!
                                      }
                                      minLength={2}
                                      maxLength={30}
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
                                  <div className="flex items-center">
                                    <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">
                                      {t("total")}
                                    </p>
                                    <p className="pl-2 text-base dark:text-gray-300 text-gray-600">
                                      ({t("with_taxes_included")})
                                    </p>
                                  </div>

                                  <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">
                                    {formatCurrency(total)}
                                  </p>
                                </div>

                                {/* Proceed to pay */}
                                <div className="flex justify-center items-center md:justify-start md:items-start w-full">
                                  <Button
                                    btnType={"submit"}
                                    large
                                    primary
                                    class="font-semibold"
                                    title={""}
                                    disabled={cart.length === 0}
                                    onClick={() => {
                                      handleProceedToPay();
                                    }}
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
                                      180 North King Street, Northhampton MA
                                      1060
                                    </p>
                                  </div>

                                  <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                                    <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                                      {t("billing_address")}
                                    </p>
                                    <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                                      180 North King Street, Northhampton MA
                                      1060
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
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// export async function getServerSideProps({ req }: any) {
//   const { user } = await supabase.auth.api.getUserByCookie(req);

//   let { data: userData, error: usersError } = await supabase
//     .from("users")
//     .select(`*, shipping_info(*), billing_info(*)`)
//     .eq("id", user?.id);
//   console.log(userData);
//   if (usersError) throw usersError;
//   if (!userData) return { props: {} };

//   return {
//     props: {
//       shippingAddresses: userData[0]?.shipping_info ?? [],
//       billingAddresses: userData[0]?.billing_info ?? [],
//     },
//   };
// }
