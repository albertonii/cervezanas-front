"use client";

import "@fortawesome/fontawesome-svg-core/styles.css";
import Decimal from "decimal.js";
import EmptyCart from "./EmptyCart";
import ShippingAddressItem from "./ShippingAddressItemInfo";
import ShippingBillingContainer from "./ShippingBillingContainer";
import useFetchShippingByOwnerId from "../../../../hooks/useFetchShippingByOwnerId";
import useFetchBillingByOwnerId from "../../../../hooks/useFetchBillingByOwnerId";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useShoppingCart } from "../../../../components/Context/ShoppingCartContext";
import { Spinner } from "../../../../components/common/Spinner";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../../../components/Auth/useAuth";
import { useForm } from "react-hook-form";
import { Button, CustomLoading } from "../../../../components/common";
import { CheckoutItem } from "../../../../components/checkout";
import { randomTransactionId, CURRENCIES } from "redsys-easy";
import { createRedirectForm, merchantInfo } from "../../../../components/TPV";
import { useSupabase } from "../../../../components/Context/SupabaseProvider";
import { MARKETPLACE_ORDER_STATUS } from "../../../../constants";
import { useMutation, useQueryClient } from "react-query";

interface FormShippingData {
  shipping_info_id: string;
}

interface FormBillingData {
  billing_info_id: string;
}

export function ShoppingBasket() {
  const t = useTranslations();

  const { user, isLoading } = useAuth();
  const { supabase } = useSupabase();

  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(subtotal - discount + shipping + tax);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);
  const [merchantParameters, setMerchantParameters] = useState("");
  const [merchantSignature, setMerchantSignature] = useState("");
  const [selectedShippingAddress, setSelectedShippingAddress] = useState("");
  const [selectedBillingAddress, setSelectedBillingAddress] = useState("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    data: shippingAddresses,
    error: shippingAddressesError,
    isLoading: shippingAddressesLoading,
  } = useFetchShippingByOwnerId(user?.id as string);

  const {
    data: billingAddresses,
    error: billingAddressesError,
    isLoading: billingAddressesLoading,
  } = useFetchBillingByOwnerId(user?.id as string);

  const formShipping = useForm<FormShippingData>();
  const { trigger: triggerShipping } = formShipping;

  const formBilling = useForm<FormBillingData>();
  const { trigger: triggerBilling } = formBilling;

  const { items: cart, clearCart } = useShoppingCart();
  const queryClient = useQueryClient();

  useEffect(() => {
    let subtotal = 0;
    cart.map((item) => {
      item.packs.map((pack) => {
        subtotal += pack.price * pack.quantity;
      });
    });

    setSubtotal(subtotal);
    setTotal(() => subtotal - discount + shipping + tax);

    return () => {
      setSubtotal(0);
      setShipping(0);
      setTax(0);
      setDiscount(0);
      setTotal(0);
    };
  }, [discount, cart, shipping, subtotal, tax]);

  useEffect(() => {
    if (isFormReady) {
      // Call submit form
      btnRef.current && btnRef.current.click();
    }
  }, [isFormReady]);

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

    const shippingInfo = shippingAddresses?.find(
      (address) => address.id === shippingInfoId
    );

    const billingInfo = billingAddresses?.find(
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
      handleInsertOrder(billingInfoId, shippingInfoId, orderNumber);
    } catch (error) {
      console.error(error);
      setLoadingPayment(false);
    }
  };

  const handleInsertOrder = async (
    billingInfoId: string,
    shippingInfoId: string,
    orderNumber: string
  ) => {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        owner_id: user?.id,
        total: total,
        customer_name: `${user?.name} ${user?.lastname}`,
        status: MARKETPLACE_ORDER_STATUS.ORDER_PLACED,
        tracking_id: "123456789",
        issue_date: new Date().toISOString(),
        estimated_date: new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24 * 3
        ).toISOString(), // 3 days
        payment_method: "credit_card",
        order_number: orderNumber,
        shipping_info: shippingInfoId,
        billing_info: billingInfoId,
        type: "online",
      })
      .select("id");

    if (orderError) throw orderError;

    cart.map((product) => {
      product.packs.map(async (pack) => {
        const { error: orderItemError } = await supabase
          .from("order_items")
          .insert({
            order_id: order?.[0].id,
            product_pack_id: pack.id,
            quantity: pack.quantity,
          });

        if (orderItemError) throw orderItemError;
      });
    });

    setIsFormReady(true);
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
      DS_MERCHANT_AMOUNT: redsysAmount,
      DS_MERCHANT_CURRENCY: redsysCurrency,
      DS_MERCHANT_ORDER: orderNumber,
    });

    setMerchantParameters(form.body.Ds_MerchantParameters);
    setMerchantSignature(form.body.Ds_Signature);

    return orderNumber;
  };

  const insertOrderMutation = useMutation({
    mutationKey: ["insertOrder"],
    mutationFn: handleProceedToPay,
    onMutate: () => setIsSubmitting(true),
    onSuccess: () => {
      queryClient.invalidateQueries("orders");
      setIsSubmitting(false);
      clearCart();
    },
    onError: (error: any) => {
      console.error(error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = () => {
    try {
      insertOrderMutation.mutate();
    } catch (e) {
      console.error(e);
    }
  };

  const handleOnClickShipping = (addressId: string) => {
    setSelectedShippingAddress(addressId);
  };

  const handleOnClickBilling = (addressId: string) => {
    setSelectedBillingAddress(addressId);
  };

  if (isLoading) return <Spinner color="beer-blonde" size="medium" />;

  return (
    <>
      {isLoading ? (
        <Spinner color="beer-blonde" size="medium" />
      ) : (
        <>
          <div className="flex w-full flex-row items-center justify-center sm:my-2 lg:mx-6 ">
            <form
              action={`${process.env.NEXT_PUBLIC_DS_TPV_URL}`}
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
                <div className="container sm:py-4 lg:py-6">
                  <div className="flex items-center justify-start space-x-2 space-y-2">
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

                      <div className="mt-4 text-sm tracking-wide text-gray-500 sm:ml-2 sm:mt-0">
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
                          <div className="w-full">
                            {cart.map((productPack) => {
                              return (
                                <div key={productPack.id}>
                                  <CheckoutItem productPack={productPack} />
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
                          </div>
                        ) : (
                          <>
                            <EmptyCart />
                          </>
                        )}
                      </div>

                      {/* Shipping & Billing Container */}
                      {shippingAddresses && billingAddresses && (
                        <ShippingBillingContainer
                          shippingAddresses={shippingAddresses}
                          billingAddresses={billingAddresses}
                          handleOnClickShipping={handleOnClickShipping}
                          handleOnClickBilling={handleOnClickBilling}
                          formShipping={formShipping}
                          formBilling={formBilling}
                          selectedShippingAddress={selectedShippingAddress}
                          selectedBillingAddress={selectedBillingAddress}
                        />
                      )}
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
                                  {/* <span className="bg-gray-200 p-1 text-xs font-medium leading-3 text-gray-800 dark:bg-white dark:text-gray-800">
                                    STUDENT
                                  </span> */}
                                </p>
                                <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                                  {formatCurrency(discount)}{" "}
                                  {discount / subtotal}%
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

                            <div className="flex w-full items-start justify-between">
                              <div className="flex flex-col items-start">
                                <p className="text-base font-semibold leading-4 text-gray-800 dark:text-white">
                                  {t("total")}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
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
                                  onSubmit();
                                }}
                              >
                                {t("proceed_to_pay")}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Addresses */}
                        <div className="mt-6 flex flex-shrink-0 flex-col items-start justify-start space-y-6 pb-4 md:mt-0">
                          <div className="mb-6 flex w-full flex-col space-y-4 bg-gray-50 px-4 py-6 dark:bg-gray-800 md:p-6 xl:p-8">
                            <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                              {t("addresses")}
                            </h3>

                            <div className="flex flex-col items-start justify-start space-y-4 sm:items-center md:flex-col md:items-start md:justify-start md:space-y-3 lg:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-8">
                              <div className="flex flex-col items-start justify-center space-y-4 md:justify-start xl:mt-8">
                                <p className="text-center text-base font-semibold leading-4 text-gray-800 dark:text-white md:text-left">
                                  {t("shipping_address")}
                                </p>

                                <div className="w-48 text-center text-sm leading-5 text-gray-600 dark:text-gray-300 md:text-left lg:w-full xl:w-48">
                                  {shippingAddresses?.map((address) => {
                                    if (
                                      address.id === selectedShippingAddress
                                    ) {
                                      return (
                                        <div key={address.id}>
                                          <ShippingAddressItem
                                            address={address}
                                          />
                                        </div>
                                      );
                                    }
                                  })}
                                </div>
                              </div>

                              <div className="flex flex-col items-start justify-center space-y-4 md:justify-start">
                                <p className="text-center text-base font-semibold leading-4 text-gray-800 dark:text-white md:text-left">
                                  {t("billing_address")}
                                </p>

                                <div className="w-48 text-center text-sm leading-5 text-gray-600 dark:text-gray-300 md:text-left lg:w-full xl:w-48">
                                  {/* {billingAddresses?.map((address) => {
                                    if (address.id === selectedBillingAddress)
                                      return (
                                        <div key={address.id}>
                                          <BillingAddressItem
                                            address={address}
                                          />
                                        </div>
                                      );
                                  })} */}
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
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}