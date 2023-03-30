import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useShoppingCart } from "../../components/Context/ShoppingCartContext";
import { Spinner } from "../../components/common/Spinner";
import { Product } from "../../lib/types";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  faShoppingCart,
  faCircleExclamation,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../components/Auth/useAuth";
import { useForm } from "react-hook-form";
import { BillingAddress, ShippingAddress } from "../../lib/interfaces";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Button, CustomLoading } from "../../components/common";
import {
  CheckoutItem,
  NewBillingAddress,
  NewShippingAddress,
} from "../../components/checkout";
import { Layout } from "../../components";

import {
  createRedsysAPI,
  TRANSACTION_TYPES,
  randomTransactionId,
  SANDBOX_URLS,
  isResponseCodeOk,
  CURRENCIES,
  Currency,
} from "redsys-easy";
import Decimal from "decimal.js";

interface OrderPaymentStatus {
  orderId: string;
  amount: string;
  currency: Currency;
  status: "PENDING_PAYMENT" | "PAYMENT_FAILED" | "PAYMENT_SUCCEDED";
}

interface FormShippingData {
  shipping_info_id: string;
}

interface FormBillingData {
  billing_info_id: string;
}

interface Props {
  shippingAddresses: ShippingAddress[];
  billingAddresses: BillingAddress[];
}

export default function Checkout({
  shippingAddresses: shippingAddresses_,
  billingAddresses: billingAddresses_,
}: Props) {
  const { t } = useTranslation();

  const { user } = useAuth();
  const { clearCart } = useShoppingCart();

  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

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

  const [isFormReady, setIsFormReady] = useState<boolean>(false);

  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<string>("");
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<string>("");

  const [merchantParameters, setMerchantParameters] = useState<string>("");
  const [merchantSignature, setMerchantSignature] = useState<string>("");

  const {
    formState: { errors: shippingErrors },
    register: registerShipping,
    trigger: triggerShipping,
  } = useForm<FormShippingData>();

  const {
    formState: { errors: billingErrors },
    register: registerBilling,
    trigger: triggerBilling,
  } = useForm<FormBillingData>();

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

  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const ac = new AbortController();

    items.map(async (item) => {
      const product = marketplaceItems.find((m_item) => m_item.id === item.id);
      if (!product) return;

      setCart((cart) => [...cart, product]);

      setsubtotal((subtotal) => subtotal + product.price * item.quantity);
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

  const handleIncreaseCartQuantity = (productId: string) => {
    increaseCartQuantity(productId);
    if (marketplaceItems.find((item) => item.id === productId)) return;
    const product: Product | undefined = marketplaceItems.find(
      (item) => item.id === productId
    );
    if (!product) return;
    addMarketplaceItems(product);
  };

  const handleDecreaseCartQuantity = (productId: string) => {
    decreaseCartQuantity(productId);
    if (getItemQuantity(productId) > 1) return;
    removeMarketplaceItems(productId);
  };

  const handleRemoveFromCart = (productId: string) => {
    removeMarketplaceItems(productId);
    removeFromCart(productId);
  };

  const handleShippingAddresses = (address: ShippingAddress) => {
    setShippingAddresses((shippingAddresses) => [
      ...shippingAddresses,
      address,
    ]);
  };

  const handleBillingAddresses = (address: BillingAddress) => {
    setBillingAddresses((billingAddresses) => [...billingAddresses, address]);
  };

  const handleProceedToPay = async () => {
    const shippingInfoId = selectedShippingAddress;
    const billingInfoId = selectedBillingAddress;

    const resultBillingInfoId = await triggerBilling("billing_info_id", {
      shouldFocus: true,
    });
    const resultShippingInfoId = await triggerShipping("shipping_info_id", {
      shouldFocus: true,
    });

    if (resultBillingInfoId === false || resultShippingInfoId === false) return;

    const shippingInfo = shippingAddresses.find(
      (address) => address.id === shippingInfoId
    );

    const billingInfo = billingAddresses.find(
      (address) => address.id === billingInfoId
    );

    if (!shippingInfo || !billingInfo) return;

    setLoadingPayment(true);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        owner_id: user?.id,
        total: total,
        customer_name: "manolito",
        status: "started",
        tracking_id: "123456789",
        issue_date: new Date().toISOString(),
        estimated_date: new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24 * 3
        ).toISOString(), // 3 days
        payment_method: "credit_card",
        order_number: "123456789",
        shipping_info_id: shippingInfoId,
        billing_info_id: billingInfoId,
      })
      .select("id");

    if (orderError) throw orderError;

    items.map(async (item) => {
      const { error: orderItemError } = await supabase
        .from("order_item")
        .insert({
          order_id: order?.[0].id,
          product_id: item.id,
          quantity: item.quantity,
        });

      if (orderItemError) throw orderItemError;
    });

    proceedPaymentRedsys();

    setLoadingPayment(false);
    // clearCart();
  };

  // REDSYS PAYMENT
  const proceedPaymentRedsys = async () => {
    const { createRedirectForm, processRestNotification } = createRedsysAPI({
      urls: SANDBOX_URLS,
      secretKey: "sq7HjrUOBfKmC576ILgskD5srU870gJ7",
    });

    const merchantInfo = {
      DS_MERCHANT_MERCHANTCODE: "097839427",
      DS_MERCHANT_TERMINAL: "1",
    } as const;

    const port = 3344;
    const endpoint = `http://example.com:${port}`;

    const successRedirectPath = "/success";
    const errorRedirectPath = "/error";
    const notificationPath = "/api/notification";

    // Use productIds to calculate amount and currency
    const { totalAmount, currency } = {
      // Never use floats for money
      totalAmount: total,
      currency: "EUR",
    } as const;

    const orderId = randomTransactionId();

    const currencyInfo = CURRENCIES[currency];

    // Convert 49.99€ -> 4999
    const redsysAmount = new Decimal(totalAmount)
      .mul(Math.pow(10, currencyInfo.decimals))
      .round()
      .toFixed(0);

    // Convert EUR -> 978
    const redsysCurrency = currencyInfo.num;

    const form = createRedirectForm({
      ...merchantInfo,
      DS_MERCHANT_MERCHANTCODE: "097839427",
      DS_MERCHANT_TERMINAL: "1",
      DS_MERCHANT_TRANSACTIONTYPE: TRANSACTION_TYPES.AUTHORIZATION, // '0'
      DS_MERCHANT_ORDER: orderId,
      DS_MERCHANT_AMOUNT: redsysAmount,
      DS_MERCHANT_CURRENCY: redsysCurrency,
      DS_MERCHANT_MERCHANTNAME: "Cervezanas M&M SL",
      DS_MERCHANT_MERCHANTURL: `${endpoint}${notificationPath}`,
      DS_MERCHANT_URLOK: `${endpoint}${successRedirectPath}`,
      DS_MERCHANT_URLKO: `${endpoint}${errorRedirectPath}`,
    });

    setMerchantParameters(form.body.Ds_MerchantParameters);
    setMerchantSignature(form.body.Ds_Signature);
    setIsFormReady(true);

    // REDIRECT TO URL
    // router.push(url);

    // // IF URL ERROR -> PUSH TO ERROR
    // router.push({
    //   pathname: `/checkout/error/${order?.[0].id}`,
    // });

    // // IF URL OK -> PUSH TO SUCCESS
    // router.push({
    //   pathname: `/checkout/success/${order?.[0].id}`,
    // });
  };

  useEffect(() => {
    if (isFormReady) {
      // Call submit form
      btnRef.current && btnRef.current.click();
    }
  }, [isFormReady]);

  const handleOnClickShipping = (addressId: string) => {
    setSelectedShippingAddress(addressId);
  };

  const handleOnClickBilling = (addressId: string) => {
    setSelectedBillingAddress(addressId);
  };

  return (
    <Layout usePadding={true} useBackdrop={false}>
      <div className="flex flex-row items-center justify-center sm:my-2 lg:mx-6 ">
        <form
          action={`https://sis-t.redsys.es:25443/sis/realizarPago`}
          method="POST"
          name="form"
          ref={formRef}
        >
          <input
            type="hidden"
            id="Ds_SignatureVersion"
            name="Ds_SignatureVersion"
            value="HMAC_SHA256_V1"
          />

          <input
            type="hidden"
            id="Ds_MerchantParameters"
            name="Ds_MerchantParameters"
            value={merchantParameters}
          />

          <input
            type="hidden"
            id="Ds_Signature"
            name="Ds_Signature"
            value={merchantSignature}
          />

          <button ref={btnRef} type="submit" hidden>
            Submit
          </button>
        </form>

        {loadingPayment ? (
          <CustomLoading message={`${t("loading")}`} />
        ) : (
          <>
            {loading ? (
              <Spinner color="product-blonde" size="medium" />
            ) : (
              <div className="sm:py-4 lg:py-6 container">
                <div className="flex justify-start items-center space-y-2 space-x-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                    {t("checkout")}
                  </h1>

                  <div className="flex flex-row items-center border-b sm:border-b-0 w-full sm:w-auto pb-4 sm:pb-0">
                    <div className="text-yellow-500 w-10 h-10">
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{
                          color: "#fdc300",
                          width: "100%",
                          height: "100%",
                        }}
                        title={"circle_warning"}
                        width={25}
                        height={25}
                      />
                    </div>

                    <div className="text-sm tracking-wide text-gray-500 mt-4 sm:mt-0 sm:ml-2">
                      {t("complete_shipping_billing")}
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                  {/* Products  */}
                  <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8 ">
                    {/* Customer's Car */}
                    <div className="border border-product-softBlonde flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                      <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                        {t("customer_s_cart")}
                      </p>
                      {cart.length > 0 ? (
                        <>
                          {cart.map((product) => {
                            return (
                              <div key={product.id}>
                                <CheckoutItem
                                  product={product}
                                  handleIncreaseCartQuantity={
                                    handleIncreaseCartQuantity
                                  }
                                  handleDecreaseCartQuantity={
                                    handleDecreaseCartQuantity
                                  }
                                  handleRemoveFromCart={handleRemoveFromCart}
                                  quantity={getItemQuantity(product.id)}
                                />
                              </div>
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
                                style={{ color: "#432a14", height: "6vh" }}
                                title={"empty_cart"}
                                width={120}
                                height={120}
                              />
                              <FontAwesomeIcon
                                icon={faCircleExclamation}
                                style={{ color: "#fdc300", height: "6vh" }}
                                title={"circle_warning"}
                                width={120}
                                height={120}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Shipping Container */}
                    <div className="border border-product-softBlonde flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                      <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                        <h2 className="text-2xl dark:text-white font-semibold leading-5 text-gray-800">
                          {t("shipping_and_billing_info")}
                        </h2>

                        <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                          {t("shipping_info")}{" "}
                        </h3>

                        {/* Shipping */}
                        <div className="flex flex-col justify-start items-start w-full space-y-4">
                          <div className="flex flex-col justify-start items-start w-full space-y-2">
                            <label
                              htmlFor="shipping"
                              className="text-sm font-medium text-gray-500"
                            >
                              {t("shipping")}
                            </label>
                          </div>
                        </div>

                        {/* Radio button for select shipping address */}
                        <ul className="grid w-full gap-6 md:grid-cols-1">
                          {shippingAddresses.map((address) => {
                            return (
                              <div key={address.id}>
                                <li
                                  onClick={() =>
                                    handleOnClickShipping(address.id)
                                  }
                                >
                                  <input
                                    type="radio"
                                    id={`shipping-address-${address.id}`}
                                    {...registerShipping("shipping_info_id", {
                                      required: true,
                                    })}
                                    value={address.id}
                                    className="hidden peer"
                                    required
                                  />

                                  <label
                                    htmlFor={`shipping-address-${address.id}`}
                                    className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer
                                         dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-product-blonde peer-checked:bg-bear-alvine peer-checked:border-4 peer-checked:border-product-softBlonde peer-checked:text-product-dark hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
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
                              </div>
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
                        {shippingAddresses.length < 5 && (
                          <NewShippingAddress
                            handleShippingAddresses={handleShippingAddresses}
                          />
                        )}

                        <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                          {" "}
                          {t("billing_info")}{" "}
                        </h3>

                        {/* Billing */}
                        <div className="flex flex-col justify-start items-start w-full space-y-4">
                          <div className="flex flex-col justify-start items-start w-full space-y-2">
                            <label
                              htmlFor="billing"
                              className="text-sm font-medium text-gray-500"
                            >
                              {t("billing")}
                            </label>
                          </div>
                        </div>

                        {/* Radio button for select billing addresses */}
                        <ul className="grid w-full gap-6 md:grid-cols-1">
                          {billingAddresses.map((address) => {
                            return (
                              <div key={address.id}>
                                <li
                                  onClick={() =>
                                    handleOnClickBilling(address.id)
                                  }
                                >
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
                                         dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-product-blonde peer-checked:bg-bear-alvine peer-checked:border-4 peer-checked:border-product-softBlonde peer-checked:text-product-dark hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
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
                              </div>
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
                        {billingAddresses.length < 5 && (
                          <NewBillingAddress
                            handleBillingAddresses={handleBillingAddresses}
                          />
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
                  </div>

                  {/* Order summary  */}
                  <div className="border border-product-softBlonde bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
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
                                {formatCurrency(discount)} {discount / subtotal}
                                %
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
                        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 mb-6">
                          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                            {t("addresses")}
                          </h3>

                          <div className="flex justify-start md:justify-start xl:flex-col flex-col lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-8 md:space-y-3 md:flex-col items-start sm:items-center md:items-start">
                            <div className="flex justify-center md:justify-start items-start flex-col space-y-4 xl:mt-8">
                              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                                {t("shipping_address")}
                              </p>

                              <div className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                                {shippingAddresses.map((address) => {
                                  if (address.id === selectedShippingAddress)
                                    return (
                                      <div key={address.id}>
                                        <label
                                          className=" w-full text-product-dark 
                                           dark:text-gray-400 dark:bg-gray-800"
                                        >
                                          <div className="block">
                                            <div className="w-full text-lg font-semibold">
                                              {address.name} {address.lastname}
                                            </div>
                                            <div className="w-full text-md">
                                              {address.address}, {address.city},{" "}
                                              {address.state}, {address.zipcode}
                                              , {address.country}
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    );
                                })}
                              </div>
                            </div>

                            <div className="flex justify-center md:justify-start items-start flex-col space-y-4">
                              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                                {t("billing_address")}
                              </p>

                              <div className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                                {billingAddresses.map((address) => {
                                  if (address.id === selectedBillingAddress)
                                    return (
                                      <div key={address.id}>
                                        <label className=" w-full text-product-dark dark:text-gray-400 dark:bg-gray-800">
                                          <div className="block">
                                            <div className="w-full text-lg font-semibold">
                                              {address.name} {address.lastname}
                                            </div>

                                            <div className="w-full text-md">
                                              {address.address}, {address.city},{" "}
                                              {address.state}, {address.zipcode}
                                              , {address.country}
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    );
                                })}
                              </div>
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
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

/*
function NextCors(
  req: any,
  res: any,
  arg2: { methods: string[]; origin: string; optionsSuccessStatus: number }
) {
  throw new Error("Function not implemented.");
}
*/
export async function getServerSideProps({ req }: any) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  let { data: userData, error: usersError } = await supabase
    .from("users")
    .select(`*, shipping_info(*), billing_info(*)`)
    .eq("id", user?.id);
  if (usersError) throw usersError;
  if (!userData) return { props: {} };

  return {
    props: {
      shippingAddresses: userData[0]?.shipping_info ?? [],
      billingAddresses: userData[0]?.billing_info ?? [],
    },
  };
}
