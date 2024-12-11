import Label from '@/app/[locale]/components/ui/Label';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import useFetchEventCPOrderStatusById from '@/hooks/useFetchEventCPOrderStatus';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQueryClient } from 'react-query';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { UpdateEventCPOrderStatus } from '../../actions';
import { CheckCircle2, ChefHat, Clock, Play, X } from 'lucide-react';
import { EVENT_ORDER_CPS_STATUS, EventOrderCPSStatus } from '@/constants';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { EventOrderConfirmationDialog } from '@/app/[locale]/components/CP/EventOrderConfirmationDialog';

const statusIcons: Record<EventOrderCPSStatus, React.ComponentType<any>> = {
    not_started: Clock,
    pending: Clock,
    preparing: ChefHat,
    ready: CheckCircle2,
    completed: CheckCircle2,
    pending_payment: Clock,
    cancelled: X,
};

const statusColors: Record<EventOrderCPSStatus, string> = {
    not_started: 'text-gray-500 dark:text-gray-400',
    pending: 'text-yellow-500 dark:text-yellow-400',
    preparing: 'text-blue-500 dark:text-blue-400',
    ready: 'text-green-500 dark:text-green-400',
    completed: 'text-gray-500 dark:text-gray-400',
    pending_payment: 'text-yellow-500 dark:text-yellow-400',
    cancelled: 'text-red-500 dark:text-red-400',
};

const statusBackgrounds: Record<EventOrderCPSStatus, string> = {
    not_started: 'bg-gray-50 dark:bg-gray-700',
    pending: 'bg-yellow-50 dark:bg-yellow-900',
    preparing: 'bg-blue-50 dark:bg-blue-900',
    ready: 'bg-green-50 dark:bg-green-900',
    completed: 'bg-gray-50 dark:bg-gray-700',
    pending_payment: 'bg-yellow-50 dark:bg-yellow-900',
    cancelled: 'bg-red-50 dark:bg-red-900',
};

interface Props {
    orderCP: IEventOrderCPS;
}

const EventCPOrderCard: React.FC<Props> = ({ orderCP }) => {
    const t = useTranslations('event');
    const { handleMessage } = useMessage();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, error, isLoading } = useFetchEventCPOrderStatusById(
        orderCP.id,
    );

    const status = data?.status ?? orderCP.status;
    const Icon = statusIcons[status];

    const handleStartOrder = async () => {
        const res = await UpdateEventCPOrderStatus(
            orderCP.id,
            EVENT_ORDER_CPS_STATUS.PENDING,
        );

        if (res.status === 200) {
            setIsDialogOpen(false);
            handleMessage({
                type: 'success',
                message: t('success.order_started'),
            });
            queryClient.invalidateQueries([
                'event_order_cp_status',
                orderCP.id,
            ]);
        } else {
            handleMessage({
                type: 'error',
                message: t('errors.order_not_started'),
            });
        }
    };

    if (error) {
        return <div>Error: {JSON.stringify(error)}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div
                className={`${statusBackgrounds[status]} rounded-lg p-4 transition-all duration-300`}
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <Label
                            size="medium"
                            font="semibold"
                            className="dark:text-white"
                        >
                            {t('order_number_cps', {
                                orderNumber: orderCP.order_number,
                            })}
                        </Label>

                        <div
                            className={`flex items-center gap-2 ${statusColors[status]}`}
                        >
                            <Icon />
                            <Label
                                size="medium"
                                color="beer-draft"
                                className="dark:text-white"
                            >
                                {t(`${status}`)}
                            </Label>
                        </div>
                    </div>

                    {status === EVENT_ORDER_CPS_STATUS.NOT_STARTED && (
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            primary
                            small
                        >
                            <div className="flex gap-2 items-center">
                                <Play className="w-4 h-4 mr-2 text-beer-draft dark:text-white" />
                                <Label
                                    size="medium"
                                    font="semibold"
                                    color="beer-draft"
                                    className="dark:text-white"
                                >
                                    {t('start_order')}
                                </Label>
                            </div>
                        </Button>
                    )}
                </div>

                <div className="space-y-2 flex flex-col items-start">
                    <Label className="font-medium" size="small">
                        {t('products')}:
                    </Label>

                    <ul className="space-y-1 w-full">
                        {orderCP.event_order_items?.map((item) => (
                            <li
                                key={item.id}
                                className="flex justify-between text-sm space-x-4 bg-beer-softFoam dark:bg-gray-700 p-2 rounded-lg"
                            >
                                <Label
                                    size="small"
                                    className="dark:text-gray-200"
                                >
                                    {item.quantity} x {item.product_packs?.name}{' '}
                                    - {item.product_packs?.products?.name}
                                </Label>
                                <Label
                                    size="small"
                                    color="gray"
                                    className="dark:text-gray-300"
                                >
                                    {(
                                        (item.product_packs?.price ?? 0) *
                                        item.quantity
                                    ).toFixed(2)}{' '}
                                    €
                                </Label>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t mt-3 pt-3 flex justify-between font-medium space-x-4 w-full border-gray-200 dark:border-gray-600">
                        <Label
                            size="small"
                            color="black"
                            className="dark:text-white"
                        >
                            {t('total')}:
                        </Label>

                        <Label
                            size="small"
                            color="beer-draft"
                            font="semibold"
                            className="dark:text-beer-amber"
                        >
                            {orderCP.event_order_items
                                ?.reduce(
                                    (total, item) =>
                                        total +
                                        (item.product_packs?.price ?? 0) *
                                            item.quantity,
                                    0,
                                )
                                .toFixed(2)}{' '}
                            €
                        </Label>
                    </div>
                </div>
            </div>

            <EventOrderConfirmationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleStartOrder}
                title={t('confirm_start_order')}
                message={t('confirm_start_order_message', {
                    orderNumber: orderCP.order_number,
                })}
            />
        </>
    );
};

export default EventCPOrderCard;
