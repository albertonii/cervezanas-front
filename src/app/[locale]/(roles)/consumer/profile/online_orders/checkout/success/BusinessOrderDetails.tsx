import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { IBusinessOrder, IOrderItem } from '@/lib/types/types';
import { StatusTimeline } from '@/app/[locale]/components/StatusTimeline';
import BOrderItem from './BOrderItem';

interface Props {
    bOrder: IBusinessOrder;
}

export default function BusinessOrderDetails({ bOrder }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    if (!bOrder.order_items || bOrder.order_items.length === 0) return <></>;

    const productName = bOrder.order_items[0].product_packs?.products?.name;
    const productDescription =
        bOrder.order_items[0].product_packs?.products?.description;

    return (
        <section className="relative border-separate space-y-8 rounded-lg border bg-beer-foam p-2">
            <StatusTimeline
                status={bOrder.status}
                orderType={'distributor_online'}
            />

            <section className="grid grid-cols-1 space-y-4 text-start sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
                {/* Display the product information for this pack  */}
                {bOrder.order_items && (
                    <div className="col-span-12">
                        <h3 className="text-xl font-medium text-gray-900 hover:text-beer-draft">
                            <Link
                                href={`/products/${bOrder.order_items[0].product_packs?.products?.id}`}
                                locale={locale}
                            >
                                {t('name')}: {productName}
                            </Link>
                        </h3>

                        <span className="space-y-1">
                            <p className="text-sm text-gray-500">
                                {t('description')}
                            </p>
                            <p className="truncate">{productDescription}</p>
                        </span>
                    </div>
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
