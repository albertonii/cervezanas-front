import React from 'react';
import Label from '@/app/[locale]/components/ui/Label';
import { User } from 'lucide-react';
import { IEventOrderCPS } from '@/lib/types/eventOrders';

interface Props {
    order: IEventOrderCPS;
    actionButton: React.ReactNode;
}

const EventOrderCard = ({ order, actionButton }: Props) => {
    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col-reverse gap-2 xl:gap-0 xl:flex-row justify-between items-center mb-3">
                <Label className="font-bold text-lg">
                    #{order.order_number}
                </Label>
                {actionButton}
            </div>

            <div className="mb-3">
                <div className="flex items-center mb-2">
                    <User className="w-4 h-4 mr-2" />
                    <Label size="small" color="gray">
                        {order.event_orders?.users?.username}
                    </Label>
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Productos:</h4>
                <ul className="space-y-1">
                    {order.event_order_items?.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between text-sm"
                        >
                            <Label size="small" font="medium">
                                {item.quantity}x {item.product_packs?.name}
                            </Label>
                            <Label size="small" color="gray">
                                €
                                {(
                                    item.product_packs?.price! * item.quantity
                                ).toFixed(2)}
                            </Label>
                        </li>
                    ))}
                </ul>
            </div>

            {order.notes && (
                <div className="mt-3 p-2 bg-yellow-50 rounded-md">
                    <Label size="small" color="yellow">
                        <span className="font-medium">Nota:</span> {order.notes}
                    </Label>
                </div>
            )}

            <div className="mt-3 pt-3 border-t flex justify-between font-medium">
                <Label size="small">Total:</Label>
                <Label size="small" color="beer-draft" font="semibold">
                    €{order.event_orders?.total.toFixed(2)}
                </Label>
            </div>
        </div>
    );
};

export default EventOrderCard;
