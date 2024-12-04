import Label from '@/app/[locale]/components/ui/Label';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import useFetchEventCPOrderStatusById from '@/hooks/useFetchEventCPOrderStatus';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQueryClient } from 'react-query';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { UpdateEventCPOrderStatus } from '../../actions';
import { CheckCircle2, ChefHat, Clock, Play } from 'lucide-react';
import { EVENT_ORDER_CPS_STATUS, EventOrderCPSStatus } from '@/constants';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { EventOrderConfirmationDialog } from '@/app/[locale]/components/CP/EventOrderConfirmationDialog';

const statusIcons: Record<EventOrderCPSStatus, React.ComponentType<any>> = {
    not_started: Clock,
    pending: Clock,
    preparing: ChefHat,
    ready: CheckCircle2,
    completed: CheckCircle2,
};

const statusColors: Record<EventOrderCPSStatus, string> = {
    not_started: 'text-gray-500',
    pending: 'text-yellow-500',
    preparing: 'text-blue-500',
    ready: 'text-green-500',
    completed: 'text-gray-500',
};

const statusBackgrounds: Record<EventOrderCPSStatus, string> = {
    not_started: 'bg-gray-50',
    pending: 'bg-yellow-50',
    preparing: 'bg-blue-50',
    ready: 'bg-green-50',
    completed: 'bg-gray-50',
};

interface Props {
    order: IEventOrderCPS;
}

const EventCPOrderCard: React.FC<Props> = ({ order }) => {
    const t = useTranslations('event');
    const { handleMessage } = useMessage();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, error, isLoading } = useFetchEventCPOrderStatusById(order.id);

    const status = data?.status ?? order.status;
    const Icon = statusIcons[status];

    const handleStartOrder = async () => {
        const res = await UpdateEventCPOrderStatus(
            order.id,
            EVENT_ORDER_CPS_STATUS.PENDING,
        );

        if (res.status === 200) {
            setIsDialogOpen(false);
            handleMessage({
                type: 'success',
                message: t('success.order_started'),
            });
            queryClient.invalidateQueries(['event_order_cp_status', order.id]);
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
                        <Label size="medium" font="semibold">
                            {t('order_number_cps', {
                                orderNumber: order.order_number,
                            })}
                        </Label>

                        <div
                            className={`flex items-center gap-2 ${statusColors[status]}`}
                        >
                            <Icon />
                            <Label size="medium" color="beer-draft">
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
                            <div className="flex gap-2 items-center ">
                                <Play className="w-4 h-4 mr-2 text-beer-draft" />
                                <Label
                                    size="medium"
                                    font="semibold"
                                    color="beer-draft"
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
                        {order.event_order_items?.map((item) => (
                            <li
                                key={item.id}
                                className="flex justify-between text-sm space-x-4 bg-beer-softFoam p-2 rounded-lg"
                            >
                                <Label size="small">
                                    {item.quantity} x {item.product_packs?.name}
                                </Label>
                                <Label size="small" color="gray">
                                    {(
                                        (item.product_packs?.price ?? 0) *
                                        item.quantity
                                    ).toFixed(2)}
                                    €
                                </Label>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t mt-3 pt-3 flex justify-between font-medium space-x-4 w-full">
                        <Label size="small" color="black">
                            {t('total')}:
                        </Label>

                        <Label size="small" color="beer-draft" font="semibold">
                            {order.event_order_items
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
                    orderNumber: order.order_number,
                })}
            />
        </>
    );
};

export default EventCPOrderCard;
