import React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { IBusinessOrder } from '../../../../../../lib/types/types';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../../../../../utils/formatCurrency';
import { IconButton } from '../../../../components/common/IconButton';
import { encodeBase64 } from '../../../../../../utils/utils';
import { formatDateString } from '../../../../../../utils/formatDate';
import {
    ROUTE_BUSINESS_ORDERS,
    ROUTE_DISTRIBUTOR,
    ROUTE_PROFILE,
} from '../../../../../../config';

interface Props {
    bOrder: IBusinessOrder;
    key: string;
}

export default function ODistributorTableData({ bOrder, key }: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    if (!bOrder) return null;

    const handleClickView = (bOrder_: IBusinessOrder) => {
        const Ds_MerchantParameters = encodeBase64(
            JSON.stringify({ Ds_Order: bOrder_.orders?.order_number }),
        );

        router.push(
            `/${locale}${ROUTE_DISTRIBUTOR}${ROUTE_PROFILE}${ROUTE_BUSINESS_ORDERS}/success?Ds_MerchantParameters=${Ds_MerchantParameters}`,
        );
    };

    return (
        <tr key={key} className="">
            <td className="px-6 py-4">{bOrder.orders?.order_number}</td>

            <td className="px-6 py-4">{bOrder.orders?.customer_name}</td>

            <td className="px-6 py-4">
                {bOrder.orders?.business_orders?.length}
            </td>

            <td className="px-6 py-4">
                {formatCurrency(bOrder.orders?.total ?? 0)}
            </td>

            <td className="px-6 py-4">{t(bOrder.orders?.status)}</td>

            <td className="px-6 py-4">{bOrder.orders?.tracking_id}</td>

            <td className="px-6 py-4">
                {formatDateString(bOrder.orders?.created_at ?? '')}
            </td>

            <td className="item-center flex justify-center gap-2 px-6 py-4">
                <IconButton
                    onClick={() => handleClickView(bOrder)}
                    icon={faTruck}
                    title={''}
                />
            </td>
        </tr>
    );
}
