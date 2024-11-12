import Link from 'next/link';
import TR from '../../ui/table/TR';
import TH from '../../ui/table/TH';
import TD from '../../ui/table/TD';
import TBody from '../../ui/table/TBody';
import Table from '../../ui/table/Table';
import THead from '../../ui/table/THead';
import useBoxPackStore from '@/app/store//boxPackStore';
import React from 'react';
import { ROUTE_PRODUCTS } from '@/config';
import { useLocale, useTranslations } from 'next-intl';

export default function BoxProductSlotsSelection() {
    const t = useTranslations();
    const locale = useLocale();
    const { boxPack } = useBoxPackStore();

    return (
        <Table>
            <THead>
                <TR class_="grid grid-cols-3 items-center">
                    <TH class_="cols-span-1">{t('name_header')}</TH>

                    <TH class_="cols-span-1">{t('quantity_in_pack_header')}</TH>

                    <TH class_="cols-span-1">{t('slots_per_product')}</TH>
                </TR>
            </THead>

            <TBody>
                {boxPack.boxPackItems.map((item) => (
                    <TR key={item.id} class_="grid grid-cols-3">
                        <TD class_="hover:cursor-pointer hover:text-beer-draft cols-span-1">
                            <Link
                                target={'_blank'}
                                href={`${ROUTE_PRODUCTS}/${item.product_id}`}
                                locale={locale}
                            >
                                {item.products?.name}
                            </Link>
                        </TD>

                        <TD class_="cols-span-1">{item.quantity}</TD>

                        <TD class_="cols-span-1">{item.slots_per_product}</TD>
                    </TR>
                ))}
            </TBody>
        </Table>
    );
}
