import BOrderItem from './BusinessOrderItem';
import ProductBusinnesInformation from '@/app/[locale]/components/ProductBusinnesInformation';
import React from 'react';
import { IBusinessOrder, IOrderItem } from '@/lib/types/types';
import { StatusTimeline } from '@/app/[locale]/components/StatusTimeline';

interface Props {
    bOrder: IBusinessOrder;
}

export default function BusinessOrderDetails({ bOrder }: Props) {
    if (!bOrder.order_items || bOrder.order_items.length === 0) return <></>;

    return (
        <section className="relative border-separate space-y-8 rounded-lg border bg-beer-foam p-2">
            <StatusTimeline
                status={bOrder.status}
                orderType={'distributor_online'}
            />

            <section className="grid grid-cols-1 space-y-4 text-start sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
                {/* Display the product information for this pack  */}
                {bOrder.order_items && (
                    <ProductBusinnesInformation bOrder={bOrder} />
                )}

                {bOrder.order_items?.map((orderItem: IOrderItem) => {
                    return (
                        <section
                            key={
                                orderItem.business_order_id +
                                orderItem.product_pack_id
                            }
                            className="col-span-12"
                        >
                            <BOrderItem orderItem={orderItem} bOrder={bOrder} />
                        </section>
                    );
                })}
            </section>
        </section>
    );
}
