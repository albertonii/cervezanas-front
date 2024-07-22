import Link from 'next/link';
import React from 'react';
import useBoxPackStore from '@/app/store//boxPackStore';
import { useLocale, useTranslations } from 'next-intl';
import { ROUTE_PRODUCTS } from '@/config';

export default function BoxProductSlotsSelection() {
    const t = useTranslations();
    const locale = useLocale();
    const { boxPack } = useBoxPackStore();

    return (
        <table className="block border-2 rounded-lg shadow-lg w-full h-full overflow-y-scroll text-center text-sm">
            <thead className="bg-beer-gold text-beer-foam text-xs uppercase dark:bg-gray-700 dark:text-gray-400">
                <tr className="grid grid-cols-3">
                    <th scope="col cols-span-1" className="px-6 py-3 ">
                        {t('name_header')}
                    </th>

                    <th scope="col cols-span-1" className="px-6 py-3 ">
                        {t('quantity_in_pack_header')}
                    </th>

                    <th scope="col cols-span-1" className="px-6 py-3 ">
                        {t('slots_per_product')}
                    </th>
                </tr>
            </thead>

            <tbody>
                {boxPack.boxPackItems.map((item) => (
                    <tr key={item.id} className="grid grid-cols-3">
                        <td className="space-x-2 px-4 py-2 font-semibold hover:cursor-pointer hover:text-beer-draft cols-span-1">
                            <Link
                                target={'_blank'}
                                href={`${ROUTE_PRODUCTS}/${item.product_id}`}
                                locale={locale}
                            >
                                {item.products?.name}
                            </Link>
                        </td>

                        <td className="space-x-2 px-6 py-4 font-semibold cols-span-1">
                            {item.quantity}
                        </td>

                        <td className="space-x-2 px-6 py-4 font-semibold cols-span-1">
                            {item.slots_per_product}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
