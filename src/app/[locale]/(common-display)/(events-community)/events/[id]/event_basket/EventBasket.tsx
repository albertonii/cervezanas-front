'use client';

import '@fortawesome/fontawesome-svg-core/styles.css';

import Decimal from 'decimal.js';
import EventBasketItems from './EventBasketItems';
import EventOrderSummary from './EventOrderSummary';
import Title from '@/app/[locale]/components/ui/Title';
import useEventCartStore from '@/app/store/eventCartStore';
import React, { useState, useEffect, useRef } from 'react';
import { API_METHODS } from '@/constants';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { CURRENCY_ENUM } from '@/lib/enums';
import { IProductPack } from '@/lib/types/types';
import { formatDateForTPV } from '@/utils/formatDate';
import { useMutation, useQueryClient } from 'react-query';
import { randomTransactionId, CURRENCIES } from 'redsys-easy';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { CustomLoading } from '@/app/[locale]/components/ui/CustomLoading';
import {
    createRedirectForm,
    eventMerchantInfo,
} from '@/app/[locale]/components/TPV/redsysClient';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface Props {
    eventId: string;
}

export default function EventBasket({ eventId }: Props) {
    const t = useTranslations();
    const { handleMessage } = useMessage();

    const { user } = useAuth();
    const router = useRouter();
    const locale = useLocale();

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

        let calculatedSubtotal = 0;
        eventCarts[eventId].forEach((item) => {
            item.packs.forEach((pack: IProductPack) => {
                calculatedSubtotal += pack.price * pack.quantity;
            });
        });

        setSubtotal(calculatedSubtotal);
        setTotal(calculatedSubtotal - discount + tax);

        return () => {
            setSubtotal(0);
            setTax(0);
            setDiscount(0);
            setTotal(0);
        };
    }, [eventCarts[eventId], discount, tax]);

    // Función para crear el pedido a través de la API
    const createOrder = async (orderData: any) => {
        const url = `${baseUrl}/api/event_shopping_basket/event_order`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error creating order');
        }

        const data = await response.json();
        return data;
    };

    const handleProceedToPay = async (paymentMethod: 'online' | 'on-site') => {
        setLoadingPayment(true);

        try {
            const orderNumber = randomTransactionId();

            if (paymentMethod === 'online') {
                await proceedPaymentRedsys(orderNumber);
            }

            // Preparar los datos para la API
            const orderData = {
                userId: user?.id,
                eventId,
                total,
                subtotal,
                discount,
                tax,
                currency: CURRENCY_ENUM.EUR,
                orderNumber,
                paymentMethod,
                cartItems: eventCarts[eventId],
            };

            // Crear el pedido a través de la API
            const orderInfo: { orderId: string; orderNumber: string } =
                await createOrder(orderData);

            if (paymentMethod === 'online') {
                // Si es pago en línea, continuar con el flujo de redirección a TPV
                setIsFormReady(true);
            } else {
                // Si es pago en local, mostrar mensaje de éxito
                setLoadingPayment(false);
                handleMessage({
                    message: t('event.order_created_pending_payment'),
                    type: 'success',
                });

                clearCart(eventId);

                router.push(
                    `/${locale}/checkout/event/success/in_site_payment?order_number=${orderInfo.orderNumber}`,
                );
            }

            queryClient.invalidateQueries('eventOrders');
        } catch (error: any) {
            console.error(error);
            handleMessage({
                message: error.message || t('errors.error_processing_order'),
                type: 'error',
            });
            setLoadingPayment(false);
        }
    };

    // REDSYS PAYMENT
    const proceedPaymentRedsys = async (orderNumber: string) => {
        // Nunca uses floats para dinero
        const totalAmount = total;
        const currency = CURRENCY_ENUM.EUR;

        const currencyInfo = CURRENCIES[currency];

        // Convertir 49.99€ -> 4999
        const redsysAmount = new Decimal(totalAmount)
            .mul(Math.pow(10, currencyInfo.decimals))
            .round()
            .toFixed(0);

        // Convertir EUR -> 978
        const redsysCurrency = currencyInfo.num;

        // Información EMV3DS opcional del MERCHANT
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
            handleMessage({
                message: error.message || t('error_processing_order'),
                type: 'error',
            });
            setLoadingPayment(false);
        },
    });

    const onSubmit = (paymentMethod: 'online' | 'on-site') => {
        try {
            insertOrderMutation.mutate(paymentMethod);
        } catch (e) {
            console.error(e);
            handleMessage({
                message: t('error'),
                type: 'error',
            });
        }
    };

    useEffect(() => {
        if (isFormReady) {
            formRef.current?.submit();
        }
    }, [isFormReady, merchantParameters, merchantSignature]);

    return (
        <section className="flex w-full flex-row items-center justify-center sm:my-2">
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
                <div className="container sm:py-4 p-2 lg:p-6">
                    <div className="flex items-center justify-start space-x-2 space-y-2">
                        <header className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-beer-blonde font-['NexaRust-script']">
                            <Title size="xlarge" color="beer-blonde">
                                {t('checkout')}
                            </Title>
                        </header>
                    </div>

                    <div
                        className={`
                                justify-center mt-2 flex w-full flex-col items-stretch space-y-4 md:space-y-6 xl:flex-row xl:space-x-8 xl:space-y-0
                            `}
                    >
                        {/* Productos */}
                        <div className="flex w-full flex-col items-start justify-start space-y-4 md:space-y-6 xl:space-y-8 ">
                            {/* Carrito del Cliente */}
                            <EventBasketItems
                                eventId={eventId}
                                subtotal={subtotal}
                            />
                        </div>

                        {/* Resumen del Pedido */}
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
