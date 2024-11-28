import React from 'react';
import { IEventOrder } from '@/lib/types/eventOrders';
import { User, Phone } from 'lucide-react';

interface Props {
    order: IEventOrder;
    actionButton: React.ReactNode;
}

const OrderCard = ({ order, actionButton }: Props) => {
    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-lg">#{order.order_number}</span>
                {actionButton}
            </div>

            <div className="mb-3">
                <div className="flex items-center text-gray-600 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    <span>{order.username}</span>
                </div>
                {order.user_phone && (
                    <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{order.user_phone}</span>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Productos:</h4>
                <ul className="space-y-1">
                    {order.items.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between text-sm"
                        >
                            <span className="font-medium">
                                {item.quantity}x {item.name}
                            </span>
                            <span className="text-gray-600">
                                €{(item.price * item.quantity).toFixed(2)}
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
                <span>€{order.total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default OrderCard;
