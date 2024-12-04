import EventCPOrderCard from './EventCPOrderCard';
import React from 'react';
import { Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SupabaseProps } from '@/constants';
import { useLocale, useTranslations } from 'next-intl';
import { IEventOrderCPS, IEventOrderItem } from '@/lib/types/eventOrders';
import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';

interface Props {
    eventOrderItem: IEventOrderItem;
    eventOrderCP: IEventOrderCPS;
    domain: string;
}

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export default function EventCPProductDetails({
    eventOrderCP,
    eventOrderItem,
    domain,
}: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const handleOnClick = (productId: string) => {
        router.push(`/${locale}/products/review/${productId}`);
    };

    const { product_packs } = eventOrderItem;

    if (!product_packs) return <></>;

    return (
        <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
                <Store className="w-6 h-6 text-beer-draft mr-2" />
                <div>
                    <Title
                        size="medium"
                        font="bold"
                        color="gray"
                        fontFamily="NexaRust-sans"
                    >
                        {eventOrderItem.event_order_cps?.cp_events?.cp?.cp_name}
                    </Title>
                    <Label size="medium" color="gray">
                        {eventOrderItem.event_order_cps?.cp_events?.cp?.address}
                    </Label>
                </div>
            </div>

            {eventOrderItem.event_order_cps && (
                <EventCPOrderCard order={eventOrderCP} />
            )}

            {/* <section className="grid grid-cols-1 space-x-4 space-y-4 text-start sm:grid-cols-2">
                <div className="col-span-12">
                    <h3 className="text-xl font-medium text-gray-900 hover:text-beer-draft">
                        <Link
                            href={`/products/${product_packs?.product_id}`}
                            locale={locale}
                        >
                            {t('name')}: {product_packs?.products?.name}
                        </Link>
                    </h3>

                    <span className="space-y-1">
                        <Label size="small" color="gray">
                            {t('description')}
                        </Label>
                        <Label className="truncate">
                            {product_packs.products?.description}
                        </Label>
                    </span>
                </div>

                <article
                    className="col-span-12 grid justify-between gap-2 rounded-lg border border-gray-200 sm:col-span-1 sm:space-x-4 sm:p-4 lg:grid-cols-12 lg:space-x-2 lg:p-6"
                    key={
                        eventOrderItem.event_order_cp_id +
                        '-' +
                        eventOrderItem.product_pack_id
                    }
                >
                    {eventOrderItem.product_packs && (
                        <>
                            <header className="col-span-12">
                                <h3 className="text-xl font-medium text-gray-900 hover:text-beer-draft">
                                    <p className="text-lg font-medium text-gray-900">
                                        {eventOrderItem.product_packs.name}
                                    </p>
                                </h3>
                            </header>

                            <figure className="aspect-w-1 aspect-h-1 sm:aspect-none col-span-4 h-20 w-auto flex-shrink-0 justify-center overflow-hidden rounded-lg lg:h-40 ">
                                <DisplayImageProduct
                                    width={120}
                                    height={120}
                                    alt={''}
                                    imgSrc={`${
                                        BASE_PRODUCTS_URL +
                                        decodeURIComponent(
                                            eventOrderItem.product_packs
                                                .img_url,
                                        )
                                    }`}
                                    class="h-full w-full object-cover object-center"
                                />
                            </figure>

                            <div className="col-span-8 flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-900 ">
                                    {formatCurrency(
                                        eventOrderItem.product_packs.price,
                                    )}
                                </p>

                                <span className="text-sm text-gray-900">
                                    <p>{t('quantity_in_pack')}:</p>

                                    <p className="font-medium">
                                        {eventOrderItem.product_packs.quantity}{' '}
                                        {t('units')}
                                    </p>
                                </span>

                                <span className="text-sm text-gray-900">
                                    <p>{t('quantity_bought')}:</p>
                                    <p className="font-medium">
                                        {eventOrderItem.quantity} {t('packs')}
                                    </p>
                                </span>
                            </div>
                        </>
                    )}
                </article>

                <article className="col-span-12 grid justify-between gap-2 rounded-lg border border-gray-200 sm:col-span-1 sm:p-4 lg:grid-cols-12 lg:p-6">
                    <div className="col-span-12 flex flex-col">
                        <span className="flex items-center text-lg">
                            {t('status')}
                            <p className="ml-2 rounded-full bg-beer-gold px-2 py-2 font-semibold">
                                {t(eventOrderItem.status)}
                            </p>
                        </span>

                        <span className="flex items-center text-lg">
                            {t('quantity_served')}
                            <p className="ml-2 rounded-full bg-beer-gold px-2 py-2 font-semibold">
                                {eventOrderItem.quantity_served} /{' '}
                                {eventOrderItem.quantity}
                            </p>
                        </span>
                    </div>

                    <div className="col-span-12 justify-self-center">
                        <GenerateQR
                            eventOrderItemId={eventOrderItemId}
                            domain={domain}
                        />
                    </div>
                </article>
            </section> */}

            {/* Review Product button */}
            {/* <div className="col-span-12 mt-6">
                <span className="font-medium text-gray-900">
                    {t('review_product')}
                </span>

                <div className="mt-3 space-y-3 text-beer-dark">
                    {eventOrderItem.is_reviewed && (
                        <span>{t('product_already_reviewed_condition')}</span>
                    )}

                    {eventOrderItem.status ===
                        EVENT_ORDER_ITEM_STATUS.INITIAL && (
                        <span>{t('write_review_condition')}</span>
                    )}

                    <Button
                        disabled={
                            eventOrderItem.is_reviewed ||
                            eventOrderItem.status ===
                                EVENT_ORDER_ITEM_STATUS.INITIAL
                                ? true
                                : false
                        }
                        primary
                        medium
                        class="my-6 font-medium text-beer-draft hover:text-beer-dark "
                        onClick={() => {
                            if (
                                product_packs &&
                                !eventOrderItem.is_reviewed &&
                                eventOrderItem.status !==
                                    EVENT_ORDER_ITEM_STATUS.INITIAL
                            ) {
                                handleOnClick(product_packs.product_id);
                            }
                        }}
                    >
                        {t('make_review_product_button')}
                    </Button>
                </div>
            </div> */}
        </section>
    );
}
