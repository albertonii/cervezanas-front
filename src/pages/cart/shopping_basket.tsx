import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useShoppingCart } from "../../components/Context/ShoppingCartContext";
import { Spinner } from "../../components/common/Spinner";
import { IProduct } from "../../lib/types.d";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  faShoppingCart,
  faCircleExclamation,
  faInfoCircle,
  faLongArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../components/Auth/useAuth";
import { useForm } from "react-hook-form";
import { IBillingAddress, IShippingAddress } from "../../lib/interfaces";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Button, CustomLoading } from "../../components/common";
import {
  CheckoutItem,
  NewBillingAddress,
  NewShippingAddress,
} from "../../components/checkout";
import Decimal from "decimal.js";
import DisplayInputError from "../../components/common/DisplayInputError";
import { randomTransactionId, CURRENCIES } from "redsys-easy";
import { createRedirectForm, merchantInfo } from "../../components/TPV";
import { Paypal } from "../../components/paypal";
import { ROUTE_SIGNIN } from "../../config";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

interface FormShippingData {
  shipping_info_id: string;
}

interface FormBillingData {
  billing_info_id: string;
}

interface Props {
  shippingAddresses: IShippingAddress[];
  billingAddresses: IBillingAddress[];
}

export default function Checkout({
  shippingAddresses: shippingAddresses_,
  billingAddresses: billingAddresses_,
}: Props) {
  const { t } = useTranslation();

  const { user } = useAuth();

  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(subtotal - discount + shipping + tax);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [merchantParameters, setMerchantParameters] = useState("");
  const [merchantSignature, setMerchantSignature] = useState("");
  const [selectedShippingAddress, setSelectedShippingAddress] = useState("");
  const [selectedBillingAddress, setSelectedBillingAddress] = useState("");

  const [cart, setCart] = useState<IProduct[]>([]);

  const [shippingAddresses, setShippingAddresses] = useState<
    IShippingAddress[]
  >(shippingAddresses_ || []);
  const [billingAddresses, setBillingAddresses] = useState<IBillingAddress[]>(
    billingAddresses_ || []
  );

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

  useEffect(() => {
    const awaitProducts = async () => {
      const promises = items.map(async (item) => {
        // Finds the product in the marketplaceItems array
        const product = marketplaceItems.find(
          (m_item) => m_item.id === item.id
        );
        if (!product) return null;

        setSubtotal((subtotal) => subtotal + product.price * item.quantity);
        return product;
      });

      const awaitedProducts = await Promise.all(promises);
      const ps = awaitedProducts.filter(
        (product) => product !== null
      ) as IProduct[];
      setCart(ps);

      setTotal(() => subtotal - discount + shipping + tax);
      setLoading(false);
    };

    setLoading(true);
    const ac = new AbortController();

    awaitProducts();

    return () => {
      setCart([]);
      setLoading(false);
      ac.abort();
      setSubtotal(0);
      setShipping(0);
      setTax(0);
      setDiscount(0);
      setTotal(0);
    };
  }, [discount, items, marketplaceItems, shipping, subtotal, tax]);

  const handleIncreaseCartQuantity = useCallback(
    (productId: string) => {
      increaseCartQuantity(productId);
      if (marketplaceItems.find((item) => item.id === productId)) return;
      const product: IProduct | undefined = marketplaceItems.find(
        (item) => item.id === productId
      );
      if (!product) return;
      addMarketplaceItems(product);
    },
    [addMarketplaceItems, increaseCartQuantity, marketplaceItems]
  );

  const handleDecreaseCartQuantity = useCallback(
    (productId: string) => {
      decreaseCartQuantity(productId);
      if (getItemQuantity(productId) > 1) return;
      removeMarketplaceItems(productId);
    },
    [decreaseCartQuantity, getItemQuantity, removeMarketplaceItems]
  );

  const handleRemoveFromCart = useCallback(
    (productId: string) => {
      removeMarketplaceItems(productId);
      removeFromCart(productId);
    },
    [removeFromCart, removeMarketplaceItems]
  );

  const handleShippingAddresses = (address: IShippingAddress) => {
    setShippingAddresses((shippingAddresses) => [
      ...shippingAddresses,
      address,
    ]);
  };

  const handleBillingAddresses = (address: IBillingAddress) => {
    setBillingAddresses((billingAddresses) => [...billingAddresses, address]);
  };

  const checkForm = async () => {
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

    if (!shippingInfo || !billingInfo) false;
    return true;
  };

  const handleProceedToPay = async () => {
    if (!(await checkForm())) return;

    setLoadingPayment(true);

    const shippingInfoId = selectedShippingAddress;
    const billingInfoId = selectedBillingAddress;

    try {
      const orderNumber = await proceedPaymentRedsys();
      createOrder(billingInfoId, shippingInfoId, orderNumber);
      setIsFormReady(true);
    } catch (error) {
      console.error(error);
      setLoadingPayment(false);
    }
  };

  const createOrder = async (
    billingInfoId: string,
    shippingInfoId: string,
    orderNumber: string
  ) => {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        owner_id: user?.id,
        total: total,
        customer_name: "manolito",
        status: "order_placed",
        tracking_id: "123456789",
        issue_date: new Date().toISOString(),
        estimated_date: new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24 * 3
        ).toISOString(), // 3 days
        payment_method: "credit_card",
        order_number: orderNumber,
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
  };

  // REDSYS PAYMENT
  const proceedPaymentRedsys = async () => {
    // Use productIds to calculate amount and currency
    const { totalAmount, currency } = {
      // Never use floats for money
      totalAmount: total,
      currency: "EUR",
    } as const;

    const orderNumber = randomTransactionId();
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
      DS_MERCHANT_ORDER: orderNumber,
      DS_MERCHANT_AMOUNT: redsysAmount,
      DS_MERCHANT_CURRENCY: redsysCurrency,
    });

    setMerchantParameters(form.body.Ds_MerchantParameters);
    setMerchantSignature(form.body.Ds_Signature);

    return orderNumber;
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
            <div className="container sm:py-4 lg:py-6">
              <div className="flex items-center justify-start space-y-2 space-x-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  {t("checkout")}
                </h1>

                <div className="flex w-full flex-row items-center border-b pb-4 sm:w-auto sm:border-b-0 sm:pb-0">
                  <div className="h-10 w-10 text-yellow-500">
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

                  <div className="mt-4 text-sm tracking-wide text-gray-500 sm:mt-0 sm:ml-2">
                    {t("complete_shipping_billing")}
                  </div>
                </div>
              </div>

              <div className="jusitfy-center mt-10 flex w-full flex-col items-stretch space-y-4 md:space-y-6 xl:flex-row xl:space-x-8 xl:space-y-0">
                {/* Products  */}
                <div className="flex w-full flex-col items-start justify-start space-y-4 md:space-y-6 xl:space-y-8 ">
                  {/* Customer's Car */}
                  <div className="border-product-softBlonde flex w-full flex-col items-start justify-start border bg-gray-50 px-4 py-4 dark:bg-gray-800 md:p-6 md:py-6 xl:p-8">
                    <p className="text-lg font-semibold leading-6 text-gray-800 dark:text-white md:text-xl xl:leading-5">
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
                        <div className="mt-4 flex w-full flex-row items-center justify-between">
                          <div className="flex flex-col items-start justify-start space-y-2">
                            <div className="text-2xl text-gray-500">
                              {t("subtotal")}

                              <span className="ml-6 font-semibold text-gray-800">
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
                          <div className="flex flex-row items-center justify-center">
                            <div className="mt-4 flex w-1/2 flex-col items-start justify-between">
                              <h2 className="text-2xl text-gray-500">
                                {t("your_empty_cart")}
                              </h2>

                              <div className="flex flex-col items-start justify-start space-y-2">
                                <div className="text-xl text-gray-500">
                                  {t("add_products_to_continue")}
                                </div>
                              </div>
                            </div>
                            <FontAwesomeIcon
                              icon={faShoppingCart}
                              style={{ color: "#432a14", height: "6vh" }}
                              title={t("empty_cart") ?? "empty_cart"}
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
                  <div className="border-product-softBlonde flex w-full flex-col items-stretch justify-center space-y-4 border md:flex-row md:space-y-0 md:space-x-6 xl:space-x-8">
                    <div className="flex w-full flex-col justify-center space-y-6 bg-gray-50 px-4 py-6 dark:bg-gray-800 md:p-6 xl:p-8">
                      <h2 className="text-2xl font-semibold leading-5 text-gray-800 dark:text-white">
                        {t("shipping_and_billing_info")}
                      </h2>

                      <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                        {t("shipping_info")}{" "}
                      </h3>

                      {/* Shipping */}
                      <div className="flex w-full flex-col items-start justify-start space-y-4">
                        <div className="flex w-full flex-col items-start justify-start space-y-2">
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
                                  className="peer hidden"
                                  required
                                />

                                <label
                                  htmlFor={`shipping-address-${address.id}`}
                                  className="dark:peer-checked:text-product-blonde peer-checked:border-product-softBlonde peer-checked:text-product-dark inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200
                                         bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-4 peer-checked:bg-bear-alvine dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
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

                                  <FontAwesomeIcon
                                    icon={faLongArrowRight}
                                    style={{
                                      color: "#fdc300",
                                      width: "25px",
                                    }}
                                    title={"arrow_right"}
                                    width={25}
                                    height={25}
                                  />
                                </label>
                              </li>
                            </div>
                          );
                        })}

                        {/* Error input displaying */}
                        {shippingErrors.shipping_info_id?.type ===
                          "required" && (
                          <DisplayInputError message="errors.select_location_required" />
                        )}
                      </ul>

                      {/* Add Shipping Information */}
                      {shippingAddresses.length < 5 && (
                        <NewShippingAddress
                          handleShippingAddresses={handleShippingAddresses}
                        />
                      )}

                      <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                        {t("billing_info")}
                      </h3>

                      {/* Billing */}
                      <div className="flex w-full flex-col items-start justify-start space-y-4">
                        <div className="flex w-full flex-col items-start justify-start space-y-2">
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
                                onClick={() => handleOnClickBilling(address.id)}
                              >
                                <input
                                  type="radio"
                                  id={`billing-address-${address.id}`}
                                  {...registerBilling("billing_info_id", {
                                    required: true,
                                  })}
                                  value={address.id}
                                  className="peer hidden"
                                  required
                                />

                                <label
                                  htmlFor={`billing-address-${address.id}`}
                                  className="dark:peer-checked:text-product-blonde peer-checked:border-product-softBlonde peer-checked:text-product-dark inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200
                                         bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-4 peer-checked:bg-bear-alvine dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
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

                                  <FontAwesomeIcon
                                    icon={faLongArrowRight}
                                    style={{
                                      color: "#fdc300",
                                      width: "35px",
                                    }}
                                    title={"arrow_right"}
                                    width={25}
                                    height={25}
                                  />
                                </label>
                              </li>
                            </div>
                          );
                        })}

                        {/* Error input displaying */}
                        {billingErrors.billing_info_id?.type === "required" && (
                          <DisplayInputError message="errors.select_location_required" />
                        )}
                      </ul>

                      {/* Add Billing Information  */}
                      {billingAddresses.length < 5 && (
                        <NewBillingAddress
                          handleBillingAddresses={handleBillingAddresses}
                        />
                      )}

                      <div className="flex w-full items-start justify-between">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="h-8 w-8">
                            <Image
                              width={32}
                              height={32}
                              className="h-full w-full"
                              alt="logo"
                              src="https://i.ibb.co/L8KSdNQ/image-3.png"
                            />
                          </div>
                          <div className="flex flex-col items-center justify-start">
                            <p className="text-lg font-semibold leading-6 text-gray-800 dark:text-white">
                              DPD Delivery
                              <br />
                              <span className="font-normal">
                                {t("delivery_24h")}
                              </span>
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-semibold leading-6 text-gray-800 dark:text-white">
                          {formatCurrency(8)}
                        </p>
                      </div>

                      <div className="flex w-full items-center justify-center">
                        <Button
                          title={t("view_carrier_details") ?? "View details"}
                          accent
                          medium
                          class="text-base font-medium sm:w-full"
                        >
                          {t("view_carrier_details")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order summary  */}
                <div className="border-product-softBlonde flex w-full flex-col items-center justify-between border bg-gray-50 px-4 py-6 dark:bg-gray-800 md:items-start md:p-6 xl:w-96 xl:p-8">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                    {t("customer")}
                  </h3>

                  <div className="flex h-full w-full flex-col items-stretch justify-start md:flex-col lg:space-x-8 xl:flex-col xl:space-x-0">
                    {/* Summary */}
                    <div className="flex flex-shrink-0 flex-col items-start justify-start">
                      <div className="flex w-full flex-col space-y-6 bg-gray-50 px-4 py-6 dark:bg-gray-800 md:p-6 xl:p-8">
                        <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                          {t("summary")}
                        </h3>

                        <div className="flex w-full flex-col items-center justify-center space-y-6 border-b border-gray-200 pb-4">
                          <div className="flex w-full justify-between">
                            <p className="text-base leading-4 text-gray-800 dark:text-white">
                              {t("subtotal")}
                            </p>
                            <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                              {formatCurrency(subtotal)}
                            </p>
                          </div>

                          {/* discount */}
                          <div className="flex w-full items-center justify-between">
                            <p className="text-base leading-4 text-gray-800 dark:text-white">
                              {t("discount")}
                              <span className="bg-gray-200 p-1 text-xs font-medium leading-3 text-gray-800 dark:bg-white dark:text-gray-800">
                                STUDENT
                              </span>
                            </p>
                            <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                              {formatCurrency(discount)} {discount / subtotal}%
                            </p>
                          </div>

                          <div className="flex w-full items-center justify-between">
                            <p className="text-base leading-4 text-gray-800 dark:text-white">
                              {t("shipping")}
                            </p>
                            <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                              {formatCurrency(shipping)}
                            </p>
                          </div>

                          {/* taxes  */}
                          <div className="flex w-full items-center justify-between">
                            <p className="text-base leading-4 text-gray-800 dark:text-white">
                              {t("tax")}
                            </p>
                            <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                              {formatCurrency(tax)}
                            </p>
                          </div>
                        </div>

                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-base font-semibold leading-4 text-gray-800 dark:text-white">
                              {t("total")}
                            </p>
                            <p className="pl-2 text-base text-gray-600 dark:text-gray-300">
                              ({t("with_taxes_included")})
                            </p>
                          </div>

                          <p className="text-base font-semibold leading-4 text-gray-600 dark:text-gray-300">
                            {formatCurrency(total)}
                          </p>
                        </div>

                        {/* Proceed to pay */}
                        <div className="flex w-full items-center justify-center md:items-start md:justify-start">
                          <Button
                            large
                            primary
                            class={`font-semibold`}
                            title={""}
                            disabled={cart.length === 0}
                            onClick={() => {
                              handleProceedToPay();
                            }}
                          >
                            {t("proceed_to_pay")}
                          </Button>
                        </div>

                        {/* Paypal payment method */}
                        {total > 0 && (
                          <div
                            className="flex w-full items-center justify-center md:items-start md:justify-start"
                            onClick={() => {
                              checkForm();
                            }}
                          >
                            <Paypal
                              total={total}
                              items={items}
                              shipping_info_id={selectedShippingAddress}
                              billing_info_id={selectedBillingAddress}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Addresses */}
                    <div className="mt-6 flex flex-shrink-0 flex-col items-start justify-start space-y-6 pb-4 md:mt-0">
                      <div className="mb-6 flex w-full flex-col bg-gray-50 px-4 py-6 dark:bg-gray-800 md:p-6 xl:p-8">
                        <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                          {t("addresses")}
                        </h3>

                        <div className="flex flex-col items-start justify-start space-y-4 sm:items-center md:flex-col md:items-start md:justify-start md:space-y-3 lg:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-8">
                          <div className="flex flex-col items-start justify-center space-y-4 md:justify-start xl:mt-8">
                            <p className="text-center text-base font-semibold leading-4 text-gray-800 dark:text-white md:text-left">
                              {t("shipping_address")}
                            </p>

                            <div className="w-48 text-center text-sm leading-5 text-gray-600 dark:text-gray-300 md:text-left lg:w-full xl:w-48">
                              {shippingAddresses.map((address) => {
                                if (address.id === selectedShippingAddress)
                                  return (
                                    <div key={address.id}>
                                      <label
                                        className=" text-product-dark w-full 
                                           dark:bg-gray-800 dark:text-gray-400"
                                      >
                                        <div className="block">
                                          <div className="w-full text-lg font-semibold">
                                            {address.name} {address.lastname}
                                          </div>
                                          <div className="text-md w-full">
                                            {address.address}, {address.city},{" "}
                                            {address.state}, {address.zipcode},{" "}
                                            {address.country}
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                  );
                              })}
                            </div>
                          </div>

                          <div className="flex flex-col items-start justify-center space-y-4 md:justify-start">
                            <p className="text-center text-base font-semibold leading-4 text-gray-800 dark:text-white md:text-left">
                              {t("billing_address")}
                            </p>

                            <div className="w-48 text-center text-sm leading-5 text-gray-600 dark:text-gray-300 md:text-left lg:w-full xl:w-48">
                              {billingAddresses.map((address) => {
                                if (address.id === selectedBillingAddress)
                                  return (
                                    <div key={address.id}>
                                      <label className=" text-product-dark w-full dark:bg-gray-800 dark:text-gray-400">
                                        <div className="block">
                                          <div className="w-full text-lg font-semibold">
                                            {address.name} {address.lastname}
                                          </div>

                                          <div className="text-md w-full">
                                            {address.address}, {address.city},{" "}
                                            {address.state}, {address.zipcode},{" "}
                                            {address.country}
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                  );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex w-full items-center justify-center md:items-start md:justify-start">
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
  );
}

export async function getServerSideProps(ctx: any) {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: ROUTE_SIGNIN,
        permanent: false,
      },
    };

  const { data: userData, error: usersError } = await supabase
    .from("users")
    .select(`*, shipping_info(*), billing_info(*)`)
    .eq("id", session.user.id);

  if (usersError) throw usersError;
  if (!userData) return { props: {} };

  return {
    props: {
      shippingAddresses: userData[0]?.shipping_info ?? [],
      billingAddresses: userData[0]?.billing_info ?? [],
    },
  };
}
