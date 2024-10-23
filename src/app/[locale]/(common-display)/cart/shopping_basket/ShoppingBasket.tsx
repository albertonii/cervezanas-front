'use client';

import '@fortawesome/fontawesome-svg-core/styles.css';
import Decimal from 'decimal.js';
import PromotionCode from './PromotionCode';
import ShoppingBasketItems from './ShoppingBasketItems';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import ShippingBillingContainer from './ShippingBillingContainer';
import ShoppingBasketOrderSummary from './ShoppingBasketOrderSummary';
import React, { useState, useEffect, useRef } from 'react';
import { z, ZodType } from 'zod';
import { API_METHODS } from '@/constants';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { insertOnlineOrder } from '../actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDateForTPV } from '@/utils/formatDate';
import { useMutation, useQueryClient } from 'react-query';
import { randomTransactionId, CURRENCIES } from 'redsys-easy';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { IProductPackCartItem, IUserTable } from '@/lib//types/types';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { CustomLoading } from '@/app/[locale]/components/ui/CustomLoading';
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
    const { handleMessage } = useMessage();

    const {
        subtotal,
        items,
        handleUndeliverableItems,
        calculateShippingCostCartContext,
        selectedBillingAddress,
        selectedShippingAddress,
        defaultBillingAddress,
        defaultShippingAddress,
        updateCanMakeThePayment,
        updateNeedsToCheckDelivery,
        discountAmount,
        discountCode,
    } = useShoppingCart();

    // const formRef = useRef<HTMLFormElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const [deliveryCost, setDeliveryCost] = useState(0);
    const [total, setTotal] = useState(0);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [merchantParameters, setMerchantParameters] = useState('');
    const [merchantSignature, setMerchantSignature] = useState('');
    const [shoppingItems, setShoppingItems] = useState<IProductPackCartItem[]>(
        [],
    );
    const [canMakeThePaymentResponse, setCanMakeThePaymentResponse] =
        useState(false);

    const [isShippingCostLoading, setIsShippingCostLoading] = useState(false);

    const formShipping = useForm<FormShippingData>({
        resolver: zodResolver(schemaShipping),
        defaultValues: {
            shipping_info_id: defaultShippingAddress?.id,
        },
    });

    const { trigger: triggerShipping } = formShipping;

    const formBilling = useForm<FormBillingData>({
        resolver: zodResolver(schemaBilling),
        defaultValues: {
            billing_info_id: defaultBillingAddress?.id,
        },
    });

    const { trigger: triggerBilling } = formBilling;

    const queryClient = useQueryClient();

    useEffect(() => {
        let subtotal = 0;
        items.forEach((item) => {
            item.packs.forEach((pack) => {
                subtotal += pack.price * pack.quantity;
            });
        });

        setTotal(subtotal + deliveryCost - discountAmount);
    }, [items, deliveryCost, subtotal, discountAmount]);

    useEffect(() => {
        setCanMakeThePaymentResponse(false);
        setDeliveryCost(0);
    }, [selectedShippingAddress]);

    useEffect(() => {
        // Check if the cart is deliverable
        const isDeliverable =
            items.length > 0 &&
            selectedBillingAddress?.id !== undefined &&
            selectedShippingAddress?.id !== undefined &&
            canMakeThePaymentResponse === true;

        updateCanMakeThePayment(isDeliverable);
    }, [
        items,
        selectedShippingAddress,
        selectedBillingAddress,
        canMakeThePaymentResponse,
    ]);

    const checkForm = async () => {
        const resultBillingInfoId = await triggerBilling('billing_info_id', {
            shouldFocus: true,
        });

        const resultShippingInfoId = await triggerShipping('shipping_info_id', {
            shouldFocus: true,
        });

        if (resultBillingInfoId === false || resultShippingInfoId === false)
            return;

        return true;
    };

    const handleProceedToPay = async () => {
        if (!(await checkForm())) return;

        setLoadingPayment(true);

        try {
            const orderNumber = await proceedPaymentRedsys();
            handleInsertOrder(orderNumber);
            queryClient.invalidateQueries('orders');
            btnRef.current && btnRef.current.click();

            setLoadingPayment(false);
        } catch (error) {
            console.error(error);
            setLoadingPayment(false);
        }
    };

    const handleInsertOrder = async (orderNumber: string) => {
        if (selectedShippingAddress === undefined) {
            handleMessage({
                type: 'error',
                message: 'errors.select_shipping_address',
            });
            return;
        }

        if (selectedBillingAddress === undefined) {
            handleMessage({
                type: 'error',
                message: 'errors.select_billing_address',
            });
            return;
        }

        const order = {
            user_id: user?.id,
            name: user?.name,
            lastname: user?.lastname,
            total: total,
            subtotal: subtotal,
            delivery_cost: deliveryCost,
            currency: 'EUR',
            order_number: orderNumber,
            type: 'online',
            tax: 0,
            items: shoppingItems,
            shipping_name: selectedShippingAddress.name,
            shipping_lastname: selectedShippingAddress.lastname,
            shipping_document_id: selectedShippingAddress.document_id,
            shipping_phone: selectedShippingAddress.phone,
            shipping_address: selectedShippingAddress.address,
            shipping_address_extra: selectedShippingAddress.address_extra,
            shipping_country: selectedShippingAddress.country,
            shipping_region: selectedShippingAddress.region,
            shipping_sub_region: selectedShippingAddress.sub_region,
            shipping_city: selectedShippingAddress.city,
            shipping_zipcode: selectedShippingAddress.zipcode,
            billing_name: selectedBillingAddress.name,
            billing_lastname: selectedBillingAddress.lastname,
            billing_document_id: selectedBillingAddress.document_id,
            billing_phone: selectedBillingAddress.phone,
            billing_address: selectedBillingAddress.address,
            billing_country: selectedBillingAddress.country,
            billing_region: selectedBillingAddress.region,
            billing_sub_region: selectedBillingAddress.sub_region,
            billing_city: selectedBillingAddress.city,
            billing_zipcode: selectedBillingAddress.zipcode,
            billing_is_company: selectedBillingAddress.is_company,
            discount: discountAmount,
            discount_code: discountCode || 'none',
        };

        await insertOnlineOrder(order).catch((error) => {
            console.error(error);
            handleMessage({
                type: 'error',
                message: 'errors.inserting_order',
            });
        });
    };

    const checkIfCanMakeShipment = async () => {
        if (!selectedShippingAddress) return;

        setIsShippingCostLoading(true);

        const cheapestShippingCostByDistributor =
            await calculateShippingCostCartContext(selectedShippingAddress.id);

        if (cheapestShippingCostByDistributor) {
            const totalShippingCost = Object.values(
                cheapestShippingCostByDistributor,
            ).reduce((acc, { shippingCost }) => {
                if (shippingCost === null) return acc;
                return acc + shippingCost;
            }, 0);

            const newShoppingItems = Object.values(
                cheapestShippingCostByDistributor,
            )
                .map(({ items }) => items)
                .flat();

            setShoppingItems(newShoppingItems);

            // Obtener listado de elementos que no se pueden enviar - Son aquellos donde el shippingCost es null para el productor
            const undeliverableItems_: {
                items: IProductPackCartItem[];
                shippingCost: number;
                distributor_id: string;
            }[] = Object.values(cheapestShippingCostByDistributor).filter(
                ({ shippingCost }) => shippingCost === null,
            );

            const undeliverableItemsFlat: IProductPackCartItem[] =
                undeliverableItems_.map(({ items }) => items).flat();

            handleUndeliverableItems(undeliverableItemsFlat);

            setDeliveryCost(totalShippingCost);

            // Si existe algún producto que no se puede enviar, no se puede hacer el pago
            if (undeliverableItemsFlat.length > 0) {
                setCanMakeThePaymentResponse(false);
            } else {
                setCanMakeThePaymentResponse(true);
            }
        }

        setIsShippingCostLoading(false);
        updateNeedsToCheckDelivery(false);
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
            ...merchantInfo,
            // ...merchant_EMV3DS,
            DS_MERCHANT_AMOUNT: redsysAmount,
            DS_MERCHANT_CURRENCY: redsysCurrency,
            DS_MERCHANT_ORDER: orderNumber,
        });

        setMerchantParameters(form.body.Ds_MerchantParameters);
        setMerchantSignature(form.body.Ds_Signature);

        return orderNumber;
    };

    const handlePaymentMutation = useMutation({
        mutationKey: ['insertOrder'],
        mutationFn: handleProceedToPay,
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit = async () => {
        try {
            handlePaymentMutation.mutate();
        } catch (e) {
            console.error(e);
        }
    };

    if (!user) return <Spinner color="beer-blonde" size="medium" />;

    return (
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
                            <ShoppingBasketItems
                                items={items}
                                subtotal={subtotal}
                                isShippingCostLoading={isShippingCostLoading}
                            />

                            {/* Shipping & Billing Container */}
                            <ShippingBillingContainer
                                formShipping={formShipping}
                                formBilling={formBilling}
                            />

                            {/* Promotion Code  */}
                            <PromotionCode />

                            {/* <CarrierDetails /> */}
                        </div>

                        {/* Order summary */}
                        <ShoppingBasketOrderSummary
                            subtotal={subtotal}
                            deliveryCost={deliveryCost}
                            total={total}
                            checkCanDeliveryToAddress={checkIfCanMakeShipment}
                            onSubmit={onSubmit}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
