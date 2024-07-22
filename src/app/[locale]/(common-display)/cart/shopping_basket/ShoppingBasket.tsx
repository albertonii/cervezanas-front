'use client';

import '@fortawesome/fontawesome-svg-core/styles.css';
import Decimal from 'decimal.js';
import EmptyCart from './EmptyCart';
import Spinner from '@/app/[locale]/components/common/Spinner';
import React, { useState, useEffect, useRef } from 'react';
import ShippingBillingContainer from './ShippingBillingContainer';
import ShoppingBasketOrderSummary from './ShoppingBasketOrderSummary';
import useFetchBillingByOwnerId from '../../../../../hooks/useFetchBillingByOwnerId';
import useFetchShippingByOwnerId from '../../../../../hooks/useFetchShippingByOwnerId';
import OrderItems from './OrderItems';
import { z, ZodType } from 'zod';
import { API_METHODS } from '@/constants';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { insertOnlineOrder } from '../actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { randomTransactionId, CURRENCIES } from 'redsys-easy';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { IProductPackCartItem, IUserTable } from '@/lib//types/types';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { CustomLoading } from '@/app/[locale]/components/common/CustomLoading';
import {
    createRedirectForm,
    merchantInfo,
} from '@/app/[locale]/components/TPV/redsysClient';

export type FormShippingData = {
    shipping_info_id: string;
};

export type FormBillingData = {
    billing_info_id: string;
};

const schemaShipping: ZodType<FormShippingData> = z.object({
    shipping_info_id: z.string().nonempty({
        message: 'errors.input_required',
    }),
});

const schemaBilling: ZodType<FormBillingData> = z.object({
    billing_info_id: z.string().nonempty({
        message: 'errors.input_required',
    }),
});

export type ValidationSchemaShipping = z.infer<typeof schemaShipping>;
export type ValidationSchemaBilling = z.infer<typeof schemaBilling>;

interface Props {
    user: IUserTable;
}

export function ShoppingBasket({ user }: Props) {
    const t = useTranslations();

    const [isShippingCostLoading, setIsShippingCostLoading] = useState(false);

    const { handleMessage } = useMessage();

    const {
        items,
        handleUndeliverableItems,
        clearCart,
        calculateShippingCostCartContext,
    } = useShoppingCart();

    const formRef = useRef<HTMLFormElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const [tax, setTax] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [deliveryCost, setDeliveryCost] = useState(0);
    const [total, setTotal] = useState(0);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [isFormReady, setIsFormReady] = useState(false);
    const [merchantParameters, setMerchantParameters] = useState('');
    const [merchantSignature, setMerchantSignature] = useState('');
    const [selectedShippingAddress, setSelectedShippingAddress] = useState('');
    const [selectedBillingAddress, setSelectedBillingAddress] = useState('');

    const [canMakeThePayment, setCanMakeThePayment] = useState(false);

    const { data: shippingAddresses, error: shippingAddressesError } =
        useFetchShippingByOwnerId(user.id);

    const { data: billingAddresses, error: billingAddressesError } =
        useFetchBillingByOwnerId(user.id);

    if (billingAddressesError) {
        throw billingAddressesError;
    }

    if (shippingAddressesError) {
        throw shippingAddressesError;
    }

    const formShipping = useForm<FormShippingData>({
        resolver: zodResolver(schemaShipping),
    });
    const { trigger: triggerShipping } = formShipping;

    const formBilling = useForm<FormBillingData>({
        resolver: zodResolver(schemaBilling),
    });
    const { trigger: triggerBilling } = formBilling;

    const queryClient = useQueryClient();

    useEffect(() => {
        let subtotal = 0;
        items.map((item) => {
            item.packs.map((pack) => {
                subtotal += pack.price * pack.quantity;
            });
        });

        setSubtotal(subtotal);
        setTotal(() => subtotal + deliveryCost + tax);
    }, [items, deliveryCost, subtotal, tax]);

    useEffect(() => {
        if (isFormReady) {
            // Call submit form
            btnRef.current && btnRef.current.click();
        }
    }, [isFormReady]);

    useEffect(() => {
        // // Si se eliminan elementos del carrito y además coincide que son elementos en el listado de undeliverableItems
        // // Se debe de actualizar el listado de undeliverableItems
        // const undeliverableItems_ = undeliverableItems.filter(
        //     (item) => !items.find((cartItem) => cartItem.id === item.id),
        // );

        // setUndeliverableItems(undeliverableItems_);

        // Check if the cart is deliverable
        const isDeliverable =
            items.length > 0 &&
            selectedBillingAddress !== '' &&
            selectedShippingAddress !== '';
        // undeliverableItems_.length === 0;

        setCanMakeThePayment(isDeliverable);
    }, [items, selectedShippingAddress, selectedBillingAddress]);

    useEffect(() => {
        const handleShippingCost = async () => {
            setIsShippingCostLoading(true);

            const cheapestShippingCost = await calculateShippingCostCartContext(
                selectedShippingAddress,
            );

            if (cheapestShippingCost) {
                const shippingCostInformation: {
                    [producerId: string]: {
                        items: IProductPackCartItem[];
                        shippingCost: number;
                    };
                } = cheapestShippingCost;

                const totalShippingCost: number = Object.values(
                    shippingCostInformation,
                ).reduce((acc, { shippingCost }) => acc + shippingCost, 0);

                // Obtener listado de elementos que no se pueden enviar - Son aquellos donde el shippingCost es null para el productor
                const undeliverableItems_: {
                    items: IProductPackCartItem[];
                    shippingCost: number;
                }[] = Object.values(shippingCostInformation).filter(
                    ({ shippingCost }) => shippingCost === null,
                );

                const undeliverableItemsFlat: IProductPackCartItem[] =
                    undeliverableItems_.map(({ items }) => items).flat();

                console.log(undeliverableItemsFlat);

                handleUndeliverableItems(undeliverableItemsFlat);

                setDeliveryCost(totalShippingCost);
            }

            setIsShippingCostLoading(false);
        };

        handleShippingCost();
    }, [items, selectedShippingAddress, selectedBillingAddress]);

    const handleDeliveryCost = (deliveryCost: number) => {
        setDeliveryCost((prevCost) => prevCost + deliveryCost);
    };

    const checkForm = async () => {
        const shippingInfoId = selectedShippingAddress;
        const billingInfoId = selectedBillingAddress;

        const resultBillingInfoId = await triggerBilling('billing_info_id', {
            shouldFocus: true,
        });

        const resultShippingInfoId = await triggerShipping('shipping_info_id', {
            shouldFocus: true,
        });

        if (resultBillingInfoId === false || resultShippingInfoId === false)
            return;

        const shippingInfo = shippingAddresses?.find(
            (address) => address.id === shippingInfoId,
        );

        const billingInfo = billingAddresses?.find(
            (address) => address.id === billingInfoId,
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
            queryClient.invalidateQueries('orders');
            clearCart();
        } catch (error) {
            console.error(error);
            setLoadingPayment(false);
        }
    };

    const handleInsertOrder = async (
        billingInfoId: string,
        shippingInfoId: string,
        orderNumber: string,
    ) => {
        const object = {
            user_id: user?.id,
            name: user?.name,
            lastname: user?.lastname,
            total: total,
            subtotal: subtotal,
            delivery_cost: deliveryCost,
            discount: 0,
            discount_code: 'none',
            currency: 'EUR',
            order_number: orderNumber,
            type: 'online',
            tax: tax,
            shipping_info_id: shippingInfoId,
            billing_info_id: billingInfoId,
            items: items,
        };

        await insertOnlineOrder(object)
            .then(() => {
                setIsFormReady(true);
            })
            .catch((error) => {
                console.error(error);
                handleMessage({
                    type: 'error',
                    message: t('errors.inserting_order'),
                });
            });
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
        mutationKey: ['insertOrder'],
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

    const handleOnClickShipping = (addressId: string) => {
        setDeliveryCost(0);
        setSelectedShippingAddress(addressId);
    };

    const handleOnClickBilling = (addressId: string) => {
        setSelectedBillingAddress(addressId);
    };

    if (!user) return <Spinner color="beer-blonde" size="medium" />;

    return (
        <>
            <section className="relative flex w-full flex-col items-center justify-center sm:my-2">
                {isShippingCostLoading && (
                    <div className="z-50 w-full">
                        <div className="absolute w-full h-full bg-beer-blonde  opacity-10 animate-pulse "></div>
                        <Spinner
                            color="beer-blonde"
                            size="xxLarge"
                            absolutePosition="top"
                            absolute
                        />
                    </div>
                )}

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
                            <header className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-beer-blonde">
                                {t('checkout')}
                            </header>

                            <figure className="flex w-full flex-row items-center border-b pb-4 sm:w-auto sm:border-b-0 sm:pb-0">
                                <span className="h-10 w-10 text-yellow-500">
                                    <FontAwesomeIcon
                                        icon={faInfoCircle}
                                        style={{
                                            color: '#fdc300',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        title={'circle_warning'}
                                        width={25}
                                        height={25}
                                    />
                                </span>
                                <h3 className="mt-4 text-sm tracking-wide text-gray-500 sm:ml-2 sm:mt-0">
                                    {t('complete_shipping_billing')}
                                </h3>
                            </figure>
                        </div>

                        <div
                            className={`
                                jusitfy-center mt-10 flex w-full flex-col items-stretch space-y-4 md:space-y-6 xl:flex-row xl:space-x-8 xl:space-y-0
                            `}
                        >
                            {/* Products  */}
                            <div className="flex w-full flex-col items-start justify-start space-y-4 md:space-y-6 xl:space-y-8">
                                {/* Customer's Cart */}
                                <div className="border-product-softBlonde flex w-full flex-col items-start justify-start border bg-gray-50 px-4 py-4 dark:bg-gray-800 md:p-6 md:py-6 xl:p-8">
                                    <p className="text-lg font-semibold leading-6 text-gray-800 dark:text-white md:text-xl xl:leading-5">
                                        {t('customer_s_cart')}
                                    </p>

                                    {items.length > 0 ? (
                                        <OrderItems
                                            subtotal={subtotal}
                                            isShippingCostLoading={
                                                isShippingCostLoading
                                            }
                                        />
                                    ) : (
                                        <EmptyCart />
                                    )}
                                </div>

                                {/* Shipping & Billing Container */}
                                {shippingAddresses && billingAddresses && (
                                    <ShippingBillingContainer
                                        shippingAddresses={shippingAddresses}
                                        billingAddresses={billingAddresses}
                                        handleOnClickShipping={
                                            handleOnClickShipping
                                        }
                                        handleOnClickBilling={
                                            handleOnClickBilling
                                        }
                                        formShipping={formShipping}
                                        formBilling={formBilling}
                                        selectedShippingAddress={
                                            selectedShippingAddress
                                        }
                                        selectedBillingAddress={
                                            selectedBillingAddress
                                        }
                                    />
                                )}
                            </div>

                            {/* Order summary */}
                            {billingAddresses && shippingAddresses && (
                                <ShoppingBasketOrderSummary
                                    canMakeThePayment={canMakeThePayment}
                                    subtotal={subtotal}
                                    deliveryCost={deliveryCost}
                                    tax={tax}
                                    total={total}
                                    billingAddresses={billingAddresses}
                                    shippingAddresses={shippingAddresses}
                                    selectedBillingAddress={
                                        selectedBillingAddress
                                    }
                                    selectedShippingAddress={
                                        selectedShippingAddress
                                    }
                                    onSubmit={onSubmit}
                                />
                            )}
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
