import ProducerCard from '../cards/ProducerCard';
import DistributorCard from '../cards/DistributorCard';
import OrderItemCard from '@/app/[locale]/components/common/OrderItemCard';
import ConsumerShipmentTrackingInformation from './ConsumerShipmentTrackingInformation';
import ProductBusinnesInformation from '@/app/[locale]/components/ProductBusinnesInformation';
import OrderItemReview from '../../(roles)/consumer/profile/online_orders/checkout/success/OrderItemReview';
import React from 'react';
import { IBusinessOrder, IOrderItem } from '@/lib/types/types';

interface Props {
    bOrder: IBusinessOrder;
}

export default function BusinessOrderItem({ bOrder }: Props) {
    if (!bOrder.order_items || bOrder.order_items.length === 0) return <></>;

    return (
        <section className="relative border-separate space-y-8 rounded-lg border bg-beer-foam p-2 py-4">
            <section className="grid grid-cols-1 gap-x-2 space-y-4 lg:grid-cols-2 md:gap-x-4 w-full">
                {/* Display the product information for this pack  */}
                {bOrder && (
                    <div className="col-span-2 grid grid-cols-2">
                        <ProductBusinnesInformation bOrder={bOrder} />

                        {bOrder.shipment_tracking && (
                            <ConsumerShipmentTrackingInformation
                                shipmentTracking={bOrder.shipment_tracking}
                            />
                        )}
                    </div>
                )}

                {bOrder.order_items?.map((orderItem: IOrderItem) => {
                    return (
                        <div
                            className="col-span-2 md:col-span-1"
                            key={
                                orderItem.business_order_id +
                                orderItem.product_pack_id
                            }
                        >
                            <OrderItemCard orderItem={orderItem} />

                            <OrderItemReview
                                orderItem={orderItem}
                                bOrder={bOrder}
                            />
                        </div>
                    );
                })}

                {/* Producer information data  */}
                {bOrder.producer_user && (
                    <div className="col-span-2 md:col-span-1">
                        <ProducerCard bOrder={bOrder} />
                    </div>
                )}

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
