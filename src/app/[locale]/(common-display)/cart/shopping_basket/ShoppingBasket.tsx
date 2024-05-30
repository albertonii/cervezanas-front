'use client';

import '@fortawesome/fontawesome-svg-core/styles.css';
import Decimal from 'decimal.js';
import EmptyCart from './EmptyCart';
import ShippingAddressItem from './ShippingAddressItemInfo';
import ShippingBillingContainer from './ShippingBillingContainer';
import useFetchShippingByOwnerId from '../../../../../hooks/useFetchShippingByOwnerId';
import useFetchBillingByOwnerId from '../../../../../hooks/useFetchBillingByOwnerId';
import Button from '../../../components/common/Button';
import React, { useState, useEffect, useRef } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { CheckoutItem } from './CheckoutItem';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { randomTransactionId, CURRENCIES } from 'redsys-easy';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import { CustomLoading } from '../../../components/common/CustomLoading';
import { API_METHODS, ONLINE_ORDER_STATUS } from '../../../../../constants';
import { useShoppingCart } from '../../../../context/ShoppingCartContext';
import {
    createRedirectForm,
    merchantInfo,
} from '../../../components/TPV/redsysClient';
import BillingAddressItem from './BillingAddressItemInfo';
import Spinner from '../../../components/common/Spinner';
import { IUserTable } from '../../../../../lib/types/types';
import {
    ROUTE_BUSINESS_ORDERS,
    ROUTE_DISTRIBUTOR,
    ROUTE_ONLINE_ORDERS,
    ROUTE_PRODUCER,
    ROUTE_PROFILE,
} from '../../../../../config';
import { sendPushNotification } from '../../../../../lib/actions';
import { insertOnlineOrder } from '../actions';
import { useMessage } from '../../../components/message/useMessage';

// const DynamicSpinner = dynamic(
//     () => import('../../../components/common/Spinner'),
//     {
//         ssr: false,
//     },
// );

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

    const { isLoading, supabase } = useAuth();
    const { handleMessage } = useMessage();

    const { items, clearCart, checkIsShoppingCartDeliverable } =
        useShoppingCart();

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
        const canMakeThePayment =
            checkIsShoppingCartDeliverable() &&
            items.length > 0 &&
            selectedBillingAddress !== '' &&
            selectedShippingAddress !== '';

        setCanMakeThePayment(canMakeThePayment);
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
        };

        await insertOnlineOrder(object)
            .then((res) => {
                const orderId = res.message as string;

                // Estoy recorriendo todos los elementos del carrito de la compra,
                // aquellos que tengan un pack, los inserto en la tabla order_items
                // además, como son del mismo pack y del mismo producto, los agrupo
                // y asigno el mismo identificador de pedido para el negocio - business_order_id
                items.map((item) => {
                    item.packs.map(async (pack) => {
                        const distributorId = item.distributor_id;
                        const producerId = item.producer_id;

                        const {
                            data: businessOrder,
                            error: businessOrderError,
                        } = await supabase
                            .from('business_orders')
                            .insert({
                                order_id: orderId,
                                producer_id: producerId,
                                distributor_id: distributorId,
                            })
                            .select('id')
                            .single();

                        if (businessOrderError) throw businessOrderError;

                        const { error: orderItemError } = await supabase
                            .from('order_items')
                            .insert({
                                business_order_id: businessOrder.id,
                                product_pack_id: pack.id,
                                quantity: pack.quantity,
                                is_reviewed: false,
                            });

                        pack.products?.owner_id;

                        if (orderItemError) throw orderItemError;

                        // Notification to distributor
                        const distributorMessage = `Tienes un nuevo pedido online de ${user?.name} ${user?.lastname} con número de pedido ${orderNumber} con identificador de negocio ${businessOrder.id}`;
                        const distributorLink = `${ROUTE_DISTRIBUTOR}${ROUTE_PROFILE}${ROUTE_BUSINESS_ORDERS}`;

                        sendPushNotification(
                            distributorId,
                            distributorMessage,
                            distributorLink,
                        );

                        // Notification to producer
                        const producerMessage = `Tienes un nuevo pedido online de ${user?.name} ${user?.lastname} con número de pedido ${orderNumber} con identificador de negocio ${businessOrder.id}`;
                        const producerLink = `${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_ONLINE_ORDERS}`;

                        sendPushNotification(
                            producerId,
                            producerMessage,
                            producerLink,
                        );
                    });
                });

                setIsFormReady(true);
            })
            .catch((error) => {
                console.error(error);

                handleMessage({
                    type: 'error',
                    message: t('error_creating_order'),
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

    if (isLoading) return <Spinner color="beer-blonde" size="medium" />;

    return (
        <>
            <section className="flex w-full flex-row items-center justify-center sm:my-2 ">
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
                    <>
                        <section className="container sm:py-4 lg:py-6">
                            <div className="flex items-center justify-start space-x-2 space-y-2">
                                <header className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
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

                            <section className="jusitfy-center mt-10 flex w-full flex-col items-stretch space-y-4 md:space-y-6 xl:flex-row xl:space-x-8 xl:space-y-0">
                                {/* Products  */}
                                <div className="flex w-full flex-col items-start justify-start space-y-4 md:space-y-6 xl:space-y-8 ">
                                    {/* Customer's Cart */}
                                    <div className="border-product-softBlonde flex w-full flex-col items-start justify-start border bg-gray-50 px-4 py-4 dark:bg-gray-800 md:p-6 md:py-6 xl:p-8">
                                        <p className="text-lg font-semibold leading-6 text-gray-800 dark:text-white md:text-xl xl:leading-5">
                                            {t('customer_s_cart')}
                                        </p>

                                        {items.length > 0 ? (
                                            <section className="w-full">
                                                {items.map((productPack) => {
                                                    return (
                                                        <div
                                                            key={productPack.id}
                                                        >
                                                            <CheckoutItem
                                                                productPack={
                                                                    productPack
                                                                }
                                                                selectedShippingAddress={
                                                                    selectedShippingAddress
                                                                }
                                                                handleDeliveryCost={
                                                                    handleDeliveryCost
                                                                }
                                                            />
                                                        </div>
                                                    );
                                                })}

                                                {/* Subtotal */}
                                                <article className="mt-4 flex w-full flex-row items-center justify-between">
                                                    <div className="flex flex-col items-start justify-start space-y-2">
                                                        <p className="text-2xl text-gray-500">
                                                            {t('subtotal')}

                                                            <span className="ml-6 font-semibold text-gray-800">
                                                                {formatCurrency(
                                                                    subtotal,
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </article>
                                            </section>
                                        ) : (
                                            <>
                                                <EmptyCart />
                                            </>
                                        )}
                                    </div>

                                    {/* Shipping & Billing Container */}
                                    {shippingAddresses && billingAddresses && (
                                        <ShippingBillingContainer
                                            shippingAddresses={
                                                shippingAddresses
                                            }
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

                                {/* Order summary  */}
                                <section className="border-product-softBlonde flex w-full flex-col items-center justify-between gap-4 border bg-gray-50 px-4 py-6 dark:bg-gray-800 md:items-start md:p-6 xl:w-96 xl:p-8">
                                    <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                                        {t('customer')}
                                    </h3>

                                    <div className="flex h-full w-full flex-col items-stretch justify-start md:flex-col lg:space-x-8 xl:flex-col xl:space-x-0">
                                        {/* Summary */}
                                        <div className="flex flex-shrink-0 flex-col items-start justify-start">
                                            <div className="flex w-full flex-col space-y-6 bg-gray-50  dark:bg-gray-800">
                                                <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                                                    {t('summary')}
                                                </h3>

                                                <div className="flex w-full flex-col items-center justify-center space-y-6 border-b border-gray-200 pb-4">
                                                    <div className="flex w-full justify-between">
                                                        <p className="text-base leading-4 text-gray-800 dark:text-white">
                                                            {t('subtotal')}
                                                        </p>
                                                        <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                                                            {formatCurrency(
                                                                subtotal,
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="flex w-full items-center justify-between">
                                                        <p className="text-base leading-4 text-gray-800 dark:text-white">
                                                            {t('shipping')}
                                                        </p>
                                                        <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                                                            {formatCurrency(
                                                                deliveryCost,
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* taxes  */}
                                                    <div className="flex w-full items-center justify-between">
                                                        <p className="text-base leading-4 text-gray-800 dark:text-white">
                                                            {t('tax')}
                                                        </p>
                                                        <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                                                            {formatCurrency(
                                                                tax,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex w-full items-start justify-between">
                                                    <div className="flex flex-col items-start">
                                                        <p className="text-base font-semibold leading-4 text-gray-800 dark:text-white">
                                                            {t('total')}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            (
                                                            {t(
                                                                'with_taxes_included',
                                                            )}
                                                            )
                                                        </p>
                                                    </div>

                                                    <p className="text-base font-semibold leading-4 text-gray-600 dark:text-gray-300">
                                                        {formatCurrency(total)}
                                                    </p>
                                                </div>

                                                {/* Proceed to pay */}
                                                <div
                                                    className={`flex w-full items-center justify-center md:items-start md:justify-start`}
                                                >
                                                    <Button
                                                        large
                                                        primary
                                                        class={`font-semibold`}
                                                        title={''}
                                                        disabled={
                                                            !canMakeThePayment
                                                        }
                                                        onClick={() => {
                                                            onSubmit();
                                                        }}
                                                    >
                                                        {t('proceed_to_pay')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Addresses */}
                                        <div className="mt-6 flex flex-shrink-0 flex-col items-start justify-start space-y-6 pb-4 md:mt-0">
                                            <address className="mb-6 flex w-full flex-col space-y-4 bg-gray-50  py-6 dark:bg-gray-800">
                                                <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                                                    {t('addresses')}
                                                </h3>

                                                <div className="flex flex-col items-start justify-start space-y-4 sm:items-center md:flex-col md:items-start md:justify-start md:space-y-3 lg:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-8">
                                                    <div className="flex flex-col items-start justify-center space-y-4 md:justify-start xl:mt-8">
                                                        <p className="text-center text-base font-semibold leading-4 text-gray-800 dark:text-white md:text-left">
                                                            {t(
                                                                'shipping_address',
                                                            )}
                                                        </p>

                                                        <div className="w-48 text-center text-sm leading-5 text-gray-600 dark:text-gray-300 md:text-left lg:w-full xl:w-48">
                                                            {shippingAddresses?.map(
                                                                (address) => {
                                                                    if (
                                                                        address.id ===
                                                                        selectedShippingAddress
                                                                    ) {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    address.id
                                                                                }
                                                                            >
                                                                                <ShippingAddressItem
                                                                                    address={
                                                                                        address
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                },
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-start justify-center space-y-4 md:justify-start">
                                                        <p className="text-center text-base font-semibold leading-4 text-gray-800 dark:text-white md:text-left">
                                                            {t(
                                                                'billing_address',
                                                            )}
                                                        </p>

                                                        <div className="w-48 text-center text-sm leading-5 text-gray-600 dark:text-gray-300 md:text-left lg:w-full xl:w-48">
                                                            {billingAddresses?.map(
                                                                (address) => {
                                                                    if (
                                                                        address.id ===
                                                                        selectedBillingAddress
                                                                    )
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    address.id
                                                                                }
                                                                            >
                                                                                <BillingAddressItem
                                                                                    address={
                                                                                        address
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex w-full items-center justify-center md:items-start md:justify-start">
                                                    <Button
                                                        xLarge
                                                        accent
                                                        class="font-semibold"
                                                        title={'Edit Details'}
                                                    >
                                                        {t('edit_details')}
                                                    </Button>
                                                </div>
                                            </address>
                                        </div>
                                    </div>
                                </section>
                            </section>
                        </section>
                    </>
                )}
            </section>
        </>
    );
}
