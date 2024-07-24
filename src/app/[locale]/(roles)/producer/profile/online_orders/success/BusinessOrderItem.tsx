import DisplayImageProduct from '@/app/[locale]/components/common/DisplayImageProduct';
import ProductBusinnesInformation from '@/app/[locale]/components/ProductBusinnesInformation';
import React from 'react';
import { SupabaseProps } from '@/constants';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import { IBusinessOrder, IOrderItem } from '@/lib/types/types';
import { StatusTimeline } from '@/app/[locale]/components/StatusTimeline';
import DistributorCard from '@/app/[locale]/components/DistributorCard';
import OrderItemCard from '@/app/[locale]/components/OrderItemCard';

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
    bOrder: IBusinessOrder;
    setPackStatusArray: React.Dispatch<React.SetStateAction<string[]>>;
    index: number;
}

export default function BusinessOrderItem({ bOrder }: Props) {
    const t = useTranslations();

    const orderItems = bOrder.order_items;
    console.log('ORDER ITEMS', orderItems);

    if (!orderItems || orderItems.length === 0) return <></>;

    return (
        <section className="relative border-separate space-y-8 rounded-lg  bg-beer-foam  border p-2">
            <StatusTimeline
                status={bOrder.status}
                orderType={'distributor_online'}
            />

            <section className="grid grid-cols-1 gap-x-2 space-y-4 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-2 lg:gap-x-4 w-full">
                {/* Display the product information for this pack  */}
                {bOrder.order_items && (
                    <div className="col-span-2">
                        <ProductBusinnesInformation bOrder={bOrder} />
                    </div>
                )}

                <div className="col-span-1">
                    {orderItems?.map((orderItem: IOrderItem) => (
                        <OrderItemCard orderItem={orderItem} />
                    ))}
                </div>

                {/* Distributor information data  */}
                <div className="col-span-1">
                    {bOrder.distributor_user && (
                        <DistributorCard bOrder={bOrder} />
                    )}
                </div>
            </section>
        </section>
    );
}
