import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import { useShoppingCart } from '../../../../context/ShoppingCartContext';
import { CheckoutItem } from './CheckoutItem';
import { calculateShippingCosts } from '../actions';

interface Props {
    selectedShippingAddress: string;
    handleDeliveryCost: (deliveryCost: number) => void;
    subtotal: number;
}

const OrderItems = ({
    selectedShippingAddress,
    handleDeliveryCost,
    subtotal,
}: Props) => {
    const t = useTranslations();

    const { items } = useShoppingCart();

    useEffect(() => {
        if (!selectedShippingAddress) return;

        // Obtener información de envío
        calculateShippingCosts(items, selectedShippingAddress, 100);

        // Debemos de saber quienes serán los distribuidores encargados de enviar los productos
        // Obtener el listado de los distribuidores que tienen contrato vinculante con el productor encargado de la venta del producto para cada item
        // Una vez obtenido este listado,

        return () => {};
    }, [selectedShippingAddress]);

    return (
        <div className="w-full">
            {items.map((productPack) => (
                <div key={productPack.id}>
                    {/* <CheckoutItem
                        productPack={productPack}
                        selectedShippingAddress={selectedShippingAddress}
                        handleDeliveryCost={handleDeliveryCost}
                    /> */}
                </div>
            ))}

            {/* Subtotal */}
            <div className="mt-4 flex w-full flex-row items-center justify-between">
                <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-2xl text-gray-500">
                        {t('subtotal')}
                        <span className="ml-6 font-semibold text-gray-800">
                            {formatCurrency(subtotal)}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderItems;
