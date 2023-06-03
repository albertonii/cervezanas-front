"use client";

import "@fortawesome/fontawesome-svg-core/styles.css";
import EmptyCart from "../shopping_basket/EmptyCart";
import Decimal from "decimal.js";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "../../../../components/common/Spinner";
import { IProduct } from "../../../../lib/types.d";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { useAuth } from "../../../../components/Auth/useAuth";
import { Button, CustomLoading } from "../../../../components/common";
import { randomTransactionId, CURRENCIES } from "redsys-easy";
import {
  createRedirectForm,
  eventMerchantInfo,
} from "../../../../components/TPV";
import { useSupabase } from "../../../../components/Context/SupabaseProvider";
import { useEventCartContext } from "../../../../components/Context/EventCartContext";
import {
  EVENT_ORDER_ITEM_STATUS,
  EVENT_ORDER_STATUS,
  PAYMENT_METHOD,
} from "../../../../constants";
import { EventCheckoutItem } from "../../../../components/checkout/EventCheckoutItem";

export default function EventCheckout() {
  const t = useTranslations();

  const { user } = useAuth();
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
  const [loading, setLoading] = useState(false);
  const [merchantParameters, setMerchantParameters] = useState("");
  const [merchantSignature, setMerchantSignature] = useState("");

  const [cart, setCart] = useState<IProduct[]>([]);

  const { eventItems, marketplaceEventItems, clearCart } =
    useEventCartContext();

  useEffect(() => {
    const awaitProducts = async () => {
      const promises = eventItems.map(async (item) => {
        // Finds the product in the marketplaceItems array
        const product = marketplaceEventItems.find(
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
  }, [discount, eventItems, marketplaceEventItems, shipping, subtotal, tax]);

  const handleProceedToPay = async () => {
    setLoadingPayment(true);

    try {
      const orderNumber = await proceedPaymentRedsys();
      createOrder(orderNumber);
      setIsFormReady(true);
    } catch (error) {
      console.error(error);
      setLoadingPayment(false);
    }
  };

  const createOrder = async (orderNumber: string) => {
    const { data: order, error: orderError } = await supabase
      .from("event_orders")
      .insert({
        customer_id: user?.id,
        status: EVENT_ORDER_STATUS.ORDER_PLACED,
        updated_at: new Date().toISOString(),
        // event_id: "123456789",
        payment_method: PAYMENT_METHOD.CREDIT_CARD,
        total: total,
        currency: "EUR",
        subtotal: subtotal,
        // discount: discount,
        // discount_code: "123456789",
        order_number: orderNumber,
      })
      .select("id");

    if (orderError) throw orderError;

    eventItems.map(async (item) => {
      const { error: orderItemError } = await supabase
        .from("event_order_items")
        .insert({
          order_id: order?.[0].id,
          product_id: item.id,
          quantity: item.quantity,
          status: EVENT_ORDER_ITEM_STATUS.INITIAL,
        });

      if (orderItemError) throw orderItemError;
    });

    clearCart();
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
      ...eventMerchantInfo,
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

  return (
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
          {loading ? (
            <Spinner color="product-blonde" size="medium" />
          ) : (
            <div className="container sm:py-4 lg:py-6">
              <div className="flex items-center justify-start space-x-2 space-y-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  {t("checkout")}
                </h1>
              </div>

              <div className="jusitfy-center mt-10 flex w-full flex-col items-stretch space-y-4 md:space-y-6 xl:flex-row xl:space-x-8 xl:space-y-0">
                {/* Products  */}
                <div className="flex w-full flex-col items-start justify-start space-y-4 md:space-y-6 xl:space-y-8 ">
                  {/* Customer's Car */}
                  <div className="border-product-softBlonde flex w-[30vw] flex-col items-start justify-start border bg-gray-50 px-4 py-4 dark:bg-gray-800 sm:w-full md:p-6 md:py-6 xl:p-8">
                    <p className="text-md font-semibold leading-6 text-gray-800 dark:text-white sm:text-lg md:text-xl xl:leading-5">
                      {t("customer_s_cart")}
                    </p>
                    {cart.length > 0 ? (
                      <div className="w-full">
                        {cart.map((product) => {
                          return (
                            <div key={product.id}>
                              <EventCheckoutItem product={product} />
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
                            <p className="flex flex-col text-base leading-4 text-gray-800 dark:text-white">
                              {t("discount")}
                              {/* <span className="mt-1 bg-gray-200 p-1 text-xs font-medium leading-3 text-gray-800 dark:bg-white dark:text-gray-800">
                                STUDENT
                              </span> */}
                            </p>
                            <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                              {formatCurrency(discount)} {discount / subtotal}%
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
