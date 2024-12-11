// pages/orders/lookup.tsx

'use client';

import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import SuccessCheckoutInSitePayment from '../../../../../(common-display)/checkout/event/success/in_site_payment/SuccessCheckoutInSitePayment';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const OrderLookup = () => {
    const t = useTranslations('event');
    const [email, setEmail] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [order, setOrder] = useState<any>();
    const [error, setError] = useState('');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setOrder(null);

        try {
            const res = await fetch(
                `${baseUrl}/api/event_shopping_basket/event_order/lookup_guest?email=${email}&order_number=${orderNumber}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                },
            );

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
        <div className="p-6 m-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Title size="large" color="gray">
                {t('lookup_order')}
            </Title>

            <form
                onSubmit={handleLookup}
                className="space-y-4 bg-gray-200 dark:bg-gray-700 p-4 rounded-lg"
            >
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
                <SuccessCheckoutInSitePayment order={order} isError={!order} />
            )}
        </div>
    );
};

export default OrderLookup;
