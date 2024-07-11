'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import DeliveryError from '../DeliveryError';
import CheckoutPackItem from './CheckoutPackItem';
import useFetchProductById from '../../../../../hooks/useFetchProductById';
import React, { ComponentProps, useEffect, useState } from 'react';
import { initShipmentLogic } from './shipmentLogic';
import { useLocale, useTranslations } from 'next-intl';
import { IProductPackCartItem } from '../../../../../lib/types/types';
import { useShoppingCart } from '../../../../context/ShoppingCartContext';
import { calculateFlatrateAndWeightShippingCost } from '../../../(roles)/distributor/actions';
import { calculateProductPacksWeight } from '../actions';
import Spinner from '../../../components/common/Spinner';

interface Props {
    productPack: IProductPackCartItem;
    selectedShippingAddress: string;
    handleDeliveryCost: ComponentProps<any>;
    isShippingCostLoading: boolean;
}

export function CheckoutItem({
    productPack,
    selectedShippingAddress,
    handleDeliveryCost,
    isShippingCostLoading,
}: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const { updateCartItem } = useShoppingCart();
    const [canDeliver, setCanDeliver] = useState(false);
    const [isLoadingDelivery, setIsLoadingDelivery] = useState(false);

    const {
        data: productWithInfo,
        isError,
        isLoading: isLoadingProduct,
        refetch,
    } = useFetchProductById(productPack.product_id);

    useEffect(() => {
        refetch();
    }, []);

    // If we pick an address -> Check if the product is available for shipping to that address
    // useEffect(() => {
    //     if (!productWithInfo || !selectedShippingAddress) return;

    //     setIsLoadingDelivery(true);

    //     const canDeliverFunction = async () => {
    //         const response: {
    //             can_deliver: boolean;
    //             distributor_id: string;
    //             distribution_costs_id: string;
    //             delivery_type: string;
    //             cost_extra_per_kg: number;
    //         } = await initShipmentLogic(
    //             selectedShippingAddress,
    //             productWithInfo.owner_id,
    //         );

    //         if (response.can_deliver) {
    //             // Dependiendo del tipo de entrega se debe de asociar el precio de envío al producto
    //             // llama a api de nextjs con deliveryType y distributor_id como parámetros
    //             const { distributor_id, distribution_costs_id, delivery_type } =
    //                 response;

    //             const totalWeight = await calculateProductPacksWeight(
    //                 productPack,
    //             );

    //             const shippingCost =
    //                 await calculateFlatrateAndWeightShippingCost(
    //                     distribution_costs_id,
    //                     totalWeight,
    //                     response.cost_extra_per_kg,
    //                 );

    //             handleDeliveryCost(shippingCost);

    //             // Flatrate cost
    //             // fetch(
    //             //     `/api/distribution_costs?distributor_id=${distributor_id}&delivery_type=${delivery_type}`,
    //             // )
    //             //     .then((res) => res.json())
    //             //     .then((orderItemCost: number) => {
    //             //         handleDeliveryCost(orderItemCost);
    //             //     });

    //             // Si el producto se puede enviar a la dirección seleccionada,
    //             // entonces vinculamos el pack del producto con el distribuidor que puede enviarlo
    //             // 1. Update the product in the cart with the distributor id
    //             const newProductPack: IProductPackCartItem = {
    //                 ...productPack,
    //                 distributor_id: response.distributor_id,
    //             };

    //             // 2. Update the product in the cart
    //             updateCartItem(newProductPack);
    //         } else {
    //             // Si el producto no se puede enviar, debe de mantenerse el distributor_id en ""
    //             // 1. Update the product in the cart with the distributor id
    //             const newProductPack: IProductPackCartItem = {
    //                 ...productPack,
    //                 distributor_id: '',
    //             };

    //             // 2. Update the product in the cart
    //             updateCartItem(newProductPack);
    //         }

    //         setCanDeliver(response.can_deliver);
    //         setIsLoadingDelivery(false);
    //     };

    //     canDeliverFunction();
    // }, [selectedShippingAddress]);

    if (isLoadingProduct || isLoadingDelivery) {
        const DynamicSpinner = dynamic(
            () => import('../../../components/common/Spinner'),
            {
                ssr: false,
            },
        );

        return <DynamicSpinner color={'beer-blonde'} size={'medium'} />;
    }

    if (isError) return <div className="text-center text-red-500">Error</div>;

    if (!productWithInfo) return null;

    return (
        <>
            <article
                className={`mt-4 space-y-4 
                     ${isShippingCostLoading ? 'pointer-events-none' : ''}`}
            >
                <Link href={`/products/${productWithInfo.id}`} locale={locale}>
                    <p className="space-x-2 text-xl">
                        <span className="font-semibold ">
                            {t('product_name')}:
                        </span>

                        <span className="hover:font-semibold hover:text-beer-gold">
                            {productPack.name}
                        </span>
                    </p>
                </Link>
                {/* 
                    {selectedShippingAddress && !canDeliver && (
                        <DeliveryError />
                    )} */}

                {productPack.packs.map((pack) => (
                    <div key={pack.id}>
                        <CheckoutPackItem
                            productPack={productPack}
                            productWithInfo={productWithInfo}
                            pack={pack}
                        />
                    </div>
                ))}
            </article>
        </>
    );
}
