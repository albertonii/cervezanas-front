import React, { useState, useEffect } from "react";
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
import {
  BillingAddress,
  PaymentCard,
  ShippingAddress,
} from "../../lib/interfaces";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Button, CustomLoading } from "../../components/common";
import {
  CheckoutItem,
  NewBillingAddress,
  NewShippingAddress,
} from "../../components/checkout";
import { Layout } from "../../components";
import { useRouter } from "next/router";

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

  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<string>("");
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<string>("");

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
    try {
      // const cardInfo = getCardValues("card_info");
      const shippingInfoId = selectedShippingAddress;
      const billingInfoId = selectedBillingAddress;

      // const resultCardInfo = await triggerCard("card_info", {
      //   shouldFocus: true,
      // });
      const resultBillingInfoId = await triggerBilling("billing_info_id", {
        shouldFocus: true,
      });
      const resultShippingInfoId = await triggerShipping("shipping_info_id", {
        shouldFocus: true,
      });

      if (
        // resultCardInfo === false ||
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

      setLoadingPayment(true);

      const { data: shippingData, error: shippingInfoError } = await supabase
        .from("shipping_info")
        .insert({
          owner_id: user?.id,
          address: shippingInfo.address,
          address_extra: shippingInfo.address_extra,
          address_observations: shippingInfo.address_observations,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipcode: shippingInfo.zipcode,
          country: shippingInfo.country,
          name: shippingInfo.name,
          lastname: shippingInfo.lastname,
          document_id: shippingInfo.document_id,
          phone: shippingInfo.phone,
        })
        .select("id");

      if (shippingInfoError) throw shippingInfoError;

      const { data: billingData, error: billingInfoError } = await supabase
        .from("billing_info")
        .insert({
          owner_id: user?.id,
          address: billingInfo.address,
          city: billingInfo.city,
          state: billingInfo.state,
          zipcode: billingInfo.zipcode,
          country: billingInfo.country,
          name: billingInfo.name,
          lastname: billingInfo.lastname,
          document_id: billingInfo.document_id,
          phone: billingInfo.phone,
        })
        .select("id");

      if (billingInfoError) throw billingInfoError;

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
          shipping_info_id: shippingData[0].id,
          billing_info_id: billingData[0].id,
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

      router.push({
        pathname: `/checkout/success/${order?.[0].id}`,
      });

      setLoadingPayment(false);
    } catch (error) {
      setLoadingPayment(false);
      console.error("error", error);
    }
  };

  const handleOnClickShipping = (addressId: string) => {
    setSelectedShippingAddress(addressId);
  };

  const handleOnClickBilling = (addressId: string) => {
    setSelectedBillingAddress(addressId);
  };

  return (
    <Layout usePadding={true} useBackdrop={false}>
      <div className="flex flex-row items-center justify-center sm:my-2 lg:mx-6 ">
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
                              <li
                                key={address.id}
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
                              <li
                                key={address.id}
                                onClick={() => handleOnClickBilling(address.id)}
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

                    {/* For simplicity the payment is handled by bank Payment */}
                    {/*
                    <div className="border border-product-softBlonde flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
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
                            */}
                    {/* Card Number */}
                    {/*
                            <label className="flex flex-col items-start border-b border-gray-200 py-3 sm:items-center sm:flex-row my-3">
                              <span className="text-right px-2">
                                {t("card_number")}
                              </span>
                              <input
                                {...registerCard("card_info.card_number", {
                                  required: true,
                                  pattern: {
                                    value: /^[0-9]{16}$/,
                                    message: "Invalid card number",
                                  },
                                })}
                                className="focus:outline-none px-3 py-2 w-1/2 bg-product-softFoam rounded-sm"
                                placeholder={t("card_number_placeholder")!}
                                minLength={16}
                                maxLength={16}
                                min={0}
                                type="number"
                                required
                              />
                            </label>
                              */}

                    {/* Expiry Data and CVC GROUP */}
                    {/* <div className="flex flex-col items-start sm:items-center sm:flex-row justify-between my-3"> */}
                    {/* Expiry Data */}
                    {/*
                              <label className="flex flex-col items-start sm:items-center sm:flex-row border-b border-gray-200 py-3 my-3">
                                <span className="text-right px-2">
                                  {t("card_expiration")}
                                </span>

                                <div className="space-x-2">
                                  <input
                                    className="focus:outline-none px-3 py-2 w-16 md:w-20 bg-product-softFoam rounded-sm"
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
                                    placeholder={
                                      t("card_month_expiration_placeholder")!
                                    }
                                    maxLength={2}
                                    min={0}
                                    type="number"
                                    required
                                  />

                                  <span>/</span>

                                  <input
                                    className="focus:outline-none px-3 py-2 w-16 md:w-20 bg-product-softFoam rounded-sm"
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
                                    placeholder={
                                      t("card_year_expiration_placeholder")!
                                    }
                                    maxLength={2}
                                    size={2}
                                    min={0}
                                    type="number"
                                    required
                                  />
                                </div>
                              </label>
                                  */}

                    {/* CVC */}
                    {/*                               
                              <label className="flex flex-col items-start border-b border-gray-200 py-3 sm:items-center sm:flex-row my-3">
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
                                  className="focus:outline-none px-3 py-2 w-16 md:w-20 bg-product-softFoam rounded-sm"
                                  placeholder={t("card_cvv_placeholder")!}
                                  maxLength={3}
                                  size={3}
                                  min={0}
                                  type="number"
                                  required
                                />
                              </label>
                            </div> */}

                    {/* Name on Card */}
                    {/* <label className="flex flex-col items-start border-b border-gray-200 py-3 sm:items-center sm:flex-row my-3">
                              <span className="text-right px-2">
                                {t("card_holder")}
                              </span>
                              <input
                                {...registerCard("card_info.card_holder", {
                                  required: true,
                                  pattern: {
                                    value: /^[a-zA-Z ]{2,30}$/,
                                    message: "Invalid card holder",
                                  },
                                })}
                                className="focus:outline-none px-3 py-2 w-full bg-product-softFoam rounded-sm"
                                placeholder={t("card_holder_placeholder")!}
                                minLength={2}
                                maxLength={30}
                                required
                              />
                            </label>
                          </fieldset>
                        </section>
                      </div>
                    </div> */}
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
                                  if (address.id !== selectedShippingAddress)
                                    return <></>;
                                  return (
                                    <label
                                      key={address.id}
                                      className=" w-full text-product-dark 
                                           dark:text-gray-400 dark:bg-gray-800"
                                    >
                                      <div className="block">
                                        <div className="w-full text-lg font-semibold">
                                          {address.name} {address.lastname}
                                        </div>
                                        <div className="w-full text-md">
                                          {address.address}, {address.city},{" "}
                                          {address.state}, {address.zipcode},{" "}
                                          {address.country}
                                        </div>
                                      </div>
                                    </label>
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
                                  if (address.id !== selectedBillingAddress)
                                    return <></>;
                                  return (
                                    <label
                                      key={address.id}
                                      className=" w-full text-product-dark dark:text-gray-400 dark:bg-gray-800"
                                    >
                                      <div className="block">
                                        <div className="w-full text-lg font-semibold">
                                          {address.name} {address.lastname}
                                        </div>
                                        <div className="w-full text-md">
                                          {address.address}, {address.city},{" "}
                                          {address.state}, {address.zipcode},{" "}
                                          {address.country}
                                        </div>
                                      </div>
                                    </label>
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

// export async function getServerSideProps({ req }: any) {
//   const { user } = await supabase.auth.api.getUserByCookie(req);

//   let { data: userData, error: usersError } = await supabase
//     .from("users")
//     .select(`*, shipping_info(*), billing_info(*)`)
//     .eq("id", user?.id);
//   if (usersError) throw usersError;
//   if (!userData) return { props: {} };

//   return {
//     props: {
//       shippingAddresses: userData[0]?.shipping_info ?? [],
//       billingAddresses: userData[0]?.billing_info ?? [],
//     },
//   };
// }
