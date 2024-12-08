'use client';

import Label from '@/app/[locale]/components/ui/Label';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import useFetchEventOrdersByCPId from '@/hooks/useFetchEventOrdersByCPId';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { OrderActions } from './OrderActions';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { PendingPaymentColumn } from './PendingPaymentColumn';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { OrdersQueueColumnManager } from './OrdersQueueColumnManager';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

interface Props {
    cp: IConsumptionPointEvent;
}

export function OrdersQueue({ cp }: Props) {
    const t = useTranslations('event');
    const { handleMessage } = useMessage();
    const { supabase } = useAuth();

    const { data, isError, isLoading } = useFetchEventOrdersByCPId(cp.id);

    const [orders, setOrders] = useState<IEventOrderCPS[]>([]);
    const [pendingOrders, setPendingOrders] = useState<IEventOrderCPS[]>([]);
    const [preparingOrders, setPreparingOrders] = useState<IEventOrderCPS[]>(
        [],
    );
    const [readyOrders, setReadyOrders] = useState<IEventOrderCPS[]>([]);
    const [pendingPaymentOrders, setPendingPaymentOrders] = useState<
        IEventOrderCPS[]
    >([]);

    useEffect(() => {
        if (data) {
            setOrders(data);
        }
    }, [data]);

    useEffect(() => {
        setPendingOrders(orders.filter((o) => o.status === 'pending'));
        setPreparingOrders(orders.filter((o) => o.status === 'preparing'));
        setReadyOrders(orders.filter((o) => o.status === 'ready'));
        setPendingPaymentOrders(orders.filter((o) => o.has_pending_payment));
    }, [orders]);

    // Importa el tipo correcto

    const handleUpdateStatus = async (
        orderId: string,
        newStatus: any, // Cambiado de IEventOrder['status'] a EventOrderCPSStatus
    ) => {
        try {
            // Actualizar el estado localmente
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId
                        ? { ...order, status: newStatus }
                        : order,
                ),
            );

            // Actualizar en Supabase
            const { error } = await supabase
                .from('event_order_cps')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) {
                handleMessage({
                    message: 'Error al actualizar el pedido',
                    type: 'error',
                });
            } else if (newStatus === 'ready') {
                handleMessage({
                    message: `¡Pedido actualizado a listo!`,
                    type: 'success',
                });
            }
        } catch (err) {
            handleMessage({
                message: 'Error al actualizar el pedido',
                type: 'error',
            });
        }
    };

    return (
        <div>
            {isError && (
                <div className="bg-red-50 p-4 rounded-lg">
                    <Label size="medium" color="red" font="bold">
                        {t('error_loading_orders')}
                    </Label>
                </div>
            )}

            {isLoading ? (
                <Spinner color="blonde" size="large" />
            ) : (
                <>
                    <OrdersQueueColumnManager
                        isPendingPayment={cp.has_pending_payment}
                        viewConfig={
                            cp.view_configuration as
                                | 'one_step'
                                | 'two_steps'
                                | 'three_steps'
                        }
                        pendingPaymentOrders={pendingPaymentOrders}
                        pendingOrders={pendingOrders}
                        preparingOrders={preparingOrders}
                        readyOrders={readyOrders}
                        generateActionButton={(id, status) => (
                            <OrderActions
                                orderId={id}
                                status={status}
                                handleUpdateStatus={handleUpdateStatus}
                                viewConfiguration={cp.view_configuration}
                            />
                        )}
                    />
                </>
            )}
        </div>
    );
}
