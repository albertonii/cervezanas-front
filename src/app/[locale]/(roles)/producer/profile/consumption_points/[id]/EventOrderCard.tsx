import React from 'react';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { User, Phone } from 'lucide-react';

interface Props {
    order: IEventOrderCPS;
    actionButton: React.ReactNode;
}

const EventOrderCard = ({ order, actionButton }: Props) => {
    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-lg">#{order.order_number}</span>
                {actionButton}
            </div>

            <div className="mb-3">
                <div className="flex items-center text-gray-600 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    <span>{order.event_orders?.users?.username}</span>
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
                            <span className="font-medium">
                                {item.quantity}x {item.product_packs?.name}
                            </span>
                            <span className="text-gray-600">
                                €
                                {(
                                    item.product_packs?.price! * item.quantity
                                ).toFixed(2)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {order.notes && (
                <div className="mt-3 p-2 bg-yellow-50 rounded-md">
                    <p className="text-sm text-yellow-800">
                        <span className="font-medium">Nota:</span> {order.notes}
                    </p>
                </div>
            )}

            <div className="mt-3 pt-3 border-t flex justify-between font-medium">
                <span>Total:</span>
                <span>€{order.event_orders?.total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default EventOrderCard;
