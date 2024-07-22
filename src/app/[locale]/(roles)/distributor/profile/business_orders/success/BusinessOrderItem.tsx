import Link from 'next/link';
import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { DISTRIBUTOR_ONLINE_ORDER_STATUS, SupabaseProps } from '@/constants';
import { IBusinessOrder, IOrderItem } from '@/lib/types/types';
import DisplayImageProduct from '@/app/[locale]/components/common/DisplayImageProduct';
import { formatCurrency } from '@/utils/formatCurrency';
import { StatusTimeline } from '@/app/[locale]/components/StatusTimeline';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { useQueryClient } from 'react-query';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
    bOrder: IBusinessOrder;
    setPackStatusArray: React.Dispatch<React.SetStateAction<string[]>>;
    index: number;
}

export default function BusinessOrderItem({
    bOrder,
    setPackStatusArray,
    index,
}: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const { supabase } = useAuth();
    const queryClient = useQueryClient();
    const { handleMessage } = useMessage();

    const submitSuccessMessage = t('messages.updated_successfully');
    const submitErrorMessage = t('messages.updated_error');

    const [bOrderStatus, setBOrderStatus] = React.useState(bOrder.status);

    const handleBOrderStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        setBOrderStatus(status);
        onClickOrderStatus(status);
        setPackStatusArray((prev) => {
            const newArray = [...prev];
            newArray[index] = status;
            return newArray;
        });
    };

    // Update the status of the business_order
    const onClickOrderStatus = async (status: string) => {
        const { error } = await supabase
            .from('business_orders')
            .update({ status })
            .eq('id', bOrder.id)
            .select();

        if (error) {
            handleMessage({
                type: 'error',
                message: submitErrorMessage,
            });
            throw error;
        }

        queryClient.invalidateQueries('distribution');

        handleMessage({
            type: 'success',
            message: submitSuccessMessage,
        });
    };

    return (
        <section className="relative border-separate space-y-8 rounded-lg border p-2">
            {/* Input select que actualizará el estado para ese business_order  */}
            <select
                id="status"
                name="status"
                autoComplete="status"
                className="absolute right-0 top-0 m-2 block rounded-md border-gray-300 pl-3 pr-10 focus:border-beer-blonde focus:outline-none focus:ring-beer-blonde sm:text-sm md:text-base"
                onChange={(e) => handleBOrderStatus(e)}
                value={bOrderStatus}
            >
                <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.PENDING}>
                    {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.PENDING)}
                </option>
                <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.PROCESSING}>
                    {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.PROCESSING)}
                </option>
                <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.IN_TRANSIT}>
                    {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.IN_TRANSIT)}
                </option>
                <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.SHIPPED}>
                    {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.SHIPPED)}
                </option>
                <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.DELIVERED}>
                    {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.DELIVERED)}
                </option>
                <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.CANCELLED}>
                    {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.CANCELLED)}
                </option>
                <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.ERROR}>
                    {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.ERROR)}
                </option>
            </select>

            <StatusTimeline
                status={bOrderStatus}
                orderType={'distributor_online'}
            />

            <section className="grid grid-cols-1 gap-x-2 space-y-4 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-2 lg:gap-x-4">
                {/* Display the product information for this pack  */}
                {bOrder.order_items && (
                    <div className="col-span-2">
                        <h3 className="text-xl font-medium text-gray-900 hover:text-beer-draft">
                            <Link
                                href={`/products/${bOrder.order_items[0].product_packs?.products?.id}`}
                                locale={locale}
                            >
                                {t('name')}:{' '}
                                {
                                    bOrder.order_items[0].product_packs
                                        ?.products?.name
                                }
                            </Link>
                        </h3>

                        <span className="space-y-1">
                            <p className="text-sm text-gray-500">
                                {t('description')}
                            </p>
                            <p className="truncate">
                                {
                                    bOrder.order_items[0].product_packs
                                        ?.products?.description
                                }
                            </p>
                        </span>
                    </div>
                )}

                {bOrder.order_items?.map((orderItem: IOrderItem) => {
                    if (!orderItem.product_packs) return <></>;

                    return (
                        <fieldset
                            className="grid grid-cols-1 justify-between gap-2 rounded-lg border border-gray-200 sm:space-x-4 sm:p-4 lg:grid-cols-4 lg:space-x-2 lg:p-6"
                            key={
                                orderItem.business_order_id +
                                '-' +
                                orderItem.product_pack_id
                            }
                        >
                            <legend className="text-lg">
                                {orderItem.product_packs.name}
                            </legend>

                            <figure className="aspect-w-1 aspect-h-1 sm:aspect-none col-span-2 h-20 w-auto flex-shrink-0 justify-center overflow-hidden rounded-lg md:col-span-1 lg:h-32 ">
                                {
                                    <DisplayImageProduct
                                        width={120}
                                        height={120}
                                        alt={''}
                                        imgSrc={`${
                                            BASE_PRODUCTS_URL +
                                            decodeURIComponent(
                                                orderItem.product_packs.img_url,
                                            )
                                        }`}
                                        class="h-full w-full object-cover object-center"
                                    />
                                }
                            </figure>

                            <section className="col-span-2 flex flex-row gap-2 md:col-span-3">
                                <div className="w-full">
                                    <span className="space-y-1">
                                        <p className="text-sm text-gray-500">
                                            {t('product_price')}
                                        </p>
                                        <p className="text-medium truncate font-medium text-gray-900 hover:text-beer-draft">
                                            {formatCurrency(
                                                orderItem.product_packs.price,
                                            )}
                                        </p>
                                    </span>

                                    <span className="space-y-1">
                                        <p className="text-sm text-gray-500">
                                            {t('quantity_in_pack')}
                                        </p>
                                        <p className="truncate">
                                            {orderItem.product_packs.quantity}{' '}
                                            {t('units')}
                                        </p>
                                    </span>

                                    <span className="space-y-1">
                                        <p className="text-sm text-gray-500">
                                            {t('quantity_bought')}
                                        </p>
                                        <p className="truncate">
                                            {orderItem.quantity} {t('packs')}
                                        </p>
                                    </span>
                                </div>

                                <div className="w-full self-center">
                                    <span className="space-y-1 text-center">
                                        <p className="text-base text-gray-500 md:text-xl">
                                            {t('total')}
                                        </p>
                                        <p className="truncate text-base font-semibold md:text-2xl">
                                            {formatCurrency(
                                                orderItem.quantity *
                                                    orderItem.product_packs
                                                        .price,
                                            )}
                                        </p>
                                    </span>
                                </div>
                            </section>
                        </fieldset>
                    );
                })}
            </section>
        </section>
    );
}
