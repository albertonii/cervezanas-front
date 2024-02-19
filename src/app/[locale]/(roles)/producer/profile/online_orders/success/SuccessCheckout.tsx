'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { IBusinessOrder, IOrder } from '../../../../../../../lib/types';
import { formatDateString } from '../../../../../../../utils/formatDate';
import { formatCurrency } from '../../../../../../../utils/formatCurrency';
import BusinessOrderItem from './BusinessOrderItem';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { ONLINE_ORDER_STATUS } from '../../../../../../../constants';
interface Props {
  isError?: boolean;
  order: IOrder;
}

export default function SuccessCheckout({ order, isError }: Props) {
  const { business_orders: bOrders } = order;

  const t = useTranslations();
  const locale = useLocale();
  const { supabase } = useAuth();

  const [packStatusArray, setPackStatusArray] = useState<string[]>(
    bOrders?.map((bOrder: IBusinessOrder) => bOrder.status) ?? [],
  );

  const [orderStatus, setOrderStatus] = useState<string>(order.status);

  useEffect(() => {
    // Dependiendo del estado de los business orders, el estado del pedido será:
    // El orden de prioridades que debe seguir los estados es 1. pending, 2. processing, 3. in_transit, 4. shipped 5. delivered
    // Por lo que, si todos los business_orders alcanzan el mismo estado, lo mostrarán. Pero si hay alguno que tenga un estado "inferior" la orden de compra tendrá el estado inferior de todos ellos.
    // Por ejemplo, si hay 3 business_orders con estado "processing" y 1 con estado "pending", el estado de la orden de compra será "pending"
    // Si hay 3 business_orders con estado "in_transit" y 1 con estado "shipped", el estado de la orden de compra será "in_transit"
    // Si hay 3 business_orders con estado "shipped" y 1 con estado "delivered", el estado de la orden de compra será "shipped"
    // Si hay 3 business_orders con estado "delivered" y 1 con estado "processing", el estado de la orden de compra será "processing"

    // Diccionario al que se pueda acceder para consultar el peso de cada estado
    const statusWeight = new Map([
      ['pending', 1],
      ['processing', 2],
      ['in_transit', 3],
      ['shipped', 4],
      ['delivered', 5],
      ['cancelled', 6],
      ['error', 7],
    ]);

    // Obtenemos el estado de la orden de compra
    const orderStatus = packStatusArray?.reduce((prev, curr) => {
      // Devolvemos el estado con menor peso y teniendo en cuenta que puede ser undefined
      const prevStatus = statusWeight.get(prev);
      const currStatus = statusWeight.get(curr);

      if (prevStatus === undefined && currStatus === undefined) return prev;

      if (prevStatus === undefined) return curr;

      if (currStatus === undefined) return prev;

      if (prevStatus === 6 || currStatus === 6) return 'cancelled';

      if (prevStatus === 7 || currStatus === 7) return 'error';

      return prevStatus < currStatus ? prev : curr;
    });

    setOrderStatus(orderStatus);
  }, [packStatusArray]);

  useEffect(() => {
    const updateOrderStatus = async () => {
      const { error } = await supabase
        .from('orders')
        .update({ status: orderStatus })
        .eq('id', order.id)
        .select();

      if (error) console.error(error);
    };

    if (orderStatus !== order.status) updateOrderStatus();
  }, [orderStatus]);

  if (isError) {
    return (
      <section className="mx-auto sm:py-4 lg:py-6">
        <div className="flex flex-col space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
          <span className="flex sm:items-baseline sm:space-x-4">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {t('order_erorr')}
            </h1>
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="m-4 space-y-8 sm:py-4 lg:py-6">
      <section className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
        <div className="flex flex-col">
          <span className="flex sm:items-baseline sm:space-x-4">
            <h1 className="text-xl font-extrabold tracking-tight text-beer-dark sm:text-2xl">
              {t('order_number')} #{order.order_number}
            </h1>
          </span>

          {/* Order Status  */}
          <div className="right-0 col-span-12 pr-12 md:col-span-4 md:mt-2 ">
            <span className="text-lg font-medium text-beer-dark sm:text-xl">
              {t('order_status')}:
              <span
                className={`ml-2 ${
                  orderStatus === ONLINE_ORDER_STATUS.DELIVERED
                    ? 'text-green-600'
                    : 'text-beer-draft'
                } `}
              >
                {t(orderStatus)}
              </span>
            </span>
          </div>

          {/* Información del usuario que ha realizado la compra de manera minimalista y UX/UI friendly */}
          <div className="mt-4 grid grid-cols-2 gap-2 space-y-2 sm:items-baseline sm:space-y-0">
            <h1 className="col-span-3 text-lg tracking-tight text-gray-900 sm:text-xl">
              {t('customer_info')}
            </h1>

            <span className="flex items-center gap-2 text-gray-900 ">
              {t('name')}:
              <Link
                href={`/c-info/${order.owner_id}`}
                locale={locale}
                target={'_blank'}
              >
                <h2 className="font-extrabold tracking-tight hover:cursor-pointer hover:text-beer-draft ">
                  {order.shipping_info?.name} {order.shipping_info?.lastname}
                </h2>
              </Link>
            </span>

            <span className="flex items-center gap-2 text-gray-900 ">
              {t('phone')}:
              <h2 className="font-extrabold tracking-tight">
                {order.shipping_info?.phone}
              </h2>
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          {t('status_order_placed')}
          <time dateTime="2021-03-22" className="font-medium text-gray-900">
            {formatDateString(order.issue_date.toString())}
          </time>
        </p>
      </section>

      {/* Product and packs information */}
      <section className="space-y-8 border-gray-200 bg-white px-4 py-4 shadow-sm sm:rounded-lg sm:border">
        {bOrders &&
          bOrders.map((bOrder: IBusinessOrder, index: number) => (
            <article key={bOrder.id} className="py-4">
              <BusinessOrderItem
                bOrder={bOrder}
                setPackStatusArray={setPackStatusArray}
                index={index}
              />
            </article>
          ))}
      </section>

      {/* <!-- Shipping --> */}
      <section className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
        {order.shipping_info && (
          <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
            <div>
              <dt className="font-medium text-gray-900">
                {t('shipping_address')}
              </dt>

              <dd className="mt-3 text-gray-500">
                <span className="block font-semibold">
                  {order.shipping_info.name} {order.shipping_info.lastname}
                </span>
                <span className="block">
                  {order.shipping_info.address}, {order.shipping_info.city},
                  {order.shipping_info.state}, {order.shipping_info.zipcode},
                  {order.shipping_info.country}
                </span>

                {order.shipping_info.address_extra && (
                  <>
                    <span className="block">
                      {order.shipping_info.address_extra}
                    </span>
                    <span className="block">
                      {order.shipping_info.address_observations}
                    </span>
                  </>
                )}
              </dd>
            </div>
          </dl>
        )}
      </section>

      {/* <!-- Billing --> */}
      <section className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
        {order.billing_info && (
          <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
            <address>
              <dt className="font-medium text-gray-900">
                {t('billing_address')}
              </dt>

              <dd className="mt-3 text-gray-500">
                <span className="block font-semibold">
                  {order.billing_info.name} {order.billing_info.lastname}
                </span>
                <span className="block">
                  {order.billing_info.address}, {order.billing_info.city},
                  {order.billing_info.state}, {order.billing_info.zipcode},
                  {order.billing_info.country}
                </span>
              </dd>
            </address>

            <div>
              <dt className="font-medium text-gray-900">
                {t('payment_information')}
              </dt>
              <div className="mt-3">
                <dd className="-ml-4 -mt-4 flex flex-wrap">
                  <div className="ml-4 mt-4 flex-shrink-0">
                    <svg
                      aria-hidden="true"
                      width="36"
                      height="24"
                      viewBox="0 0 36 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-auto"
                    >
                      <rect width="36" height="24" rx="4" fill="#224DBA" />
                      <path
                        d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                        fill="#fff"
                      />
                    </svg>
                    <p className="sr-only">Visa</p>
                  </div>
                  <div className="ml-4 mt-4">
                    <p className="text-gray-900">{t('ending_with')} 4242</p>
                    <p className="text-gray-600">{t('expires_at')} 02 / 24</p>
                  </div>
                </dd>
              </div>
            </div>
          </dl>
        )}

        <dl className="mt-8 divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0">
          <div className="flex items-center justify-between pb-4">
            <dt className="text-gray-600">{t('subtotal')}</dt>
            <dd className="font-medium text-gray-900">
              {formatCurrency(order.subtotal)}
            </dd>
          </div>
          <div className="flex items-center justify-between pb-4">
            <dt className="text-gray-600">{t('discount')}</dt>
            <dd className="font-medium text-gray-900">
              {t('discount_code')} {order.discount_code} {' - '}{' '}
              {formatCurrency(order.discount)}
            </dd>
          </div>
          <div className="flex items-center justify-between py-4">
            <dt className="text-gray-600">{t('shipping')}</dt>
            <dd className="font-medium text-gray-900">
              {formatCurrency(order.shipping)}
            </dd>
          </div>
          <div className="flex items-center justify-between py-4">
            <dt className="text-gray-600">{t('tax')}</dt>
            <dd className="font-medium text-gray-900">
              {formatCurrency(order.tax)}
            </dd>
          </div>
          <div className="flex items-center justify-between pt-4">
            <dt className="font-medium text-gray-900">{t('total')}</dt>
            <dd className="font-medium text-beer-draft">
              {formatCurrency(order.total)}
            </dd>
          </div>
        </dl>
      </section>
    </section>
  );
}
