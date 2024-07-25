import OrderItemCard from '@/app/[locale]/components/common/OrderItemCard';
import DistributorCard from '@/app/[locale]/components/common/DistributorCard';
import ProductBusinnesInformation from '@/app/[locale]/components/ProductBusinnesInformation';
import React from 'react';
import { IBusinessOrder, IOrderItem } from '@/lib/types/types';
import { StatusTimeline } from '@/app/[locale]/components/StatusTimeline';

interface Props {
    bOrder: IBusinessOrder;
    setPackStatusArray: React.Dispatch<React.SetStateAction<string[]>>;
    index: number;
}

export default function BusinessOrderItem({ bOrder }: Props) {
    const orderItems = bOrder.order_items;

    if (!orderItems || orderItems.length === 0) return <></>;

    return (
        <section className="relative border-separate space-y-8 rounded-lg bg-beer-foam border p-2">
            <StatusTimeline
                status={bOrder.status}
                orderType={'distributor_online'}
            />

            <section className="grid grid-cols-1 gap-x-2 space-y-4 lg:grid-cols-2 md:gap-x-4 w-full">
                {/* Display the product information for this pack  */}
                {bOrder.order_items && (
                    <div className="col-span-2">
                        <ProductBusinnesInformation bOrder={bOrder} />
                    </div>
                )}

                {orderItems?.map((orderItem: IOrderItem) => (
                    <div
                        className="col-span-2 md:col-span-1"
                        key={
                            orderItem.business_order_id +
                            '-' +
                            orderItem.product_pack_id
                        }
                    >
                        <OrderItemCard orderItem={orderItem} />
                    </div>
                ))}

                {/* Distributor information data  */}
                {bOrder.distributor_user && (
                    <div className="col-span-2 md:col-span-1">
                        <DistributorCard bOrder={bOrder} />
                    </div>
                )}
            </section>
        </section>
    );
}
