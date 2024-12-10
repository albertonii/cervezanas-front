// pages/orders/lookup.tsx

'use client';

import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IEventOrder } from '@/lib/types/eventOrders';
import { formatCurrency } from '@/utils/formatCurrency';

interface Props {
    order: IEventOrder | null;
}

const OrderLookup = ({ order: order_ }: Props) => {
    const t = useTranslations('order');
    const [email, setEmail] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [order, setOrder] = useState<any>(order_);
    const [error, setError] = useState('');

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setOrder(null);

        try {
            const res = await fetch('/api/orders/lookup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, orderNumber }),
            });

            const data = await res.json();

            if (res.ok) {
                setOrder(data.order);
            } else {
                setError(data.message || 'No se encontró la orden.');
            }
        } catch (err) {
            console.error(err);
            setError('Error al buscar la orden.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Title size="large" color="gray">
                {t('lookup_order')}
            </Title>
            <form onSubmit={handleLookup} className="space-y-4 mt-4">
                <div>
                    <Label htmlFor="email">{t('email')}</Label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="tu-email@ejemplo.com"
                    />
                </div>
                <div>
                    <Label htmlFor="orderNumber">{t('order_number')}</Label>
                    <input
                        type="text"
                        id="orderNumber"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ON-1234"
                    />
                </div>
                <Button btnType="submit" large primary>
                    {t('lookup')}
                </Button>
            </form>

            {error && <p className="mt-4 text-red-500">{error}</p>}

            {order && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
                    <Title size="medium" color="gray">
                        {t('order_details')}
                    </Title>
                    <div className="mt-2 text-left">
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>{t('order_number')}:</strong>{' '}
                            {order.order_number}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>{t('subtotal')}:</strong>{' '}
                            {formatCurrency(order.subtotal)}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>{t('discount')}:</strong>{' '}
                            {formatCurrency(order.discount)}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>{t('tax')}:</strong>{' '}
                            {formatCurrency(order.tax)}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>{t('total')}:</strong>{' '}
                            {formatCurrency(order.total)}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>{t('payment_method')}:</strong>{' '}
                            {t(`payment_methods.${order.payment_method}`)}
                        </p>
                        {/* Añadir más detalles según sea necesario */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderLookup;
