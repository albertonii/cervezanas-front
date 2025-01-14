import ProducerCard from '@/app/[locale]/components/cards/ProducerCard';
import OrderItemCard from '@/app/[locale]/components/common/OrderItemCard';
import DistributorProductBusinnesInformation from './DistributorProductBusinnesInformation';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useQueryClient } from 'react-query';
import { DISTRIBUTOR_ONLINE_ORDER_STATUS } from '@/constants';
import { IBusinessOrder, IOrderItem } from '@/lib/types/types';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

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
    // const t = useTranslations();
    // const { supabase } = useAuth();
    // const queryClient = useQueryClient();

    const orderItems = bOrder.order_items;

    // const { handleMessage } = useMessage();

    // const submitSuccessMessage = t('messages.updated_successfully');
    // const submitErrorMessage = t('messages.updated_error');

    // const [bOrderStatus, setBOrderStatus] = React.useState(bOrder.status);

    // const handleBOrderStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const status = e.target.value;
    //     setBOrderStatus(status);
    //     onClickOrderStatus(status);
    //     setPackStatusArray((prev) => {
    //         const newArray = [...prev];
    //         newArray[index] = status;
    //         return newArray;
    //     });
    // };

    // // Update the status of the business_order
    // const onClickOrderStatus = async (status: string) => {
    //     const { error } = await supabase
    //         .from('business_orders')
    //         .update({ status })
    //         .eq('id', bOrder.id)
    //         .select();

    //     if (error) {
    //         handleMessage({
    //             type: 'error',
    //             message: submitErrorMessage,
    //         });
    //         throw error;
    //     }

    //     queryClient.invalidateQueries('distribution');

    //     handleMessage({
    //         type: 'success',
    //         message: submitSuccessMessage,
    //     });
    // };

    return (
        <section className="relative border-separate space-y-8 rounded-lg border bg-beer-foam p-2">
            {/* Input select que actualizará el estado para ese business_order  */}
            {/* <select
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
            </select> */}
            {/* 
            <StatusTimeline
                status={bOrderStatus}
                orderType={'distributor_online'}
            /> */}

            <section className="grid grid-cols-1 gap-x-2 space-y-4 lg:grid-cols-2 md:gap-x-4 w-full">
                {/* Display the product information for this pack  */}
                {bOrder.order_items && (
                    <div className="col-span-2">
                        <DistributorProductBusinnesInformation
                            bOrder={bOrder}
                        />
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

                {/* Producer information data  */}
                {bOrder.producer_user && (
                    <div className="col-span-2 md:col-span-1">
                        <ProducerCard bOrder={bOrder} />
                    </div>
                )}
            </section>
        </section>
    );
}
