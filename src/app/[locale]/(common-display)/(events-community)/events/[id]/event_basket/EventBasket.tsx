'use client';

import '@fortawesome/fontawesome-svg-core/styles.css';

import Decimal from 'decimal.js';
import EventBasketItems from './EventBasketItems';
import EventOrderSummary from './EventOrderSummary';
import Title from '@/app/[locale]/components/ui/Title';
import useEventCartStore from '@/app/store//eventCartStore';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { CURRENCY_ENUM } from '@/lib/enums';
import { formatDateForTPV } from '@/utils/formatDate';
import { useMutation, useQueryClient } from 'react-query';
import { randomTransactionId, CURRENCIES } from 'redsys-easy';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { CustomLoading } from '@/app/[locale]/components/ui/CustomLoading';
import { IProductPack, IProductPackEventCartItem } from '@/lib/types/types';
import {
    API_METHODS,
    EVENT_ORDER_CPS_STATUS,
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
    const { handleMessage } = useMessage();

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

    const { eventCarts } = useEventCartStore();
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
            queryClient.invalidateQueries('eventOrders');
        } catch (error) {
            console.error(error);
            setLoadingPayment(false);
        }
    };

    const handleInsertOrder = async (orderNumber: string) => {
        const { data: eventOrder, error: orderError } = await supabase
            .from('event_orders')
            .insert({
                customer_id: user?.id,
                updated_at: new Date().toISOString(),
                event_id: eventId,
                status: EVENT_ORDER_STATUS.ORDER_PLACED,
                total: total,
                subtotal: subtotal,
                currency: CURRENCY_ENUM.EUR,
                order_number: orderNumber,
                // discount: discount,
                // promo_code: "123456789",
            })
            .select('id')
            .single();

        if (orderError) throw orderError;

        // Insert event order information for the CP that is linked with the event.
        // First we need to agrupate all the event orders that with the same attribute cp_id
        const eventOrderCps = eventCarts[eventId].reduce(
            (
                acc: { [key: string]: IProductPackEventCartItem[] },
                item: IProductPackEventCartItem,
            ) => {
                if (!acc[item.cp_cps_id]) {
                    acc[item.cp_cps_id] = [];
                }
                acc[item.cp_cps_id].push(item);
                return acc;
            },
            {} as { [key: string]: IProductPackEventCartItem[] },
        );

        for (const cpCPSId in eventOrderCps) {
            const { data: eventOrderCp, error: eventOrderCpError } =
                await supabase
                    .from('event_order_cps')
                    .insert({
                        event_order_id: eventOrder?.id,
                        cp_id: cpCPSId,
                        status: EVENT_ORDER_CPS_STATUS.NOT_STARTED,
                        order_number: randomTransactionId(),
                    })
                    .select('id')
                    .single();

            if (eventOrderCpError) {
                handleMessage({
                    message: t('error'),
                    type: 'error',
                });

                return false;
            }

            if (!eventOrderCp) {
                handleMessage({
                    message: t('error'),
                    type: 'error',
                });

                return false;
            }

            for (const item of eventOrderCps[cpCPSId]) {
                for (const pack of item.packs) {
                    const { error: orderItemError } = await supabase
                        .from('event_order_items')
                        .insert({
                            event_order_cp_id: eventOrderCp.id,
                            product_pack_id: pack.id,
                            quantity: pack.quantity,
                            status: EVENT_ORDER_ITEM_STATUS.INITIAL,
                        });

                    if (orderItemError) throw orderItemError;
                }
            }
        }

        setIsFormReady(true);
    };

    // REDSYS PAYMENT
    const proceedPaymentRedsys = async () => {
        // Use productIds to calculate amount and currency
        const { totalAmount, currency } = {
            // Never use floats for money
            totalAmount: total,
            currency: CURRENCY_ENUM.EUR,
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

        // MERCHANT EMV3DS optional information
        const merchant_EMV3DS = {
            email: user.email,
            // homePhone: user.phone,
            // shipAddLines1: 'Calle de la Cerveza, 1',
            accInfo: {
                chAccChange: formatDateForTPV(user.updated_at),
                chAccDate: formatDateForTPV(user.created_at),
                // txnActivityYear: 2020,
            },
        };

        const form = createRedirectForm({
            ...eventMerchantInfo,
            // ...merchant_EMV3DS,
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
                                jusitfy-center mt-2 flex w-full flex-col items-stretch space-y-4 md:space-y-6 xl:flex-row xl:space-x-8 xl:space-y-0
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
