'use client';

import '@fortawesome/fontawesome-svg-core/styles.css';

import Decimal from 'decimal.js';
import EventBasketItems from './EventBasketItems';
import EventOrderSummary from './EventOrderSummary';
import Title from '@/app/[locale]/components/ui/Title';
import useEventCartStore from '@/app/store//eventCartStore';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { IProductPack } from '@/lib/types/types';
import { useMutation, useQueryClient } from 'react-query';
import { randomTransactionId, CURRENCIES } from 'redsys-easy';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { CustomLoading } from '@/app/[locale]/components/ui/CustomLoading';
import {
    API_METHODS,
    EVENT_ORDER_ITEM_STATUS,
    EVENT_ORDER_STATUS,
} from '@/constants';
import {
    createRedirectForm,
    eventMerchantInfo,
} from '@/app/[locale]/components/TPV/redsysClient';

interface Props {
    eventId: string;
}

export default function EventBasket({ eventId }: Props) {
    const t = useTranslations();

    const { user, supabase } = useAuth();

    const formRef = useRef<HTMLFormElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(subtotal - discount + tax);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [isFormReady, setIsFormReady] = useState(false);
    const [merchantParameters, setMerchantParameters] = useState('');
    const [merchantSignature, setMerchantSignature] = useState('');

    const { eventCarts, clearCart } = useEventCartStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!eventCarts[eventId]) return;

        let subtotal = 0;
        eventCarts[eventId].map((item) => {
            item.packs.map((pack: IProductPack) => {
                subtotal += pack.price * pack.quantity;
            });
        });

        setSubtotal(subtotal);
        setTotal(() => subtotal - discount + tax);

        return () => {
            setSubtotal(0);
            setTax(0);
            setDiscount(0);
            setTotal(0);
        };
    }, [eventCarts[eventId], discount, subtotal, tax]);

    const handleProceedToPay = async () => {
        setLoadingPayment(true);

        try {
            const orderNumber = await proceedPaymentRedsys();
            handleInsertOrder(orderNumber);
        } catch (error) {
            console.error(error);
            setLoadingPayment(false);
        }
    };

    const handleInsertOrder = async (orderNumber: string) => {
        const { data: order, error: orderError } = await supabase
            .from('event_orders')
            .insert({
                customer_id: user?.id,
                status: EVENT_ORDER_STATUS.ORDER_PLACED,
                updated_at: new Date().toISOString(),
                event_id: eventId,
                order_number: orderNumber,
                total: total,
                currency: 'EUR',
                subtotal: subtotal,
                // discount: discount,
                // promo_code: "123456789",
                // payment_method: PAYMENT_METHOD.CREDIT_CARD,
            })
            .select('id')
            .single();

        if (orderError) throw orderError;

        eventCarts[eventId].map(async (item) => {
            item.packs.map(async (pack: IProductPack) => {
                const { error: orderItemError } = await supabase
                    .from('event_order_items')
                    .insert({
                        event_order_cp_id: order.id,
                        product_pack_id: pack.id,
                        quantity: pack.quantity,
                        status: EVENT_ORDER_ITEM_STATUS.INITIAL,
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
            currency: 'EUR',
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

    const insertOrderMutation = useMutation({
        mutationKey: ['insertEventOrder'],
        mutationFn: handleProceedToPay,
        onSuccess: () => {
            queryClient.invalidateQueries('eventOrders');
            clearCart(eventId);
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit = () => {
        try {
            insertOrderMutation.mutate();
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (isFormReady) {
            btnRef.current && btnRef.current.click();
        }
    }, [isFormReady]);

    return (
        <section className="flex w-full flex-row items-center justify-center sm:my-2 lg:mx-6 ">
            <form
                action={`${process.env.NEXT_PUBLIC_DS_TPV_URL}`}
                method={API_METHODS.POST}
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
                <CustomLoading message={`${t('loading')}`} />
            ) : (
                <div className="container sm:py-4 lg:py-6">
                    <div className="flex items-center justify-start space-x-2 space-y-2">
                        <header className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-beer-blonde font-['NexaRust-script']">
                            <Title size="xlarge" color="beer-blonde">
                                {t('checkout')}
                            </Title>
                        </header>
                    </div>

                    <div
                        className={`
                                jusitfy-center mt-10 flex w-full flex-col items-stretch space-y-4 md:space-y-6 xl:flex-row xl:space-x-8 xl:space-y-0
                            `}
                    >
                        {/* Products  */}
                        <div className="flex w-full flex-col items-start justify-start space-y-4 md:space-y-6 xl:space-y-8 ">
                            {/* Customer's Car */}
                            <EventBasketItems
                                eventId={eventId}
                                subtotal={subtotal}
                            />
                        </div>

                        {/* Order summary  */}
                        <EventOrderSummary
                            eventId={eventId}
                            subtotal={subtotal}
                            total={total}
                            onSubmit={onSubmit}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
